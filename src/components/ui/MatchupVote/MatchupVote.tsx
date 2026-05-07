'use client';

import { useState } from 'react';
import { VideoCard } from '@/components/ui/VideoCard';
import { useVoterId } from '@/features/matchup/hooks/useVoterId';

type Song = {
  id: string;
  videoId: string;
  title: string;
  artist: string;
};

type MatchupVoteProps = {
  songA: Song;
  songB: Song;
};

export function MatchupVote({ songA, songB }: MatchupVoteProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useVoterId();

  return (
    <div className="flex items-center gap-6">
      <VideoCard
        videoId={songA.videoId}
        title={songA.title}
        artist={songA.artist}
        isSelected={selectedId === songA.id}
        isDeactivated={selectedId !== null && selectedId !== songA.id}
        onVote={() => setSelectedId(songA.id)}
      />
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white ring-4 ring-gray-200">
        OR
      </div>
      <VideoCard
        videoId={songB.videoId}
        title={songB.title}
        artist={songB.artist}
        isSelected={selectedId === songB.id}
        isDeactivated={selectedId !== null && selectedId !== songB.id}
        onVote={() => setSelectedId(songB.id)}
      />
    </div>
  );
}
