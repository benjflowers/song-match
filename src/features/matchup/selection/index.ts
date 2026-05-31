import { random } from './strategies/random';
import { excludeRecent } from './strategies/excludeRecent';
import type { SelectionStrategyFn } from './types';

const strategies: Record<string, SelectionStrategyFn> = {
  RANDOM: random,
  EXCLUDE_RECENT: excludeRecent,
};

export function getStrategy(name: string): SelectionStrategyFn {
  return strategies[name] ?? strategies.EXCLUDE_RECENT;
}
