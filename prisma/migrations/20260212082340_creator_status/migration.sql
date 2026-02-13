-- CreateEnum
CREATE TYPE "CreatorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "status" "CreatorStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Creator_createdAt_idx" ON "Creator"("createdAt");

-- CreateIndex
CREATE INDEX "Creator_status_idx" ON "Creator"("status");
