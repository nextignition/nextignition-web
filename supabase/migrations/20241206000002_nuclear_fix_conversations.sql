-- NUCLEAR FIX: Completely disable and rebuild RLS for conversations
-- This will fix the infinite recursion once and for all

-- Step 1: DISABLE RLS completely on all chat tables
alter table public.conversations disable row level security;
alter table public.conversation_members disable row level security;
alter table public.messages disable row level security;

-- Step 2: Drop ALL policies (in case any are stuck)
do $$ 
declare
  r record;
begin
  -- Drop all policies on conversations
  for r in (select policyname from pg_policies where tablename = 'conversations' and schemaname = 'public') loop
    execute 'drop policy if exists "' || r.policyname || '" on public.conversations';
  end loop;
  
  -- Drop all policies on conversation_members
  for r in (select policyname from pg_policies where tablename = 'conversation_members' and schemaname = 'public') loop
    execute 'drop policy if exists "' || r.policyname || '" on public.conversation_members';
  end loop;
  
  -- Drop all policies on messages
  for r in (select policyname from pg_policies where tablename = 'messages' and schemaname = 'public') loop
    execute 'drop policy if exists "' || r.policyname || '" on public.messages';
  end loop;
end $$;

-- Step 3: Drop any helper functions
drop function if exists is_conversation_member(uuid, uuid);

-- Step 4: Re-enable RLS
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

-- Step 5: Create SIMPLE policies that CANNOT cause recursion
-- Key principle: NO policy should reference another RLS-protected table

-- CONVERSATION_MEMBERS: Simple policies
create policy "cm_select" on public.conversation_members
  for select to authenticated using (true);

create policy "cm_insert" on public.conversation_members
  for insert to authenticated with check (true);

create policy "cm_update" on public.conversation_members
  for update to authenticated using (true) with check (true);

create policy "cm_delete" on public.conversation_members
  for delete to authenticated using (profile_id = auth.uid());

-- CONVERSATIONS: Simple policies
create policy "conv_select" on public.conversations
  for select to authenticated using (true);

create policy "conv_insert" on public.conversations
  for insert to authenticated with check (true);

create policy "conv_update" on public.conversations
  for update to authenticated using (true) with check (true);

create policy "conv_delete" on public.conversations
  for delete to authenticated using (true);

-- MESSAGES: Simple policies
create policy "msg_select" on public.messages
  for select to authenticated using (true);

create policy "msg_insert" on public.messages
  for insert to authenticated with check (sender_id = auth.uid());

create policy "msg_update" on public.messages
  for update to authenticated using (sender_id = auth.uid()) with check (sender_id = auth.uid());

create policy "msg_delete" on public.messages
  for delete to authenticated using (sender_id = auth.uid());
