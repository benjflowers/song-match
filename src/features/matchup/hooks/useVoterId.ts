import { useEffect, useState } from 'react';

const VOTER_ID_KEY = 'song_matchup_voter_id';

export function useVoterId(): string | null {
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem(VOTER_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VOTER_ID_KEY, id);
    }
    setVoterId(id);
  }, []);

  return voterId;
}
