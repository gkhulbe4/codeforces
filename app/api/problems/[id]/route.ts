import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { message: "Problem not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        problem,
        message: "Problem fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
