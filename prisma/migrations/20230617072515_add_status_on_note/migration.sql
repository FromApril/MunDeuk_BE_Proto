/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Note` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NoteState" AS ENUM ('DELETED', 'ACTIVE', 'OUT_DATED');

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "isDeleted",
ADD COLUMN     "noteState" "NoteState" NOT NULL DEFAULT 'ACTIVE';
