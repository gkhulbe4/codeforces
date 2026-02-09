import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const userParticipation = await prisma.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId: id,
          userId: userId,
        },
      },
    });

    if (userParticipation) {
      return NextResponse.json({ isRegistered: true }, { status: 200 });
    }

    return NextResponse.json({ isRegistered: false }, { status: 200 });
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
