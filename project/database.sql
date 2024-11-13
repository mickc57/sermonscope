create table transcriptions (
  id uuid default uuid_generate_v4() primary key,
  status text not null default 'pending',
  progress integer not null default 0,
  transcription jsonb,
  analysis jsonb,
  error text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Enable Row Level Security
alter table transcriptions enable row level security;

-- Create a policy that allows all operations
create policy "Enable all operations for authenticated users" on transcriptions
  for all using (true);