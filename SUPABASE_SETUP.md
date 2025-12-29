# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `journey-builder-egym` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is sufficient for MVP
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 3: Create Environment File

1. In the project root, create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Add your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

## Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the SQL from `TECHNICAL_ARCHITECTURE.md` (Section 3: Supabase Database Schema)
4. Click "Run" to execute

The schema includes:
- `journeys` table
- `journey_nodes` table
- `journey_edges` table (for future branching)
- `actions` table
- `reminders` table
- `events` table
- `event_completions` table
- `conditions` table (for future conditions)
- All necessary indexes

## Step 5: Verify Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Check browser console - should see no Supabase errors
3. In Supabase dashboard → **Table Editor**, verify tables were created

## Step 6: Enable Row Level Security (Optional for MVP)

For the MVP prototype, you can disable RLS or create simple policies:

1. Go to **Authentication** → **Policies**
2. For each table, you can:
   - **Option A**: Disable RLS (for prototype only)
   - **Option B**: Create policy: "Allow all operations for authenticated users"

For prototype simplicity, we can disable RLS on all tables:

```sql
ALTER TABLE journeys DISABLE ROW LEVEL SECURITY;
ALTER TABLE journey_nodes DISABLE ROW LEVEL SECURITY;
ALTER TABLE journey_edges DISABLE ROW LEVEL SECURITY;
ALTER TABLE actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_completions DISABLE ROW LEVEL SECURITY;
ALTER TABLE conditions DISABLE ROW LEVEL SECURITY;
```

**Note**: This is only for the prototype. Production would need proper RLS policies.

## Troubleshooting

### "Supabase credentials not found"
- Check `.env.local` exists and has correct variable names
- Restart dev server after creating `.env.local`
- Ensure variables start with `VITE_`

### Connection errors
- Verify Project URL is correct (no trailing slash)
- Verify anon key is correct (full key, not truncated)
- Check Supabase project is active (not paused)

### Schema errors
- Ensure you're running SQL in the correct database
- Check for typos in table/column names
- Verify foreign key relationships match

## Next Steps

Once Supabase is configured:
1. The app will automatically connect on startup
2. You can start creating journeys in the builder
3. Data will persist across refreshes
4. Multiple devices can share the same data (if using same Supabase project)

---

**Ready to proceed with Phase 2 once Supabase is set up!**




