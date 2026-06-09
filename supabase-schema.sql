-- This file contains the SQL schema needed to set up your Supabase database.
-- Go to your Supabase project dashboard -> SQL Editor -> New Query
-- Copy and paste the contents of this file and click "Run"

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id text PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  price numeric NOT NULL,
  price_indicator text,
  surface numeric,
  bedrooms numeric,
  bathrooms numeric,
  region text,
  city text,
  quarter text,
  description text,
  characteristics jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  is_nego boolean DEFAULT false,
  owner_name text,
  owner_phone text,
  owner_email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create requests table
CREATE TABLE IF NOT EXISTS public.requests (
  id text PRIMARY KEY,
  type text NOT NULL,
  budget_max numeric NOT NULL,
  region text NOT NULL,
  city text NOT NULL,
  quarter text,
  surface numeric,
  bedrooms numeric,
  bathrooms numeric,
  description text,
  status text NOT NULL DEFAULT 'pending',
  client_name text,
  client_phone text,
  client_email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create storage bucket for properties (if you haven't created it via UI)
-- Note: It is often easier to create buckets via the Supabase Storage UI
INSERT INTO storage.buckets (id, name, public) 
VALUES ('properties', 'properties', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies (allow public read, allow authenticated/anon uploads)
-- Note: Replace with appropriate authenticated policies for production use
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'properties');

CREATE POLICY "Allow Uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'properties');
