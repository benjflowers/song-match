import type { PrismaClient } from '@prisma/client';

export type SelectionResult = { songAId: string; songBId: string };

export type SelectionContext = {
  songs: { id: string }[];
  prisma: PrismaClient;
};

export type SelectionStrategyFn = (context: SelectionContext) => Promise<SelectionResult>;
