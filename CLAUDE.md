# Song Matchup

## Overview
This is a web page that presents users with 2 songs in a 'matchup' style interaction. The users are able to listen to each song as much as they want and through the interface they are prompted to vote for which song they like more. Each user will vote anonymously but is only given one vote per matchup. Each day a new matchup is shown to users.

## Stack
- Node.js + Prisma (>= v7) + PostgreSQL
- Next + React for the frontend
- Docker for local development

## Development
- `docker-compose up` to start the database. Docker desktop must be running locally.
- `npx prisma migrate dev` to run migrations - docker MUST be running before.
- `npx prisma generate` after schema changes to update the Prisma Client.
- `npx prisma validate` to validate schema and check for isssues.

## Conventions
- Work in VERY SPECIFIC scopes. I DO NOT LIKE widespread and complex feature implementations.
- Follow bulletproof React conventions for frontend file organization and design.
- Wait to implement until you are %98 confident in what the request is - ask qeustions until you reach that level.
- When working with specific libraries/frameworks reference the version within the package.json and leverage online resources to determine the appropriate approach based on the versioning