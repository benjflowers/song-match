'use client';

import { ResultsBar } from '@/components/ui/ResultsBar';
import { VideoCard } from '@/components/ui/VideoCard';
import { useVote } from '@/features/matchup/hooks/useVote';

type Song = {
  id: string;
  videoId: string;
  title: string;
  artist: string;
};

type MatchupVoteProps = {
  matchupId: string;
  songA: Song;
  songB: Song;
};

export function MatchupVote({ matchupId, songA, songB }: MatchupVoteProps) {
  const { vote, selectedSongId, results } = useVote(matchupId);

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
        <div className="flex flex-col items-center w-full md:w-80">
          <VideoCard
            videoId={songA.videoId}
            title={songA.title}
            artist={songA.artist}
            isSelected={selectedSongId === songA.id}
            isDeactivated={selectedSongId !== null && selectedSongId !== songA.id}
            onVote={() => vote(songA.id)}
          />
          {results !== null && <ResultsBar percent={results[songA.id] ?? 0} />}
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white ring-4 ring-gray-200">
          OR
        </div>
        <div className="flex flex-col items-center w-full md:w-80">
          <VideoCard
            videoId={songB.videoId}
            title={songB.title}
            artist={songB.artist}
            isSelected={selectedSongId === songB.id}
            isDeactivated={selectedSongId !== null && selectedSongId !== songB.id}
            onVote={() => vote(songB.id)}
          />
          {results !== null && <ResultsBar percent={results[songB.id] ?? 0} />}
        </div>
      </div>
      {selectedSongId !== null && (
        <p className="text-sm text-gray-500">You&apos;ve already voted today. Check back tomorrow for a new matchup!</p>
      )}
    </div>
  );
}
