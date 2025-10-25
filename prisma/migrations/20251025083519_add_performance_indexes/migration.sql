-- CreateIndex
CREATE INDEX "Board_order_idx" ON "Board"("order");

-- CreateIndex
CREATE INDEX "Task_boardId_idx" ON "Task"("boardId");

-- CreateIndex
CREATE INDEX "Task_boardId_status_order_idx" ON "Task"("boardId", "status", "order");
