-- Migration: Add exercises JSONB column to workouts table
-- Run this in your Supabase Dashboard -> SQL Editor

ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS exercises jsonb DEFAULT '[]'::jsonb;
