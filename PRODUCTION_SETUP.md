# Production setup (Supabase + Vercel)

Code is ready for real multiplayer. Finish these steps once (about 10 minutes).

## 1. Supabase database

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project** (name: `word-hive-live`).
2. Open **SQL Editor** → **New query** → paste all of `supabase/schema.sql` → **Run**.
3. Open **Project Settings** → **API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Open **Database** → **Replication** and confirm **rooms** and **players** are enabled for Realtime (schema.sql also adds them).

## 2. Vercel deploy

1. Go to [vercel.com/new](https://vercel.com/new) → import **kudala-bharani/word-hive-live** from GitHub.
2. **Environment variables** (add both for Production, Preview, Development):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

3. Click **Deploy**.

Your live URL will look like `https://word-hive-live.vercel.app`.

## 3. Test multiplayer

1. Open the live URL on your phone or laptop → **Create Room**.
2. Share the invite link or room code with a friend on another device → **Join Room**.
3. Host clicks **Start Game** — scores should update on all devices within a second.

## Automated setup (WSL, after login)

If you are logged into both CLIs:

```bash
cd "/mnt/c/Users/bunny/Downloads/pinni website"
supabase login
vercel login
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh
```

## Local dev with Supabase

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key
npm run dev
```

Without `.env.local`, the app falls back to in-memory mode (single-browser demo only).
