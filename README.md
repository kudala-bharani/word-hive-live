# 🐝 Word Hive Live

A real-time multiplayer word puzzle game for remote teams, online meetings, and friend groups.

**[Play the live app](https://word-hive-live.vercel.app)**

A host creates a room, shares a six-character code or invite link, and starts a five-hive game. Up to 10 players build words from seven letters while scores and room state update live. No account is required.

## Highlights

- Up to 10 players per room
- Five 2-minute hives per game (10 minutes total)
- Live player list, word counts, scores, and cumulative leaderboard
- Shareable room codes and invite links
- Between-hive standings and possible-word reveal
- Pangram detection and bonus scoring
- 35 bundled puzzle sets
- Host controls for starting rounds, ending early, and playing again
- Responsive interface for desktop and mobile browsers
- Supabase persistence and Realtime synchronization for multi-device play
- In-memory fallback for a zero-configuration, single-browser demo

Manual testing has covered a full 10-player room, the current room limit. This was a functional multiplayer test, not a throughput or scale benchmark.

## Game format

Each game contains five hives. Every hive lasts two minutes and uses a randomly selected seven-letter puzzle; the same puzzle is not used in consecutive hives. Scores carry across all five hives, while each player's found-word list resets when the next hive begins.

A valid word must:

- contain at least four letters;
- include the highlighted center letter;
- use only the seven available letters (letters may be reused);
- appear in the puzzle's bundled valid-word list; and
- not have been submitted already by that player during the current hive.

### Scoring

| Word | Score |
| --- | ---: |
| 4 letters | 1 point |
| 5 or more letters | 1 point per letter |
| Pangram using all 7 letters | Base score + 7 points |

A seven-letter pangram, for example, earns 14 points.

## Tech stack

- **Application:** Next.js 16 Pages Router and React 19
- **Styling:** Tailwind CSS 3
- **Data:** Supabase Postgres
- **Live sync:** Supabase Realtime / Postgres Changes
- **Local fallback:** In-browser memory
- **Player identity:** Browser `localStorage`
- **Deployment:** Vercel

## Runtime modes

### Supabase multiplayer

When both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present, rooms and players are stored in Supabase. The client subscribes to changes on the `rooms` and `players` tables, allowing separate browsers and devices to receive room, round, and score updates.

Use this mode for the actual multiplayer experience.

### In-memory fallback

When either Supabase variable is missing, the app uses in-browser JavaScript objects. This is useful for inspecting the interface without a database, but it:

- does not synchronize separate tabs, browsers, or devices;
- loses rooms, players, and scores on refresh; and
- is not a replacement for the Supabase multiplayer path.

## Local setup

### Prerequisites

- Node.js 20.9 or later
- npm
- A Supabase project for multi-device play

### Start the single-browser demo

```bash
git clone https://github.com/kudala-bharani/word-hive-live.git
cd word-hive-live
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Supabase variables, the app automatically uses its in-memory fallback.

### Enable Supabase multiplayer

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard).
2. Open the SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy your project URL and anon key from the project's API settings.
4. Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

5. Add the two values to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

6. Run `npm run dev`, create a room, and join it from another browser or device.

The anon key is designed to be used by the browser. Never put a Supabase service-role key in a `NEXT_PUBLIC_*` variable.

If your Supabase project predates multi-round support, run [`supabase/migration-rounds.sql`](supabase/migration-rounds.sql) once.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as project environment variables.
3. Deploy or redeploy the project.
4. Verify Realtime behavior by creating a room in one browser and joining it from another.

`vercel.json` already contains the Next.js build and install configuration.

## Project structure

```text
components/                Reusable game and leaderboard UI
lib/gameConfig.js          Five-hive timing configuration
lib/puzzles.js             35 bundled puzzles and word lists
lib/supabase.js            Supabase data layer and in-memory fallback
lib/wordValidator.js       Word validation, pangrams, and scoring
pages/create.js            Room creation
pages/join.js              Room joining
pages/room/[roomCode].js   Lobby, gameplay, round breaks, and results
supabase/schema.sql        Tables, policies, indexes, and Realtime setup
```

## Customization

- Change round count or duration in `lib/gameConfig.js`.
- Add puzzle definitions in `lib/puzzles.js`.
- Change validation and scoring in `lib/wordValidator.js`.
- Change the honey color palette in `tailwind.config.js`.

A puzzle definition must contain a unique numeric ID, exactly seven unique letters, a center letter included in that set, lowercase accepted words, and any pangrams to highlight in the results view.

## Security and current limitations

The included Supabase schema prioritizes easy demos and portfolio review. It is **not hardened for an untrusted public production service**.

Before treating the app as production-ready, address the following:

- The current Row Level Security policies allow anonymous clients to read and write every room and player row.
- There is no account authentication or server-side host authorization; player identity is restored from `localStorage`.
- Word validation, score calculation, and game-state mutations run in the browser.
- The host's open browser advances the game when a timer expires, so a room can stall if the host disconnects.
- The 10-player cap is enforced by application code rather than an atomic database operation.
- Score updates use a read-modify-write flow rather than a database transaction.
- Rooms are not expired or deleted automatically.
- Rate limiting, abuse controls, monitoring, analytics, and automated tests are not included.

A hardened version should add authenticated or signed room membership, restrictive RLS policies, server-side/RPC mutations, atomic join and scoring operations, and scheduled room cleanup.

## Feedback

Please open a GitHub issue for bugs or suggestions.

## License

No open-source license has been added to this repository. Standard copyright restrictions apply unless a license is added.
