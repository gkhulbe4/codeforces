import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TestCase } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, timeLimit, memoryLimit, testCases } = body;
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        timeLimitMs: timeLimit,
        memoryLimitMb: memoryLimit,
        difficulty: "EASY",
        creator: {
          connect: {
            id: session.user.id,
          },
        },
        testCases: {
          create: testCases.map((tc: TestCase) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isSample: tc.isSample,
            order: tc.order,
          })),
        },
      },
    });
    return NextResponse.json(
      {
        message: "Problem created successfully",
        problem: title,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
