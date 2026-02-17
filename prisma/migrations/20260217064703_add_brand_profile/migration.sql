/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Creator` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Creator" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "gstin" TEXT,
    "city" TEXT,
    "state" TEXT,
    "status" "BrandStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_userId_key" ON "BrandProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_phoneNumber_key" ON "BrandProfile"("phoneNumber");

-- CreateIndex
CREATE INDEX "BrandProfile_status_idx" ON "BrandProfile"("status");

-- CreateIndex
CREATE INDEX "BrandProfile_createdAt_idx" ON "BrandProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_key" ON "Creator"("userId");

-- AddForeignKey
ALTER TABLE "BrandProfile" ADD CONSTRAINT "BrandProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
