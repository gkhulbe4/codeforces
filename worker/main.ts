import "dotenv/config";
import { SUBMISSION_QUEUE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { executeSubmission } from "@/lib/utils/executeSubmission";

async function main() {
  console.log("Worker started!");
  while (true) {
    const result = await redis.brpop(SUBMISSION_QUEUE, 0);
    if (!result) continue;

    const [_, submissionId] = result;
    console.log(`Processing submission ${submissionId}`);

    try {
      const submission = await prisma.submission.findUnique({
        where: {
          id: submissionId,
        },
        include: {
          problem: {
            include: {
              testCases: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
          language: true,
        },
      });

      if (!submission) {
        console.error("Submission not found");
        continue;
      }
      console.log("Submission found", submission.id);

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
      );
    } catch (error) {
      console.error("Error processing submission:", error);
    }
  }
}
main();
