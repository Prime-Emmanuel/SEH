-- Create the properties table
create table if not exists properties (
  id text primary key,
  title text,
  "referenceNumber" text,
  type text,
  status text,
  price numeric,
  "priceIndicator" text,
  surface numeric,
  bedrooms numeric,
  bathrooms numeric,
  region text,
  city text,
  quarter text,
  description text,
  characteristics jsonb,
  images jsonb,
  featured boolean,
  "featuredType" numeric,
  "isNego" boolean,
  "videoUrl" text,
  "ownerName" text,
  "ownerPhone" text,
  "ownerEmail" text,
  "virtualTourUrl" text,
  "createdBy" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()),
  "updatedAt" timestamp with time zone default timezone('utc'::text, now())
);

-- Create the requests table
create table if not exists requests (
  id text primary key,
  name text,
  phone text,
  email text,
  type text,
  "budgetMax" numeric,
  cities text,
  "surfaceMin" numeric,
  description text,
  status text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()),
  "updatedAt" timestamp with time zone default timezone('utc'::text, now())
);

-- Create properties bucket for images (do manually if this errors, or use IF NOT EXISTS equivalent if possible, but bucket insertion might fail if already exists)
-- A safe way to insert if not exists:
insert into storage.buckets (id, name, public)
select 'properties', 'properties', true
where not exists (select 1 from storage.buckets where id = 'properties');

-- Policies (these might error if they already exist, so you can ignore the errors for these if the tables/buckets were already created)
create policy "Public Access" on storage.objects for select using ( bucket_id = 'properties' );
create policy "Admin Upload" on storage.objects for insert with check ( bucket_id = 'properties' );
create policy "Admin Update" on storage.objects for update using ( bucket_id = 'properties' );
create policy "Admin Delete" on storage.objects for delete using ( bucket_id = 'properties' );
