import { prisma } from "@/lib/prisma";
import { VERDICT } from "@prisma/client";

export async function changeVerdict(
  submissionId: string,
  verdict: VERDICT,
  stderr?: string,
) {
  await prisma.submission.update({
    where: { id: submissionId },
    data: { verdict, stderr, status: "DONE" },
  });
}
