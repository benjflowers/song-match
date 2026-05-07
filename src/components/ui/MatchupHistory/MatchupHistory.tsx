'use client';

import { useState } from 'react';
import YouTube from 'react-youtube';
import { MatchupHistoryItem } from '@/features/matchup/api/getMatchupsHistory';

type Props = {
  matchups: MatchupHistoryItem[];
};

export function MatchupHistory({ matchups }: Props) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const handlePlay = (videoId: string) => {
    setActiveVideoId((prev) => (prev === videoId ? null : videoId));
  };

  if (matchups.length === 0) {
    return <p className="text-gray-500 text-sm">No matchups yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {matchups.map((matchup) => (
        <MatchupCard
          key={matchup.id}
          matchup={matchup}
          activeVideoId={activeVideoId}
          onPlay={handlePlay}
        />
      ))}
    </div>
  );
}

type MatchupCardProps = {
  matchup: MatchupHistoryItem;
  activeVideoId: string | null;
  onPlay: (videoId: string) => void;
};

function MatchupCard({ matchup, activeVideoId, onPlay }: MatchupCardProps) {
  const { songA, songB, totalVotes, winnerId, createdAt } = matchup;

  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">{date}</span>
        <span className="text-sm text-gray-400">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </span>
      </div>
      <div className="flex flex-col divide-y divide-gray-100">
        {[songA, songB].map((song) => {
          const isWinner = song.id === winnerId;
          const isPlaying = song.videoId === activeVideoId;
          const percentage = totalVotes > 0 ? Math.round((song.votes / totalVotes) * 100) : 0;

          return (
            <div key={song.id}>
              <div className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {isWinner && <span className="text-base leading-none">🏆</span>}
                    <p
                      className={`text-sm font-semibold truncate ${
                        isWinner ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {song.title}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-2">{song.artist}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner ? 'bg-yellow-400' : 'bg-gray-300'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 w-14 text-right">
                      {song.votes} {song.votes === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onPlay(song.videoId)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isPlaying
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  {isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <rect x="1" y="1" width="4" height="10" rx="1" />
                      <rect x="7" y="1" width="4" height="10" rx="1" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M2.5 1.5l8 4.5-8 4.5V1.5z" />
                    </svg>
                  )}
                </button>
              </div>
              {isPlaying && (
                <div className="px-5 pb-4">
                  <YouTube
                    videoId={song.videoId}
                    opts={{
                      width: '100%',
                      height: '180',
                      playerVars: { autoplay: 1 },
                    }}
                    className="w-full rounded-xl overflow-hidden"
                    iframeClassName="w-full rounded-xl"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
