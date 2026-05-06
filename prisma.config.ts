import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Path to your Prisma schema
  schema: './prisma/schema.prisma',
  
  // Database connection details
  datasource: {
    url: env('DATABASE_URL'),
  },

  // Migration settings
  migrations: {
    path: './prisma/migrations',
    seed: "tsx prisma/seed.ts"
  },
});
