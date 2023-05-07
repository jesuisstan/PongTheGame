/*
  Warnings:

  - You are about to drop the column `winscore` on the `MatchInvitation` table. All the data in the column will be lost.
  - You are about to drop the column `blockedUsers` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "StatusUser" ADD VALUE 'PREPARING';

-- AlterTable
ALTER TABLE "MatchInvitation" DROP COLUMN "winscore",
ADD COLUMN     "winScore" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blockedUsers";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "chatRoomName" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "memberId" INTEGER NOT NULL,
    "nickName" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "avatar" TEXT NOT NULL,
    "modes" TEXT NOT NULL,
    "chatRoomName" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("memberId","chatRoomName")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "name" TEXT NOT NULL,
    "owner" INTEGER NOT NULL,
    "modes" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userLimit" INTEGER NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_BlockedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatRoomToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockedUsers_AB_unique" ON "_BlockedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockedUsers_B_index" ON "_BlockedUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRoomToUser_AB_unique" ON "_ChatRoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRoomToUser_B_index" ON "_ChatRoomToUser"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatRoomName_fkey" FOREIGN KEY ("chatRoomName") REFERENCES "ChatRoom"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_chatRoomName_fkey" FOREIGN KEY ("chatRoomName") REFERENCES "ChatRoom"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedUsers" ADD CONSTRAINT "_BlockedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomToUser" ADD CONSTRAINT "_ChatRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomToUser" ADD CONSTRAINT "_ChatRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
