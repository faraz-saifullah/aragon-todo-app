import { createBoard, getAllBoards, getBoardById } from '@/lib/services/board.service';
import { prisma } from '@/lib/db';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    board: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('Board Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBoard', () => {
    it('should create a board successfully', async () => {
      // Arrange
      const boardData = {
        title: 'New Board',
        description: 'Board description',
      };

      const mockCreatedBoard = {
        id: '123',
        ...boardData,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { tasks: 0 },
      };

      (prisma.board.create as jest.Mock).mockResolvedValue(mockCreatedBoard);

      // Act
      const result = await createBoard(boardData);

      // Assert
      expect(result).toEqual(mockCreatedBoard);
      expect(prisma.board.create).toHaveBeenCalledWith({
        data: boardData,
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const boardData = {
        title: 'New Board',
        description: 'Board description',
      };

      const dbError = new Error('Database connection failed');
      (prisma.board.create as jest.Mock).mockRejectedValue(dbError);

      // Act & Assert
      await expect(createBoard(boardData)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getAllBoards', () => {
    it('should return all boards sorted by creation date', async () => {
      // Arrange
      const mockBoards = [
        {
          id: '1',
          title: 'Board 1',
          description: 'Desc 1',
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date(),
          _count: { tasks: 3 },
        },
        {
          id: '2',
          title: 'Board 2',
          description: null,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date(),
          _count: { tasks: 0 },
        },
      ];

      (prisma.board.findMany as jest.Mock).mockResolvedValue(mockBoards);

      // Act
      const result = await getAllBoards();

      // Assert
      expect(result).toEqual(mockBoards);
      expect(prisma.board.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      });
    });
  });

  describe('getBoardById', () => {
    it('should return a board with its tasks', async () => {
      // Arrange
      const mockBoard = {
        id: '123',
        title: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [
          {
            id: 'task1',
            title: 'Task 1',
            description: null,
            status: 'TODO' as const,
            order: 0,
            boardId: '123',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      (prisma.board.findUnique as jest.Mock).mockResolvedValue(mockBoard);

      // Act
      const result = await getBoardById('123');

      // Assert
      expect(result).toEqual(mockBoard);
      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
        include: {
          tasks: {
            orderBy: [{ status: 'asc' }, { order: 'asc' }],
          },
        },
      });
    });

    it('should return null for non-existent board', async () => {
      // Arrange
      (prisma.board.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await getBoardById('non-existent');

      // Assert
      expect(result).toBeNull();
    });
  });
});
