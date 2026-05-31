import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStrategy } from '@/features/matchup/selection';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.matchup.updateMany({
    where: { status: 'ACTIVE' },
    data: { status: 'EXPIRED' },
  });

  const songs = await prisma.song.findMany({ select: { id: true } });
  if (songs.length < 2) {
    return NextResponse.json({ error: 'Not enough songs' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const strategyParam = (searchParams.get('strategy') ?? 'EXCLUDE_RECENT').toUpperCase();
  const strategy = getStrategy(strategyParam);
  const { songAId, songBId } = await strategy({ songs, prisma });

  const expiresAt = new Date();
  expiresAt.setUTCHours(23, 59, 59, 999);

  await prisma.matchup.create({
    data: {
      songAId,
      songBId,
      status: 'ACTIVE',
      expiresAt,
    },
  });

  revalidatePath('/');
  revalidatePath('/history');

  return NextResponse.json({ revalidated: true, strategy: strategyParam });
}
