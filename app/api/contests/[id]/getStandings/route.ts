import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: contestId } = await params;

  try {
    // Get all participants for this contest
    const participants = await prisma.contestParticipant.findMany({
      where: {
        contestId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Get contest details to know the start time
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: {
        startTime: true,
        contestProblems: {
          select: {
            problemId: true,
          },
        },
      },
    });

    if (!contest) {
      return NextResponse.json(
        { message: "Contest not found" },
        { status: 404 },
      );
    }

    const problemIds = contest.contestProblems.map((cp) => cp.problemId);

    // Calculate standings for each participant
    const standings = await Promise.all(
      participants.map(async (participant) => {
        // Get all AC submissions for this user in this contest
        const acSubmissions = await prisma.submission.findMany({
          where: {
            userId: participant.userId,
            contestId,
            problemId: { in: problemIds },
            verdict: "AC",
          },
          select: {
            problemId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        // Get unique problems solved (first AC for each problem)
        const solvedProblems = new Map<string, Date>();
        acSubmissions.forEach((sub) => {
          if (!solvedProblems.has(sub.problemId)) {
            solvedProblems.set(sub.problemId, sub.createdAt);
          }
        });

        // Calculate total time (sum of time taken for each problem from contest start)
        let totalTimeMs = 0;
        const contestStartTime = new Date(contest.startTime);

        solvedProblems.forEach((solveTime) => {
          const timeTaken = solveTime.getTime() - contestStartTime.getTime();
          totalTimeMs += timeTaken;
        });

        return {
          userId: participant.user.id,
          userName: participant.user.name || participant.user.email,
          problemsSolved: solvedProblems.size,
          totalTimeMs,
        };
      }),
    );

    // Sort standings: first by problems solved (descending), then by time (ascending)
    standings.sort((a, b) => {
      if (b.problemsSolved !== a.problemsSolved) {
        return b.problemsSolved - a.problemsSolved;
      }
      return a.totalTimeMs - b.totalTimeMs;
    });

    // Add rank
    const rankedStandings = standings.map((standing, index) => ({
      rank: index + 1,
      ...standing,
    }));

    console.log(rankedStandings);

    return NextResponse.json(rankedStandings);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
