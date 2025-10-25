import { z } from 'zod';

/**
 * Validation schemas for API request bodies
 *
 * Max length rationale:
 * - Board titles: 100 chars (fits in UI headers, DB varchar limit)
 * - Task titles: 200 chars (allows more descriptive tasks)
 * - Descriptions: No limit (flexible for detailed notes)
 */

// Board validation schemas
export const createBoardSchema = z.object({
  title: z
    .string()
    .min(1, 'Board title is required')
    .max(100, 'Board title is too long')
    .transform((val) => val.trim()),
  description: z
    .string()
    .transform((val) => val.trim())
    .optional(),
});

export const updateBoardSchema = z.object({
  title: z
    .string()
    .min(1, 'Board title is required')
    .max(100, 'Board title is too long')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .transform((val) => val.trim())
    .nullable()
    .optional(),
});

// Task validation schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title is too long')
    .transform((val) => val.trim()),
  description: z
    .string()
    .transform((val) => val.trim())
    .optional(),
  columnId: z.string().uuid('Invalid column ID'),
  order: z.number().int().nonnegative().optional(),
  boardId: z.string().uuid('Invalid board ID'),
  assigneeId: z.string().uuid('Invalid assignee ID').nullable().optional(),
  creatorId: z.string().uuid('Invalid creator ID'),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title is too long')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .transform((val) => val.trim())
    .nullable()
    .optional(),
  columnId: z.string().uuid('Invalid column ID').optional(),
  order: z.number().int().nonnegative().optional(),
  boardId: z.string().uuid('Invalid board ID').optional(),
  assigneeId: z.string().uuid('Invalid assignee ID').nullable().optional(),
});

// StatusColumn validation schemas
export const createColumnSchema = z.object({
  boardId: z.string().uuid('Invalid board ID'),
  name: z
    .string()
    .min(1, 'Column name is required')
    .max(50, 'Column name is too long')
    .transform((val) => val.trim()),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
  order: z.number().int().nonnegative().optional(),
});

export const updateColumnSchema = z.object({
  name: z
    .string()
    .min(1, 'Column name is required')
    .max(50, 'Column name is too long')
    .transform((val) => val.trim())
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
});

export const reorderColumnsSchema = z.object({
  columnIds: z
    .array(z.string().uuid('Invalid column ID'))
    .min(1, 'At least one column ID is required'),
});

// Types exported from schemas
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>;
