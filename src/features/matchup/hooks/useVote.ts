import { useCallback, useEffect, useState } from 'react';
import { useVoterId } from './useVoterId';
import { castVote } from '../api/castVote';

const voteKey = (matchupId: string) => `song_matchup_vote_${matchupId}`;

export function useVote(matchupId: string) {
  const voterId = useVoterId();
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number> | null>(null);

  const fetchResults = useCallback(async () => {
    const res = await fetch(`/api/vote?matchupId=${matchupId}`);
    if (!res.ok) return;
    const data = await res.json();
    const counts: Record<string, number> = data.votes;
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    if (total === 0) {
      setResults({});
      return;
    }
    const percentages: Record<string, number> = {};
    for (const [id, count] of Object.entries(counts)) {
      percentages[id] = Math.round((count / total) * 100);
    }
    setResults(percentages);
  }, [matchupId]);

  useEffect(() => {
    const stored = localStorage.getItem(voteKey(matchupId));
    if (stored) {
      setSelectedSongId(stored);
      fetchResults();
    }
  }, [matchupId, fetchResults]);

  const vote = async (songId: string) => {
    if (!voterId || selectedSongId) return;
    await castVote(matchupId, songId, voterId);
    localStorage.setItem(voteKey(matchupId), songId);
    setSelectedSongId(songId);
    fetchResults();
  };

  return { vote, selectedSongId, results };
}
