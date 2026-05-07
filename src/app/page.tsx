import { Heading } from '@/components/ui/Heading';
import { MatchupVote } from '@/components/ui/MatchupVote';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Heading level="h1">Pick which one you like best</Heading>
      <MatchupVote
        songA={{ id: 'a', videoId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley' }}
        songB={{ id: 'b', videoId: 'fJ9rUzIMcZQ', title: 'Bohemian Rhapsody', artist: 'Queen' }}
      />
    </main>
  );
}
