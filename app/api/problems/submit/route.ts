import { SUBMISSION_QUEUE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { STATUS } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, code, languageId, problemId, contestId } = body;
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        languageId,
        code,
        status: STATUS.PENDING,
        contestId,
      },
    });
    await redis.lpush(SUBMISSION_QUEUE, submission.id);

    fetch(process.env.CLOUDFLARE_WORKER_URL!).catch((err) =>
      console.error("Worker trigger failed:", err),
    );

    return NextResponse.json(
      {
        message: "Solution submitted successfully",
        submission,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
