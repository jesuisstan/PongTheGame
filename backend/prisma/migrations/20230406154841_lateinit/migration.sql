-- CreateEnum
CREATE TYPE "StatusUser" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "InvitationState" AS ENUM ('Pending', 'Started', 'Finished');

-- CreateEnum
CREATE TYPE "MatchState" AS ENUM ('Scheduled', 'Started', 'Finished');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "profileId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "blockedUsers" INTEGER[],
    "status" "StatusUser" NOT NULL DEFAULT 'ONLINE',
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistique" (
    "id" SERIAL NOT NULL,
    "nb_game" INTEGER NOT NULL DEFAULT 0,
    "nb_win" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Statistique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotpSecret" (
    "id" SERIAL NOT NULL,
    "secret" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,

    CONSTRAINT "TotpSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "icon_path" TEXT,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchivement" (
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,

    CONSTRAINT "UserAchivement_pkey" PRIMARY KEY ("userId","achievementId")
);

-- CreateTable
CREATE TABLE "MatchEntry" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "MatchEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "state" "MatchState" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchInvitation" (
    "id" SERIAL NOT NULL,
    "createdById" INTEGER NOT NULL,
    "sendToId" INTEGER NOT NULL,
    "obstacle" BOOLEAN NOT NULL,
    "winscore" INTEGER NOT NULL DEFAULT 5,
    "status" "InvitationState" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "MatchInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Friendslist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_provider_key" ON "User"("profileId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Statistique_userId_key" ON "Statistique"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TotpSecret_userId_key" ON "TotpSecret"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_Name_key" ON "Achievements"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_Title_key" ON "Achievements"("Title");

-- CreateIndex
CREATE UNIQUE INDEX "MatchInvitation_createdById_key" ON "MatchInvitation"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "_Friendslist_AB_unique" ON "_Friendslist"("A", "B");

-- CreateIndex
CREATE INDEX "_Friendslist_B_index" ON "_Friendslist"("B");

-- AddForeignKey
ALTER TABLE "Statistique" ADD CONSTRAINT "Statistique_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TotpSecret" ADD CONSTRAINT "TotpSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchivement" ADD CONSTRAINT "UserAchivement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchivement" ADD CONSTRAINT "UserAchivement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEntry" ADD CONSTRAINT "MatchEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEntry" ADD CONSTRAINT "MatchEntry_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchInvitation" ADD CONSTRAINT "MatchInvitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchInvitation" ADD CONSTRAINT "MatchInvitation_sendToId_fkey" FOREIGN KEY ("sendToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendslist" ADD CONSTRAINT "_Friendslist_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Friendslist" ADD CONSTRAINT "_Friendslist_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
