'use client';

import YouTube from 'react-youtube';

type VideoCardProps = {
  videoId: string;
  title: string;
  artist: string;
};

export function VideoCard({ videoId, title, artist }: VideoCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm w-80">
      <div className="aspect-video w-full">
        <YouTube
          videoId={videoId}
          opts={{ width: '100%', height: '100%' }}
          className="h-full w-full"
          iframeClassName="h-full w-full"
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-sm text-gray-500 truncate">{artist}</p>
      </div>
    </div>
  );
}
