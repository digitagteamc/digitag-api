/*
  Warnings:

  - Made the column `phoneNumber` on table `Creator` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Creator" ALTER COLUMN "phoneNumber" SET NOT NULL;
