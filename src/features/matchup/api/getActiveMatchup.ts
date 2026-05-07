import { prisma } from '@/lib/prisma';
import { ActiveMatchup } from '@/types/matchup';

export async function getActiveMatchup(): Promise<ActiveMatchup | null> {
  const matchup = await prisma.matchup.findFirst({
    where: { status: 'ACTIVE' },
    include: { songA: true, songB: true },
  });

  if (!matchup) return null;

  return {
    id: matchup.id,
    songA: {
      id: matchup.songA.id,
      videoId: matchup.songA.youtubeId,
      title: matchup.songA.title,
      artist: matchup.songA.artist,
    },
    songB: {
      id: matchup.songB.id,
      videoId: matchup.songB.youtubeId,
      title: matchup.songB.title,
      artist: matchup.songB.artist,
    },
  };
}
