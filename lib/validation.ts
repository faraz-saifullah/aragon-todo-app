import { z } from 'zod';

// Board validation schemas
export const createBoardSchema = z.object({
  title: z.string().min(1, 'Board title is required').max(100, 'Board title is too long'),
  description: z.string().optional(),
});

export const updateBoardSchema = z.object({
  title: z
    .string()
    .min(1, 'Board title is required')
    .max(100, 'Board title is too long')
    .optional(),
  description: z.string().optional().nullable(),
});

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title is too long'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'DOING', 'DONE']).default('TODO'),
  order: z.number().int().nonnegative().optional(),
  boardId: z.string().uuid('Invalid board ID'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title is too long').optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
  order: z.number().int().nonnegative().optional(),
  boardId: z.string().uuid('Invalid board ID').optional(),
});

// Types exported from schemas
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
