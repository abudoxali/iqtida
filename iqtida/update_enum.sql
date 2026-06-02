-- Drop defaults first
ALTER TABLE "Hadith" ALTER COLUMN "reviewStatus" DROP DEFAULT;
ALTER TABLE "SunnahPractice" ALTER COLUMN "reviewStatus" DROP DEFAULT;

-- Convert column types to text (already done but safe to run)
ALTER TABLE "Hadith" ALTER COLUMN "reviewStatus" TYPE text;
ALTER TABLE "SunnahPractice" ALTER COLUMN "reviewStatus" TYPE text;

-- Update the values to new enum string representation
UPDATE "Hadith" SET "reviewStatus" = 'PENDING_REVIEW' WHERE "reviewStatus" = 'NEEDS_REVIEW';
UPDATE "Hadith" SET "reviewStatus" = 'APPROVED' WHERE "reviewStatus" = 'REVIEWED';

UPDATE "SunnahPractice" SET "reviewStatus" = 'PENDING_REVIEW' WHERE "reviewStatus" = 'NEEDS_REVIEW';
UPDATE "SunnahPractice" SET "reviewStatus" = 'APPROVED' WHERE "reviewStatus" = 'REVIEWED';

-- Drop the old enum type using CASCADE
DROP TYPE IF EXISTS "ReviewStatus" CASCADE;
