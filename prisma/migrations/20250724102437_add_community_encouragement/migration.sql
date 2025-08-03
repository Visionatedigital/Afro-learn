-- CreateTable
CREATE TABLE "CommunityEncouragement" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityEncouragement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunityEncouragement" ADD CONSTRAINT "CommunityEncouragement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CommunityGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityEncouragement" ADD CONSTRAINT "CommunityEncouragement_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityEncouragement" ADD CONSTRAINT "CommunityEncouragement_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
