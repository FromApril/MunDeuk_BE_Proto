-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
