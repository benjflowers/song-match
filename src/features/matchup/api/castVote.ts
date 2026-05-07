export async function castVote(matchupId: string, songId: string, voterId: string): Promise<void> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchupId, songId, voterId }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}
