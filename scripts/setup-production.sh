#!/usr/bin/env bash
# Setup Supabase + Vercel for Word Hive Live (run in WSL)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PROJECT_NAME="${SUPABASE_PROJECT_NAME:-word-hive-live}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD:-}"

echo "==> Word Hive Live production setup"

if ! command -v supabase >/dev/null 2>&1; then
  echo "Installing Supabase CLI..."
  npm install -g supabase
fi

if ! supabase projects list >/dev/null 2>&1; then
  echo "Log in to Supabase: run 'supabase login' then re-run this script."
  exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
  DB_PASSWORD="$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)"
  echo "Generated DB password (save it): $DB_PASSWORD"
fi

if ! supabase projects list 2>/dev/null | grep -q "$PROJECT_NAME"; then
  echo "Creating Supabase project: $PROJECT_NAME"
  supabase projects create "$PROJECT_NAME" --db-password "$DB_PASSWORD" --region us-east-1
fi

REF=$(supabase projects list -o json | node -e "
const fs=require('fs');
const data=JSON.parse(fs.readFileSync(0,'utf8'));
const p=data.find(x=>x.name==='$PROJECT_NAME');
if(!p){process.exit(1)}
console.log(p.id);
")

echo "Project ref: $REF"

supabase link --project-ref "$REF"

echo "Applying database schema..."
supabase db execute -f supabase/schema.sql

URL="https://${REF}.supabase.co"
ANON=$(supabase projects api-keys --project-ref "$REF" -o json | node -e "
const d=JSON.parse(require('fs').readFileSync(0,'utf8'));
const k=d.find(x=>x.name==='anon'||x.name==='anon key');
console.log(k?.api_key||k?.key||'');
")

echo ""
echo "Supabase URL: $URL"
echo "Anon key: (set in Vercel)"

if ! command -v vercel >/dev/null 2>&1; then
  npm install -g vercel
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "Log in to Vercel: run 'vercel login' then re-run this script."
  exit 1
fi

vercel link --yes --project "$PROJECT_NAME" 2>/dev/null || vercel link --yes

printf '%s' "$URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development
printf '%s' "$ANON" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

vercel --prod --yes

echo "Done. Enable Realtime for rooms + players in Supabase Dashboard if not already active."
