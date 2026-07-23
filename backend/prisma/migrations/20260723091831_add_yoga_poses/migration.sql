-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "PainArea" AS ENUM ('NONE', 'NECK', 'BACK', 'SHOULDER', 'HIP', 'KNEE');

-- CreateTable
CREATE TABLE "yoga_poses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT[],
    "benefits" TEXT[],
    "precautions" TEXT[],
    "difficulty" "Difficulty" NOT NULL,
    "imageUrl" TEXT,
    "durationSeconds" INTEGER,
    "targetAreas" TEXT[],
    "suitablePainAreas" "PainArea"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yoga_poses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "yoga_poses_name_key" ON "yoga_poses"("name");
