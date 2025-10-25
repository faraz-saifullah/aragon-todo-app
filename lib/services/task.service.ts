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
      status: true, // Include the status column info
    },
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      board: true,
      status: true,
    },
  });
}

export async function createTask(data: CreateTaskInput) {
  // If no order specified, set it to be after all existing tasks in the same status
  let orderValue = data.order;

  if (orderValue === undefined) {
    const maxOrder = await prisma.task.findFirst({
      where: {
        statusId: data.statusId,
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
      statusId: data.statusId,
      boardId: data.boardId,
      order: orderValue,
    },
    include: {
      status: true,
    },
  });
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      status: true,
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}
