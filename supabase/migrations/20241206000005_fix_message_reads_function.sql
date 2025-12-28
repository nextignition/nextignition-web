-- Fix message read tracking function with better error handling and ON CONFLICT handling

-- Drop the existing function
drop function if exists mark_messages_as_read(uuid, uuid);

-- Create improved function with ON CONFLICT handling
create or replace function mark_messages_as_read(
  p_conversation_id uuid,
  p_profile_id uuid
)
returns void as $$
begin
  -- Insert read receipts for all unread messages in the conversation
  -- Use ON CONFLICT to handle cases where read receipt already exists
  insert into public.message_reads (message_id, profile_id, read_at)
  select m.id, p_profile_id, now()
  from public.messages m
  where m.conversation_id = p_conversation_id
    and m.sender_id != p_profile_id
    and m.deleted = false
  on conflict (message_id, profile_id) do update
    set read_at = now();
  
  -- Update last_read_at in conversation_members
  update public.conversation_members
  set last_read_at = now()
  where conversation_id = p_conversation_id
    and profile_id = p_profile_id;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function mark_messages_as_read(uuid, uuid) to authenticated;
