/*
  Warnings:

  - You are about to drop the column `order` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Board_order_idx";

-- DropIndex
DROP INDEX "public"."Task_boardId_status_order_idx";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "statusId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusColumn" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskHistory" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "StatusColumn_boardId_order_idx" ON "StatusColumn"("boardId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "StatusColumn_boardId_name_key" ON "StatusColumn"("boardId", "name");

-- CreateIndex
CREATE INDEX "TaskHistory_taskId_changedAt_idx" ON "TaskHistory"("taskId", "changedAt");

-- CreateIndex
CREATE INDEX "Task_statusId_order_idx" ON "Task"("statusId", "order");

-- CreateIndex
CREATE INDEX "Task_boardId_statusId_order_idx" ON "Task"("boardId", "statusId", "order");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_creatorId_idx" ON "Task"("creatorId");

-- AddForeignKey
ALTER TABLE "StatusColumn" ADD CONSTRAINT "StatusColumn_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
