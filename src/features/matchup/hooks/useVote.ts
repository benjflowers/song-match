import { useEffect, useState } from 'react';
import { useVoterId } from './useVoterId';
import { castVote } from '../api/castVote';

const voteKey = (matchupId: string) => `song_matchup_vote_${matchupId}`;

export function useVote(matchupId: string) {
  const voterId = useVoterId();
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(voteKey(matchupId));
    if (stored) setSelectedSongId(stored);
  }, [matchupId]);

  const vote = async (songId: string) => {
    if (!voterId || selectedSongId) return;
    await castVote(matchupId, songId, voterId);
    localStorage.setItem(voteKey(matchupId), songId);
    setSelectedSongId(songId);
  };

  return { vote, selectedSongId };
}
