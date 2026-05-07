import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.vote.deleteMany();
  await prisma.matchup.deleteMany();
  await prisma.song.deleteMany();

  const songs = await Promise.all([
    prisma.song.create({
      data: { title: "It Was A Good Day", artist: "Ice Cube", youtubeId: "h4UqMyldS7Q" },
    }),
    prisma.song.create({
      data: { title: "Can I Kick It", artist: "A Tribe Called Quest", youtubeId: "7D_JwgIM-y4" },
    }),
    prisma.song.create({
      data: { title: "93 'Til Infinity", artist: "Souls of Mischief", youtubeId: "fXJc2NYwHjw" },
    }),
    prisma.song.create({
      data: { title: "Electric Relaxation", artist: "A Tribe Called Quest", youtubeId: "WHRnvjCkTsw" },
    }),
    prisma.song.create({
      data: { title: "C.R.E.A.M.", artist: "Wu-Tang Clan", youtubeId: "PBwAxmrE194" },
    }),
    prisma.song.create({
      data: { title: "Temperature's Rising", artist: "Mobb Deep", youtubeId: "51qX7C3KAXE" },
    }),
  ]);

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const activeMatchup = await prisma.matchup.create({
    data: { songAId: songs[0].id, songBId: songs[1].id, status: "ACTIVE", expiresAt: tomorrow },
  });

  const expiredMatchup1 = await prisma.matchup.create({
    data: { songAId: songs[2].id, songBId: songs[3].id, status: "EXPIRED", expiresAt: yesterday },
  });

  const expiredMatchup2 = await prisma.matchup.create({
    data: { songAId: songs[4].id, songBId: songs[5].id, status: "EXPIRED", expiresAt: twoDaysAgo },
  });

  await prisma.vote.createMany({
    data: [
      { matchupId: expiredMatchup1.id, songId: songs[2].id },
      { matchupId: expiredMatchup1.id, songId: songs[2].id },
      { matchupId: expiredMatchup1.id, songId: songs[3].id },
      { matchupId: expiredMatchup2.id, songId: songs[4].id },
      { matchupId: expiredMatchup2.id, songId: songs[5].id },
      { matchupId: expiredMatchup2.id, songId: songs[5].id },
      { matchupId: expiredMatchup2.id, songId: songs[5].id },
    ],
  });

  console.log("Seeded: 6 songs, 3 matchups (1 active, 2 expired), 7 votes");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
