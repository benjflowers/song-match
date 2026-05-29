import { useEffect, useState } from 'react';

export function useStreak(voterId: string | null): number | null {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    if (!voterId) return;

    fetch(`/api/streak?voterId=${voterId}`)
      .then((res) => res.json())
      .then((data) => setStreak(data.streak ?? 0))
      .catch(() => setStreak(0));
  }, [voterId]);

  return streak;
}
