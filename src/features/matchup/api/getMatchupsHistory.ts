import { prisma } from '@/lib/prisma';

export type MatchupHistorySong = {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  votes: number;
};

export type MatchupHistoryItem = {
  id: string;
  createdAt: Date;
  songA: MatchupHistorySong;
  songB: MatchupHistorySong;
  totalVotes: number;
  winnerId: string | null;
};

export async function getMatchupsHistory(): Promise<MatchupHistoryItem[]> {
  const matchups = await prisma.matchup.findMany({
    where: { status: 'EXPIRED' },
    include: {
      songA: true,
      songB: true,
      votes: { select: { songId: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return matchups.map((matchup) => {
    const songAVotes = matchup.votes.filter((v) => v.songId === matchup.songAId).length;
    const songBVotes = matchup.votes.filter((v) => v.songId === matchup.songBId).length;
    const totalVotes = songAVotes + songBVotes;

    let winnerId: string | null = null;
    if (songAVotes > songBVotes) winnerId = matchup.songAId;
    else if (songBVotes > songAVotes) winnerId = matchup.songBId;

    return {
      id: matchup.id,
      createdAt: matchup.createdAt,
      songA: {
        id: matchup.songA.id,
        videoId: matchup.songA.youtubeId,
        title: matchup.songA.title,
        artist: matchup.songA.artist,
        votes: songAVotes,
      },
      songB: {
        id: matchup.songB.id,
        videoId: matchup.songB.youtubeId,
        title: matchup.songB.title,
        artist: matchup.songB.artist,
        votes: songBVotes,
      },
      totalVotes,
      winnerId,
    };
  });
}
