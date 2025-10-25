import { prisma } from '../db';
import type { CreateTaskInput, UpdateTaskInput } from '../validation';

/**
 * Task service layer - handles all database operations for tasks
 */

export async function getTasksByBoardId(boardId: string) {
  return prisma.task.findMany({
    where: { boardId },
    orderBy: [{ order: 'asc' }],
    include: {
      column: true,
      assignee: true,
      creator: true,
    },
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      board: true,
      column: true,
      assignee: true,
      creator: true,
    },
  });
}

export async function createTask(data: CreateTaskInput) {
  // If no order specified, set it to be after all existing tasks in the same column
  let orderValue = data.order;

  if (orderValue === undefined) {
    const maxOrder = await prisma.task.findFirst({
      where: {
        columnId: data.columnId,
      },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    orderValue = (maxOrder?.order ?? -1) + 1;
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      columnId: data.columnId,
      boardId: data.boardId,
      assigneeId: data.assigneeId,
      creatorId: data.creatorId,
      order: orderValue,
    },
    include: {
      column: true,
      assignee: true,
      creator: true,
    },
  });
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  // Get current task to compare changes
  const currentTask = await prisma.task.findUnique({
    where: { id },
    include: {
      column: true,
      assignee: true,
    },
  });

  if (!currentTask) {
    throw new Error('Task not found');
  }

  // Track changes for history
  const historyEntries: Array<{
    taskId: string;
    field: string;
    oldValue: string | null;
    newValue: string | null;
  }> = [];

  // Track column change
  if (data.columnId && data.columnId !== currentTask.columnId) {
    const newColumn = await prisma.statusColumn.findUnique({
      where: { id: data.columnId },
    });

    if (newColumn) {
      historyEntries.push({
        taskId: id,
        field: 'column',
        oldValue: currentTask.column.name,
        newValue: newColumn.name,
      });
    }
  }

  // Track assignee change (if assignee field is provided)
  if (data.assigneeId !== undefined && data.assigneeId !== currentTask.assigneeId) {
    let newAssigneeName: string | null = null;

    if (data.assigneeId) {
      const newAssignee = await prisma.user.findUnique({
        where: { id: data.assigneeId },
      });
      newAssigneeName = newAssignee?.name || null;
    }

    historyEntries.push({
      taskId: id,
      field: 'assignee',
      oldValue: currentTask.assignee?.name || null,
      newValue: newAssigneeName,
    });
  }

  // Track title change
  if (data.title && data.title !== currentTask.title) {
    historyEntries.push({
      taskId: id,
      field: 'title',
      oldValue: currentTask.title,
      newValue: data.title,
    });
  }

  // Track description change
  if (data.description !== undefined && data.description !== currentTask.description) {
    historyEntries.push({
      taskId: id,
      field: 'description',
      oldValue: currentTask.description || null,
      newValue: data.description || null,
    });
  }

  // Update task and create history entries in a transaction
  const [updatedTask] = await prisma.$transaction([
    prisma.task.update({
      where: { id },
      data,
      include: {
        column: true,
        assignee: true,
      },
    }),
    ...historyEntries.map((entry) =>
      prisma.taskHistory.create({
        data: entry,
      })
    ),
  ]);

  return updatedTask;
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

export async function getTaskHistory(taskId: string) {
  return prisma.taskHistory.findMany({
    where: { taskId },
    orderBy: { changedAt: 'desc' },
  });
}
