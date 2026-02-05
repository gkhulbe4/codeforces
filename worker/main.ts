import "dotenv/config";
import { SUBMISSION_QUEUE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

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
          problem: true,
          language: true,
        },
      });

      if (!submission) {
        throw new Error("Submission not found");
      }

      // console.log(submission);

      await prisma.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: "RUNNING",
        },
      });
    } catch (error) {
      console.error("Error processing submission:", error);
    }
  }
}
main();
