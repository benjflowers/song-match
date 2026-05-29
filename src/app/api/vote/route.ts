import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchupId = searchParams.get('matchupId');

  if (!matchupId) {
    return NextResponse.json({ error: 'Missing matchupId' }, { status: 400 });
  }

  const votes = await prisma.vote.groupBy({
    by: ['songId'],
    where: { matchupId },
    _count: { songId: true },
  });

  const counts: Record<string, number> = {};
  for (const v of votes) {
    counts[v.songId] = v._count.songId;
  }

  return NextResponse.json({ votes: counts });
}

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
