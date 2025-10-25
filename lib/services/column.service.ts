import { prisma } from '../db';

/**
 * StatusColumn service layer - handles all database operations for status columns
 */

export async function getColumnsByBoardId(boardId: string) {
  return prisma.statusColumn.findMany({
    where: { boardId },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function getColumnById(id: string) {
  return prisma.statusColumn.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function createColumn(data: {
  boardId: string;
  name: string;
  color?: string;
  order?: number;
}) {
  // If no order specified, set it to be after all existing columns
  let orderValue = data.order;

  if (orderValue === undefined) {
    const maxOrder = await prisma.statusColumn.findFirst({
      where: { boardId: data.boardId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    orderValue = (maxOrder?.order ?? -1) + 1;
  }

  return prisma.statusColumn.create({
    data: {
      ...data,
      order: orderValue,
    },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function updateColumn(
  id: string,
  data: {
    name?: string;
    color?: string;
  }
) {
  return prisma.statusColumn.update({
    where: { id },
    data,
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function deleteColumn(id: string, moveToColumnId: string) {
  // Verify the target column exists
  const targetColumn = await prisma.statusColumn.findUnique({
    where: { id: moveToColumnId },
  });

  if (!targetColumn) {
    throw new Error('Target column not found');
  }

  // Get the column to be deleted and verify it exists
  const columnToDelete = await prisma.statusColumn.findUnique({
    where: { id },
    include: { board: true },
  });

  if (!columnToDelete) {
    throw new Error('Column not found');
  }

  // Verify both columns belong to the same board
  if (columnToDelete.boardId !== targetColumn.boardId) {
    throw new Error('Cannot move tasks to a column from a different board');
  }

  // Move all tasks from the column being deleted to the target column
  // Then delete the column - all in a transaction
  return prisma.$transaction(async (tx) => {
    // Get max order in target column to append tasks at the end
    const maxOrder = await tx.task.findFirst({
      where: { statusId: moveToColumnId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const startOrder = (maxOrder?.order ?? -1) + 1;

    // Get all tasks from the column being deleted
    const tasksToMove = await tx.task.findMany({
      where: { statusId: id },
      orderBy: { order: 'asc' },
    });

    // Update each task to point to the new column with new order
    for (let i = 0; i < tasksToMove.length; i++) {
      await tx.task.update({
        where: { id: tasksToMove[i].id },
        data: {
          statusId: moveToColumnId,
          order: startOrder + i,
        },
      });
    }

    // Now delete the column (should have no tasks left)
    await tx.statusColumn.delete({
      where: { id },
    });
  });
}

export async function reorderColumns(boardId: string, columnIds: string[]) {
  // Update order for each column
  const updates = columnIds.map((id, index) =>
    prisma.statusColumn.update({
      where: { id },
      data: { order: index },
    })
  );

  return prisma.$transaction(updates);
}
