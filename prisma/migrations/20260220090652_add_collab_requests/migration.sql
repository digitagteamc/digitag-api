-- CreateEnum
CREATE TYPE "CollabStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CollabRequest" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "budget" TEXT,
    "timeline" TEXT,
    "message" TEXT,
    "status" "CollabStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollabRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollabRequest_creatorId_idx" ON "CollabRequest"("creatorId");

-- CreateIndex
CREATE INDEX "CollabRequest_brandId_idx" ON "CollabRequest"("brandId");

-- AddForeignKey
ALTER TABLE "CollabRequest" ADD CONSTRAINT "CollabRequest_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabRequest" ADD CONSTRAINT "CollabRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
