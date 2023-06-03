-- AlterTable
ALTER TABLE "Locker" ADD COLUMN     "viewedNoteIdList" BIGINT[] DEFAULT ARRAY[]::BIGINT[];
