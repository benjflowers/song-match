import type { SelectionStrategyFn } from '../types';

export const excludeRecent: SelectionStrategyFn = async ({ songs, prisma }) => {
  const recentMatchup = await prisma.matchup.findFirst({
    where: { status: 'EXPIRED' },
    orderBy: { createdAt: 'desc' },
    select: { songAId: true, songBId: true },
  });

  const excludedIds = recentMatchup
    ? new Set([recentMatchup.songAId, recentMatchup.songBId])
    : new Set<string>();

  const available = songs.filter((s) => !excludedIds.has(s.id));
  const pool = available.length >= 2 ? available : songs;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return { songAId: shuffled[0].id, songBId: shuffled[1].id };
};
