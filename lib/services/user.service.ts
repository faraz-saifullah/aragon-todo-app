import { prisma } from '../db';

/**
 * User service layer - handles all database operations for users
 */

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
}
