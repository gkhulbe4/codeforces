/*
  Warnings:

  - You are about to drop the column `endTime` on the `Contest` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationInMinutes` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "endTime",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
