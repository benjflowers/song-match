import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { MatchupHistory } from '@/components/ui/MatchupHistory';
import { getMatchupsHistory } from '@/features/matchup/api/getMatchupsHistory';

export default async function HistoryPage() {
  const matchups = await getMatchupsHistory();

  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 gap-8">
      <div className="w-full max-w-2xl flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0"
        >
          ← Back
        </Link>
        <Heading level="h1">Matchup History</Heading>
      </div>
      <MatchupHistory matchups={matchups} />
    </main>
  );
}
