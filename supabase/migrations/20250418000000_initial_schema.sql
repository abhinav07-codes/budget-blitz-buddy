
-- Create tables
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  amount decimal(12,2) not null,
  category text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  imported boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.category_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  category text not null,
  limit_amount decimal(12,2) not null,
  current_amount decimal(12,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, category)
);

create table public.daily_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  limit_amount decimal(12,2) not null,
  current_amount decimal(12,2) default 0,
  date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Set up Row Level Security (RLS)
alter table public.expenses enable row level security;
alter table public.category_limits enable row level security;
alter table public.daily_limits enable row level security;

-- Create policies
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Similar policies for category_limits
create policy "Users can view their category limits"
  on public.category_limits for select
  using (auth.uid() = user_id);

create policy "Users can manage their category limits"
  on public.category_limits for all
  using (auth.uid() = user_id);

-- Similar policies for daily_limits
create policy "Users can view their daily limits"
  on public.daily_limits for select
  using (auth.uid() = user_id);

create policy "Users can manage their daily limits"
  on public.daily_limits for all
  using (auth.uid() = user_id);
