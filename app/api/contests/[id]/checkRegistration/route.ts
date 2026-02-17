import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: contestId } = await params;
    const searchParams = req.nextUrl.searchParams;

    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ isRegistered: false }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ isRegistered: false }, { status: 200 });
    }

    const userParticipation = await prisma.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId: user.id,
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
