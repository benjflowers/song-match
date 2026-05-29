import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const voterId = searchParams.get('voterId');

  if (!voterId) {
    return NextResponse.json({ error: 'Missing voterId' }, { status: 400 });
  }

  const votes = await prisma.vote.findMany({
    where: { voterId },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  if (votes.length === 0) {
    return NextResponse.json({ streak: 0 });
  }

  const voteDates = votes.map((v) => v.createdAt.toISOString().split('T')[0]);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (voteDates[0] !== today && voteDates[0] !== yesterday) {
    return NextResponse.json({ streak: 0 });
  }

  let streak = 0;
  const cursor = new Date(voteDates[0]);

  for (const date of voteDates) {
    const expected = cursor.toISOString().split('T')[0];
    if (date === expected) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return NextResponse.json({ streak });
}
