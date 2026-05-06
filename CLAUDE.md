# Song Matchup

## Overview
This is a web page that presents users with 2 songs in a 'matchup' style interaction. The users are able to listen to each song as much as they want and through the interface they are prompted to vote for which song they like more. Each user will vote anonymously but is only given one vote per matchup. Each day a new matchup is shown to users.

## Stack
- Node.js + Prisma + PostgreSQL
- Next + React for the frontend
- Docker for local development

## Development
- `docker-compose up` to start the database
- `npx prisma migrate dev` to run migrations
- `npx prisma generate` after schema changes
- `npx prisma validate` to validate schema and check for isssues

## Conventions
- Work in VERY SPECIFIC scopes. I DO NOT LIKE widespread and complex feature implementations.
- Follow bulletproof React conventions for frontend file organization and design.