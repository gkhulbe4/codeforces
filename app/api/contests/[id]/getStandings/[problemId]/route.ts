import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(
  req: NextRequest,
  { params }: { params: { id: string; problemId: string } },
) {
  const contestId = params.id;
  const problemId = params.problemId;
  try {
    const participants = await prisma.contestParticipant.findMany({
      where: {
        contestId,
      },
    });

    const d = await Promise.all(
      participants.map(async (p) => {
        const participantSub = await prisma.submission.findMany({
          where: {
            userId: p.userId,
            problemId,
            contestId,
          },
          select: {
            verdict: true,
            createdAt: true,
          },
        });
        return {
          userId: p.userId,
          submissions: participantSub,
        };
      }),
    );
    return NextResponse.json(participants);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
