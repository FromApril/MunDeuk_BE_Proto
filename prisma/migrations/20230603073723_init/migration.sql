-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NOTE', 'ACTION');

-- CreateTable
CREATE TABLE "Member" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "location" point NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "writerId" BIGINT,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "noticeableId" BIGINT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "notificationDetail" TEXT NOT NULL,
    "notifiedMemberId" BIGINT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locker" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" BIGINT NOT NULL,

    CONSTRAINT "Locker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedNote" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lockerId" BIGINT NOT NULL,
    "noteId" BIGINT NOT NULL,

    CONSTRAINT "SavedNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_notificationDetail_key" ON "Notification"("notificationDetail");

-- CreateIndex
CREATE UNIQUE INDEX "Locker_ownerId_key" ON "Locker"("ownerId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifiedMemberId_fkey" FOREIGN KEY ("notifiedMemberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locker" ADD CONSTRAINT "Locker_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedNote" ADD CONSTRAINT "SavedNote_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedNote" ADD CONSTRAINT "SavedNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
