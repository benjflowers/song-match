import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { MatchupVote } from '@/components/ui/MatchupVote';
import { getActiveMatchup } from '@/features/matchup/api/getActiveMatchup';

// revalidating the page is handled via cron - until then we want the matchup return to be cached
export const revalidate = false;

export default async function HomePage() {
  const matchup = await getActiveMatchup();

  if (!matchup) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Heading level="h1">No matchup today. Check back soon!</Heading>
      </main>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {today} · Today&apos;s Matchup
        </span>
        <Heading level="h1">Pick which one you like best</Heading>
        <p className="text-sm text-gray-500">A new matchup every day. Vote once, check back tomorrow to see who wins.</p>
      </div>
      <MatchupVote matchupId={matchup.id} songA={matchup.songA} songB={matchup.songB} />
      <Link href="/history" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
        View History →
      </Link>
    </main>
  );
}
