/*
  Warnings:

  - A unique constraint covering the columns `[matchupId,voterId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voterId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "voterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_matchupId_voterId_key" ON "Vote"("matchupId", "voterId");
