import { VERDICT } from "@prisma/client";

export async function changeVerdict(
  submissionId: string,
  verdict: VERDICT,
  stderr?: string,
  prisma?: any,
) {
  if (!prisma) {
    throw new Error("Prisma client must be provided to changeVerdict");
  }
  await prisma.submission.update({
    where: { id: submissionId },
    data: { verdict, stderr, status: "DONE" },
  });
}
