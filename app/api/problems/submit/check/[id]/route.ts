import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    console.log("checking for submission id: ", id);
    const submission = await prisma.submission.findUnique({
      where: {
        id: id,
      },
    });
    if (submission?.status === "RUNNING" || submission?.status === "PENDING") {
      return NextResponse.json({ status: submission?.status }, { status: 200 });
    }
    return NextResponse.json({ submission }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
