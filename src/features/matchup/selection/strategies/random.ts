import type { SelectionStrategyFn } from '../types';

export const random: SelectionStrategyFn = async ({ songs }) => {
  const shuffled = [...songs].sort(() => Math.random() - 0.5);
  return { songAId: shuffled[0].id, songBId: shuffled[1].id };
};
