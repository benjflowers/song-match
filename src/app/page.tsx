import { Heading } from '@/components/ui/Heading';
import { VideoCard } from '@/components/ui/VideoCard';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Heading level="h1">Pick which one you like best</Heading>
      <VideoCard
        videoId="dQw4w9WgXcQ"
        title="Never Gonna Give You Up"
        artist="Rick Astley"
      />
    </main>
  );
}
