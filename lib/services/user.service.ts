import { prisma } from '../db';

/**
 * User service layer - handles all database operations for users
 */

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// For now, we'll use a default user (first user in the database)
// This will be replaced with proper auth later
export async function getDefaultUser() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!user) {
    throw new Error('No users found in database. Please run seed script.');
  }

  return user;
}

