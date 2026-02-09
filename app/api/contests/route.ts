import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const contest = await prisma.contest.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        durationInMinutes: true,
        creator: true,
        _count: {
          select: {
            contestParticipants: true,
            contestProblems: true,
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
    return NextResponse.json(
      {
        contest,
        message: "Contests fetched successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
