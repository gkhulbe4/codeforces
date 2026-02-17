import { SUBMISSION_QUEUE } from "@/lib/constants";
import { executeSubmission } from "@/lib/utils/executeSubmission";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import Redis from "ioredis";

async function processSubmissions(env: any) {
  console.log("Worker waking up to process submissions...");

  const redis = new Redis(env.REDIS_URL);
  const prisma = new PrismaClient({
    // @ts-ignore
    accelerateUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  process.env.E2B_API_KEY = env.E2B_API_KEY;

  try {
    const submissionIds: string[] = [];

    // 2. Efficiently pull up to 5 items from the queue
    for (let i = 0; i < 5; i++) {
      const id = await redis.rpop(SUBMISSION_QUEUE);
      if (id) {
        submissionIds.push(id);
      } else {
        break;
      }
    }

    if (submissionIds.length === 0) {
      console.log("No pending submissions.");
      return;
    }

    console.log(
      `Processing ${submissionIds.length} submissions in parallel...`,
    );

    await Promise.all(
      submissionIds.map(async (submissionId) => {
        try {
          const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
              problem: {
                include: {
                  testCases: { orderBy: { order: "asc" } },
                },
              },
              language: true,
            },
          });

          if (!submission) {
            console.error(`Submission ${submissionId} not found in DB`);
            return;
          }

          await prisma.submission.update({
            where: { id: submissionId },
            data: { status: "RUNNING" },
          });

          await executeSubmission(
            submissionId,
            submission.code,
            // @ts-ignore
            submission.language.key,
            // @ts-ignore
            submission.problem.testCases,
            // @ts-ignore
            submission.problem.timeLimitMs,
            // @ts-ignore
            submission.problem.memoryLimitMb,
            prisma,
          );
        } catch (subError) {
          console.error(`Failed to process ${submissionId}:`, subError);
        }
      }),
    );
  } catch (error) {
    console.error("Critical worker error:", error);
  } finally {
    await redis.quit();
    await prisma.$disconnect();
  }
}

export default {
  async scheduled(event: any, env: any, ctx: any) {
    ctx.waitUntil(processSubmissions(env));
  },

  async fetch(request: Request, env: any, ctx: any) {
    ctx.waitUntil(processSubmissions(env));
    return new Response("Worker triggered successfully", { status: 200 });
  },
};
