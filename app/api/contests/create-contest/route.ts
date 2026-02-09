import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import getServerSession from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const {
      title,
      description,
      startTime,
      durationInMinutes,
      problems,
      userId,
    } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (
      !title ||
      !description ||
      !startTime ||
      !durationInMinutes ||
      !problems ||
      problems.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const contest = await prisma.contest.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        durationInMinutes: durationInMinutes,
        creator: {
          connect: {
            id: userId,
          },
        },
        contestProblems: {
          create: problems.map((problemId: string, index: number) => ({
            problem: {
              connect: {
                id: problemId,
              },
            },
            order: index + 1,
          })),
        },
      },
      include: {
        contestProblems: true,
      },
    });

    await prisma.contestParticipant.create({
      data: {
        contestId: contest.id,
        userId: userId,
      },
    });

    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    console.error("Error creating contest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: {
        startTime: "desc",
      },
      include: {
        _count: {
          select: {
            contestParticipants: true,
          },
        },
      },
    });
    return NextResponse.json(contests);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
