'use client';

import { useStreak } from '@/features/matchup/hooks/useStreak';
import { useVoterId } from '@/features/matchup/hooks/useVoterId';

export function StreakBadge() {
  const voterId = useVoterId();
  const streak = useStreak(voterId);

  return (
    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
      Voting Streak:{streak !== null ? ` ${streak}` : ''}
    </span>
  );
}
