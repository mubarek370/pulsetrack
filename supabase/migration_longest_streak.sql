-- Migration: Add longest_streak column to habits, and name column to workouts
-- Run this in the Supabase Dashboard -> SQL Editor

ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS name text;
