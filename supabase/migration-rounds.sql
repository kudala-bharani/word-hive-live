-- Run once if your project was created before multi-round support
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS current_round INTEGER NOT NULL DEFAULT 0;
