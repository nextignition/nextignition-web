-- Add message read tracking
-- This allows us to track which messages have been read by which users

create table if not exists public.message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz default now(),
  unique (message_id, profile_id)
);

-- Enable RLS
alter table public.message_reads enable row level security;

-- RLS policies for message_reads
create policy "message_reads_select" on public.message_reads
  for select to authenticated using (true);

create policy "message_reads_insert" on public.message_reads
  for insert to authenticated with check (profile_id = auth.uid());

create policy "message_reads_delete" on public.message_reads
  for delete to authenticated using (profile_id = auth.uid());

-- Add index for performance
create index if not exists idx_message_reads_message_id on public.message_reads(message_id);
create index if not exists idx_message_reads_profile_id on public.message_reads(profile_id);

-- Add last_read_at to conversation_members to track when user last viewed conversation
alter table public.conversation_members 
  add column if not exists last_read_at timestamptz;

-- Create a function to mark messages as read
create or replace function mark_messages_as_read(
  p_conversation_id uuid,
  p_profile_id uuid
)
returns void as $$
begin
  -- Insert read receipts for all unread messages in the conversation
  insert into public.message_reads (message_id, profile_id, read_at)
  select m.id, p_profile_id, now()
  from public.messages m
  where m.conversation_id = p_conversation_id
    and m.sender_id != p_profile_id
    and not exists (
      select 1 
      from public.message_reads mr 
      where mr.message_id = m.id 
        and mr.profile_id = p_profile_id
    );
  
  -- Update last_read_at in conversation_members
  update public.conversation_members
  set last_read_at = now()
  where conversation_id = p_conversation_id
    and profile_id = p_profile_id;
end;
$$ language plpgsql security definer;
