import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const contest = await prisma.contest.findUnique({
      where: {
        id,
      },
      include: {
        contestProblems: {
          include: {
            problem: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            contestParticipants: true,
          },
        },
      },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    return NextResponse.json(contest);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
