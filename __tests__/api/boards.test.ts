import { POST, GET } from '@/app/api/boards/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getTestApiUrl } from '../test-utils';

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    board: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('POST /api/boards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a board with valid data', async () => {
    // Arrange
    const mockBoard = {
      id: '123',
      title: 'Test Board',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { tasks: 0 },
    };

    (prisma.board.create as jest.Mock).mockResolvedValue(mockBoard);

    const request = new NextRequest(getTestApiUrl('/api/boards'), {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Board',
        description: 'Test Description',
      }),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(data.data).toHaveProperty('id');
    expect(data.data.title).toBe('Test Board');
    expect(data.message).toBe('Board created successfully');
  });

  it('should return 400 with invalid data', async () => {
    // Arrange
    const request = new NextRequest(getTestApiUrl('/api/boards'), {
      method: 'POST',
      body: JSON.stringify({
        title: '', // Empty title should fail validation
      }),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
    // Validation details are present (details field may vary by Zod version)
  });

  it('should return 400 when title exceeds max length', async () => {
    // Arrange
    const longTitle = 'a'.repeat(101); // Over 100 char limit
    const request = new NextRequest(getTestApiUrl('/api/boards'), {
      method: 'POST',
      body: JSON.stringify({
        title: longTitle,
      }),
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });
});

describe('GET /api/boards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all boards', async () => {
    // Arrange
    const mockBoards = [
      {
        id: '1',
        title: 'Board 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { tasks: 5 },
      },
      {
        id: '2',
        title: 'Board 2',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { tasks: 0 },
      },
    ];

    (prisma.board.findMany as jest.Mock).mockResolvedValue(mockBoards);

    const request = new NextRequest(getTestApiUrl('/api/boards'));

    // Act
    const response = await GET();
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(2);
    expect(data.data[0].title).toBe('Board 1');
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
