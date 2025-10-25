import { prisma } from './db';
import type { CreateBoardInput, UpdateBoardInput } from './validation';

/**
 * Board service layer - handles all database operations for boards
 */

export async function getAllBoards() {
  return prisma.board.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function getBoardById(id: string) {
  return prisma.board.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: [{ status: 'asc' }, { order: 'asc' }],
      },
    },
  });
}

export async function createBoard(data: CreateBoardInput) {
  // If no order specified, set it to be after all existing boards
  if (data.order === undefined) {
    const maxOrder = await prisma.board.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    data.order = (maxOrder?.order ?? -1) + 1;
  }

  return prisma.board.create({
    data,
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function updateBoard(id: string, data: UpdateBoardInput) {
  return prisma.board.update({
    where: { id },
    data,
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
}

export async function deleteBoard(id: string) {
  // Cascade delete will handle tasks automatically
  return prisma.board.delete({
    where: { id },
  });
}
