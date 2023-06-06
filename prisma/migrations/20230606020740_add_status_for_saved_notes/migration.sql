/*
  Warnings:

  - Added the required column `status` to the `SavedNote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SavedNoteState" AS ENUM ('LIKE', 'SUBSCRIBE', 'UN_LIKE', 'UN_SUBSCRIBE');

-- AlterTable
ALTER TABLE "SavedNote" ADD COLUMN     "status" "SavedNoteState" NOT NULL;
