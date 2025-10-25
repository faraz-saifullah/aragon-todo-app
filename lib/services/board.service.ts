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
  // Create board with default columns in a transaction
  return prisma.$transaction(async (tx) => {
    // Create the board
    const board = await tx.board.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    // Create default columns
    const defaultColumns = [
      { name: 'TODO', color: '#49c4e5', order: 0 },
      { name: 'DOING', color: '#635fc7', order: 1 },
      { name: 'DONE', color: '#67e2ae', order: 2 },
    ];

    await tx.statusColumn.createMany({
      data: defaultColumns.map((col) => ({
        ...col,
        boardId: board.id,
      })),
    });

    // Return the board with task count
    return tx.board.findUnique({
      where: { id: board.id },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
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
