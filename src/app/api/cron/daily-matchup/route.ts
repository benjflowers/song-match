import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  const shuffled = songs.sort(() => Math.random() - 0.5);
  const [songA, songB] = shuffled;

  const expiresAt = new Date();
  expiresAt.setUTCHours(23, 59, 59, 999);

  await prisma.matchup.create({
    data: {
      songAId: songA.id,
      songBId: songB.id,
      status: 'ACTIVE',
      expiresAt,
    },
  });

  revalidatePath('/');
  revalidatePath('/history');

  return NextResponse.json({ revalidated: true });
}
