import { prisma } from "@/lib/prisma";

export async function checkStatus(submissionId: string) {
  try {
    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
      select: {
        status: true,
      },
    });
    return submission?.status;
  } catch (error) {
    console.log(error);
    return null;
  }
}
