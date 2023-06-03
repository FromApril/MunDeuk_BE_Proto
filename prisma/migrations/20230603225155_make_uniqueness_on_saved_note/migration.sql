/*
  Warnings:

  - A unique constraint covering the columns `[lockerId,noteId]` on the table `SavedNote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavedNote_lockerId_noteId_key" ON "SavedNote"("lockerId", "noteId");
