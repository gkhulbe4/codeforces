import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: contestId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if contest exists
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    const existingParticipant = await prisma.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId: user.id,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { message: "Already registered", isRegistered: true },
        { status: 200 },
      );
    }

    await prisma.contestParticipant.create({
      data: {
        contestId,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Successfully registered", isRegistered: true },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering for contest:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
