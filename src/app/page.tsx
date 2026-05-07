import { Heading } from '@/components/ui/Heading';
import { MatchupVote } from '@/components/ui/MatchupVote';
import { getActiveMatchup } from '@/features/matchup/api/getActiveMatchup';

export default async function HomePage() {
  const matchup = await getActiveMatchup();

  if (!matchup) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Heading level="h1">No matchup today. Check back soon!</Heading>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Heading level="h1">Pick which one you like best</Heading>
      <MatchupVote songA={matchup.songA} songB={matchup.songB} />
    </main>
  );
}
