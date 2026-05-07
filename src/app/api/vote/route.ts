import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { matchupId, songId, voterId } = await request.json();

  if (!matchupId || !songId || !voterId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await prisma.vote.create({ data: { matchupId, songId, voterId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Vote already cast' }, { status: 409 });
  }
}
