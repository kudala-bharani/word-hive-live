-- Word Hive Live — run in Supabase SQL Editor (or via supabase db push)

CREATE TABLE IF NOT EXISTS rooms (
  code TEXT PRIMARY KEY,
  host_id UUID NOT NULL,
  host_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting',
  duration INTEGER NOT NULL,
  start_time BIGINT,
  end_time BIGINT,
  puzzle_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT NOT NULL REFERENCES rooms(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  words_found TEXT[] DEFAULT '{}',
  is_host BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_room ON players(room_code);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rooms_public" ON rooms;
DROP POLICY IF EXISTS "players_public" ON players;

CREATE POLICY "rooms_public" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "players_public" ON players FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
