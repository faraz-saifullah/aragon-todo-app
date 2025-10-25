-- AlterTable: Rename statusId column to columnId in Task table
ALTER TABLE "Task" RENAME COLUMN "statusId" TO "columnId";

-- Update TaskHistory: Change field value from 'status' to 'column' 
UPDATE "TaskHistory" SET "field" = 'column' WHERE "field" = 'status';

-- Note: No need to update foreign key constraints as they reference the same column (id) in StatusColumn table
-- The constraint will continue to work with the renamed column

