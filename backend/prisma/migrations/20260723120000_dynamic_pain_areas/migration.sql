-- CreateTable
CREATE TABLE "pain_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pain_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pain_areas_name_key" ON "pain_areas"("name");

-- Preserve the original enum values as catalog records.
INSERT INTO "pain_areas" ("id", "name") VALUES
    ('00000000-0000-4000-8000-000000000001', 'NONE'),
    ('00000000-0000-4000-8000-000000000002', 'NECK'),
    ('00000000-0000-4000-8000-000000000003', 'BACK'),
    ('00000000-0000-4000-8000-000000000004', 'SHOULDER'),
    ('00000000-0000-4000-8000-000000000005', 'HIP'),
    ('00000000-0000-4000-8000-000000000006', 'KNEE');

-- Convert enum arrays to text arrays without dropping existing pose data.
ALTER TABLE "yoga_poses"
ADD COLUMN "suitablePainAreas_new" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "yoga_poses"
SET "suitablePainAreas_new" = ARRAY(
    SELECT pain_area::TEXT
    FROM unnest("suitablePainAreas") AS pain_area
);

ALTER TABLE "yoga_poses" DROP COLUMN "suitablePainAreas";
ALTER TABLE "yoga_poses"
RENAME COLUMN "suitablePainAreas_new" TO "suitablePainAreas";
ALTER TABLE "yoga_poses"
ALTER COLUMN "suitablePainAreas" DROP DEFAULT;

-- The enum is no longer needed after all references have been converted.
DROP TYPE "PainArea";
