/*
  Warnings:

  - You are about to drop the `ContestSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_contestId_fkey";

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_languageId_fkey";

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_problemId_fkey";

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_userId_fkey";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "contestId" TEXT;

-- DropTable
DROP TABLE "ContestSubmission";

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
