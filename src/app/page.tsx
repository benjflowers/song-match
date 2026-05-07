import { Heading } from '@/components/ui/Heading';
import { VideoCard } from '@/components/ui/VideoCard';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Heading level="h1">Pick which one you like best</Heading>
      <div className="flex items-center gap-6">
        <VideoCard
          videoId="dQw4w9WgXcQ"
          title="Never Gonna Give You Up"
          artist="Rick Astley"
        />
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white ring-4 ring-gray-200">
          OR
        </div>
        <VideoCard
          videoId="fJ9rUzIMcZQ"
          title="Bohemian Rhapsody"
          artist="Queen"
        />
      </div>
    </main>
  );
}
