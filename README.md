# PulseTrack — Full-Stack Fitness & Habit Tracker

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmubarek370%2Fpulsetrack&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY)

PulseTrack is a modern, full-stack fitness and habit tracking web application built with **React 19**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth & Storage)**.

---

## ✨ Features

- **🔐 Full Authentication & Security**: Email/password signup, session auto-refresh, password reset flow, and PostgreSQL Row-Level Security (RLS).
- **📋 Habit Tracking & Streaks**: Daily habit check-in, dynamic streak calculation, archive/unarchive, permanent deletion, and automatic record persistence.
- **🏋️ Workout Logging & Interactive Exercise Builder**:
  - Log workouts with name, type, date, duration, and calories.
  - Interactive Exercise Builder: add individual exercises with sets, reps, and weights.
  - Real-time automatic total volume calculation (`sets × reps × weight`).
  - Edit existing workouts with pre-populated fields and delete capability.
  - Server-side pagination with "Load more" history.
- **📊 365-Day Activity Heatmap**: GitHub-style activity matrix aggregated live across both workouts and habit check-ins.
- **📈 Analytics & Progress Charts**: 8-week training volume progression, habit completion rates, and exercise performance charts powered by Recharts.
- **📸 Profile Avatar Uploads**: Direct image upload and storage management powered by Supabase Storage CDN.
- **⚙️ Preferences Sync**: Unit system (kg/lbs), timezones, and dark/light themes synced directly to your cloud profile.
- **🔔 Toast Notification System**: Animated, auto-dismissing feedback for all user actions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend / Database**: Supabase (PostgreSQL, GoTrue Auth, Storage)
- **Tooling**: ESLint, PostCSS

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pulsetrack.git
cd pulsetrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Set up the Database

In your Supabase Dashboard **SQL Editor**, run the SQL files in the `supabase/` folder:
1. `supabase/schema.sql` (Initial tables, triggers & RLS policies)
2. `supabase/migration_longest_streak.sql`
3. `supabase/migration_avatars.sql`
4. `supabase/migration_exercises.sql`

In Supabase Dashboard **Storage**:
- Create a public bucket named `avatars`.

In Supabase Dashboard **Authentication**:
- Providers → Email → Ensure Email is enabled (toggle off "Confirm email" for local dev).

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173` to start using PulseTrack.

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

MIT License. Open source and free to use.
