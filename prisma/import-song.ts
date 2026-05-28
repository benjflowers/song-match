import "dotenv/config";
import * as readline from "readline";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

async function fetchOEmbed(videoId: string): Promise<{ title: string; author: string }> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`oEmbed fetch failed: ${res.status}`);
  const data = await res.json();
  return { title: data.title, author: data.author_name };
}

function parseArtistTitle(videoTitle: string): { artist: string; title: string } {
  const delimiters = [" - ", " – ", " | "];
  for (const delim of delimiters) {
    const idx = videoTitle.indexOf(delim);
    if (idx !== -1) {
      return {
        artist: videoTitle.slice(0, idx).trim(),
        title: videoTitle.slice(idx + delim.length).trim(),
      };
    }
  }
  return { artist: "", title: videoTitle.trim() };
}

interface ItunesTrack {
  trackName: string;
  artistName: string;
  primaryGenreName: string;
  releaseDate: string;
}

async function fetchItunesMatches(artist: string, title: string): Promise<ItunesTrack[]> {
  const term = encodeURIComponent(`${artist} ${title}`.trim());
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const youtubeUrl = process.argv[2];
  if (!youtubeUrl) {
    console.error("Usage: npx ts-node prisma/import-song.ts <youtube-url>");
    process.exit(1);
  }

  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    console.error("Could not extract video ID from URL.");
    process.exit(1);
  }

  console.log(`\nFetching YouTube metadata for video: ${videoId}`);
  const oembed = await fetchOEmbed(videoId);
  const parsed = parseArtistTitle(oembed.title);

  console.log(`\nYouTube title : ${oembed.title}`);
  console.log(`YouTube channel: ${oembed.author}`);
  console.log(`Parsed artist  : ${parsed.artist || "(none)"}`);
  console.log(`Parsed title   : ${parsed.title}`);

  const searchArtist = parsed.artist || oembed.author;
  console.log(`\nQuerying iTunes for: "${searchArtist} ${parsed.title}"`);
  const matches = await fetchItunesMatches(searchArtist, parsed.title);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let chosenTitle = parsed.title;
  let chosenArtist = searchArtist;
  let chosenGenre = "";
  let chosenYear: number | null = null;

  if (matches.length > 0) {
    console.log("\nTop iTunes matches:");
    matches.forEach((m, i) => {
      const year = m.releaseDate ? new Date(m.releaseDate).getFullYear() : "?";
      console.log(`  [${i + 1}] ${m.artistName} — ${m.trackName} (${m.primaryGenreName}, ${year})`);
    });
    console.log(`  [0] None of these — enter manually`);

    const pick = await prompt(rl, "\nSelect a match (0-5): ");
    const idx = parseInt(pick, 10);
    if (idx >= 1 && idx <= matches.length) {
      const m = matches[idx - 1];
      chosenTitle = m.trackName;
      chosenArtist = m.artistName;
      chosenGenre = m.primaryGenreName;
      chosenYear = m.releaseDate ? new Date(m.releaseDate).getFullYear() : null;
    }
  } else {
    console.log("\nNo iTunes matches found. Enter metadata manually.");
  }

  console.log(`\nCurrent values:`);
  console.log(`  Title  : ${chosenTitle}`);
  console.log(`  Artist : ${chosenArtist}`);
  console.log(`  Genre  : ${chosenGenre || "(none)"}`);
  console.log(`  Year   : ${chosenYear ?? "(none)"}`);

  const override = await prompt(rl, "\nOverride any field? (y/N): ");
  if (override.toLowerCase() === "y") {
    const t = await prompt(rl, `Title [${chosenTitle}]: `);
    if (t.trim()) chosenTitle = t.trim();

    const a = await prompt(rl, `Artist [${chosenArtist}]: `);
    if (a.trim()) chosenArtist = a.trim();

    const g = await prompt(rl, `Genre [${chosenGenre || ""}]: `);
    if (g.trim()) chosenGenre = g.trim();

    const y = await prompt(rl, `Year [${chosenYear ?? ""}]: `);
    if (y.trim()) chosenYear = parseInt(y.trim(), 10) || null;
  }

  rl.close();

  let song;
  try {
    song = await prisma.song.create({
      data: {
        title: chosenTitle,
        artist: chosenArtist,
        youtubeId: videoId,
        genre: chosenGenre || null,
        year: chosenYear,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("ECONNREFUSED") || msg.includes("connect") || msg.includes("ETIMEDOUT")) {
      console.error("\nCould not connect to the database.");
      console.error("Make sure Docker is running and the container is up:");
      console.error("  docker-compose up -d");
      process.exit(1);
    }
    throw e;
  }

  console.log(`\nSong imported successfully:`);
  console.log(`  ID     : ${song.id}`);
  console.log(`  Title  : ${song.title}`);
  console.log(`  Artist : ${song.artist}`);
  console.log(`  Genre  : ${song.genre ?? "(none)"}`);
  console.log(`  Year   : ${song.year ?? "(none)"}`);
  console.log(`  YouTube: https://www.youtube.com/watch?v=${song.youtubeId}`);
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
