'use client';

import YouTube from 'react-youtube';

type VideoCardProps = {
  videoId: string;
  title: string;
  artist: string;
  isDeactivated?: boolean;
  isSelected?: boolean;
  onVote?: () => void;
};

export function VideoCard({ videoId, title, artist, isDeactivated = false, isSelected = false, onVote }: VideoCardProps) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm w-80 transition-all duration-300 ${
        isDeactivated
          ? 'border-gray-100 opacity-40 grayscale'
          : isSelected
          ? 'border-blue-500 shadow-blue-100 shadow-md'
          : 'border-gray-200'
      }`}
    >
      <div className="relative aspect-video w-full">
        <YouTube
          videoId={videoId}
          opts={{ width: '100%', height: '100%' }}
          className="h-full w-full"
          iframeClassName="h-full w-full"
        />
        {isDeactivated && <div className="absolute inset-0" />}
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-sm text-gray-500 truncate">{artist}</p>
        </div>
        <button
          onClick={onVote}
          disabled={isDeactivated || isSelected}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
            isSelected
              ? 'bg-blue-600 text-white cursor-default'
              : isDeactivated
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95'
          }`}
        >
          {isSelected ? 'Voted' : 'This One'}
        </button>
      </div>
    </div>
  );
}
