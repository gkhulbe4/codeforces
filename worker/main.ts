import { SUBMISSION_QUEUE } from "@/lib/constants";
import { redis } from "@/lib/redis";
import { executeSubmission } from "@/lib/utils/executeSubmission";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

async function processSubmissions(env: any) {
  console.log("Processing pending submissions...");
  const prisma = new PrismaClient({
    accelerateUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    for (let i = 0; i < 5; i++) {
      const submissionId = await redis.rpop(SUBMISSION_QUEUE);
      if (!submissionId) {
        console.log("No more submissions in queue.");
        break;
      }

      console.log(`Processing submission ${submissionId}`);

      try {
        const submission = await prisma.submission.findUnique({
          where: { id: submissionId },
          include: {
            problem: {
              include: {
                testCases: {
                  orderBy: { order: "asc" },
                },
              },
            },
            language: true,
          },
        });

        if (!submission) {
          console.error("Submission not found in DB:", submissionId);
          continue;
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
      } catch (error) {
        console.error("Error processing submission:", error);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

export default {
  async scheduled(event: any, env: any, ctx: any) {
    ctx.waitUntil(processSubmissions(env));
  },

  async fetch(request: Request, env: any, ctx: any) {
    ctx.waitUntil(processSubmissions(env));
    return new Response("Worker triggered", { status: 200 });
  },
};
