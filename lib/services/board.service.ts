import { prisma } from '../db';
import type { CreateBoardInput, UpdateBoardInput } from '../validation';

/**
 * Board service layer - handles all database operations for boards
 */

export async function getAllBoards() {
  return prisma.board.findMany({
    orderBy: { createdAt: 'desc' },
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
      columns: {
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}

export async function createBoard(data: CreateBoardInput) {
  return prisma.board.create({
    data: {
      title: data.title,
      description: data.description,
    },
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
