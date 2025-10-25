import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/services/user.service';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ data: users });
  } catch (error) {
    return handleApiError(error);
  }
}

