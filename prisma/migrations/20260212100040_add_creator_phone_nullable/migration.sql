/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Creator_phoneNumber_key" ON "Creator"("phoneNumber");
