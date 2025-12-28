# Explore Network Direct Chat - Quick Reference

## 🚀 What Changed

### **Removed**

- ❌ Connection request system
- ❌ Connection status tracking
- ❌ ConnectionRequestModal component
- ❌ useConnections hook
- ❌ All "Connect" buttons

### **Added**

- ✅ Direct "Chat" buttons on all profile cards
- ✅ Instant conversation creation
- ✅ Online/offline presence indicators
- ✅ Real-time typing indicators
- ✅ Two-way messaging (founder ↔ investor)

---

## 📁 Files Changed

| File                                         | Type     | Changes                                       |
| -------------------------------------------- | -------- | --------------------------------------------- |
| `hooks/useChat.ts`                           | Modified | Added typing, presence, conversation creation |
| `app/(tabs)/network.tsx`                     | Modified | Removed connections, added chat               |
| `app/(tabs)/chat.tsx`                        | Modified | Added presence, typing, URL params            |
| `components/network/FounderProfileCard.tsx`  | Modified | Replaced connect button with chat             |
| `components/network/InvestorProfileCard.tsx` | Modified | Replaced connect button with chat             |
| `components/chat/ChatInput.tsx`              | Modified | Added typing event handlers                   |

---

## 🎯 How It Works

### **1. Opening a Chat**

```typescript
// From Network Page
Click "Chat" button
  → getOrCreateDirectConversation(userId, userName)
  → Returns conversationId
  → Navigate to chat with conversationId param
  → Chat screen auto-opens conversation
```

### **2. Conversation Creation**

```typescript
getOrCreateDirectConversation(userId, otherUserId, name)
  → Check if conversation exists
  → If yes: return existing conversationId
  → If no: create new conversation
    → Insert into conversations table
    → Add both users to conversation_members
    → Return new conversationId
```

### **3. Presence Tracking**

```typescript
// User A opens app
useBroadcastPresence()
  → Subscribes to channel `presence:${userA.id}`
  → Tracks: { user_id, online_at, name }

// User B checks if User A is online
const { isOnline } = usePresence(userA.id)
  → Subscribes to channel `presence:${userA.id}`
  → Syncs presence state
  → Returns isOnline boolean
```

### **4. Typing Indicators**

```typescript
// User A types message
ChatInput onTypingStart()
  → useTypingIndicator.startTyping('User A')
  → Track on channel `typing:${conversationId}`
  → Payload: { typing: true, name: 'User A' }

// User B sees typing
useTypingIndicator(conversationId)
  → Subscribes to channel `typing:${conversationId}`
  → Receives presence sync
  → Extracts typing users
  → Returns ['User A']
  → Displays "User A is typing..."
```

---

## 🔧 Usage Examples

### **Get or Create Conversation**

```typescript
import { getOrCreateDirectConversation } from '@/hooks/useChat';

const { conversationId, error } = await getOrCreateDirectConversation(
  currentUserId,
  targetUserId,
  targetUserName
);

if (error) {
  Alert.alert('Error', error);
} else {
  // Navigate to chat
  router.push({
    pathname: '/(tabs)/chat',
    params: { conversationId, userName: targetUserName },
  });
}
```

### **Broadcast Presence**

```typescript
import { useBroadcastPresence } from '@/hooks/useChat';

function App() {
  // Automatically broadcasts presence when user is logged in
  useBroadcastPresence();

  return <YourApp />;
}
```

### **Check User Presence**

```typescript
import { usePresence } from '@/hooks/useChat';

function ChatHeader({ otherUserId }) {
  const { isOnline } = usePresence(otherUserId);

  return (
    <View>
      <View style={[styles.dot, isOnline && styles.online]} />
      <Text>{isOnline ? 'Online' : 'Offline'}</Text>
    </View>
  );
}
```

### **Typing Indicators**

```typescript
import { useTypingIndicator } from '@/hooks/useChat';

function ChatScreen({ conversationId, userName }) {
  const { typingUsers, startTyping, stopTyping } =
    useTypingIndicator(conversationId);

  return (
    <>
      <MessageList />

      {typingUsers.length > 0 && (
        <Text>{typingUsers.join(', ')} is typing...</Text>
      )}

      <ChatInput
        onTypingStart={() => startTyping(userName)}
        onTypingStop={stopTyping}
        onSend={sendMessage}
      />
    </>
  );
}
```

---

## 🎨 UI Components

### **FounderProfileCard**

```typescript
<FounderProfileCard
  profile={profile}
  startup={startup}
  onChat={() => handleChat(profile.id, profile.full_name)}
  onViewDetails={() => viewProfile(profile.id)}
  onViewPitch={() => viewPitch(startup.id)}
  chatLoading={chatLoading}
/>
```

**Props:**

- `profile: NetworkProfile` - User profile data
- `startup?: StartupProfile` - Startup data (if available)
- `onChat: () => void` - Chat button handler
- `onViewDetails: () => void` - View profile handler
- `onViewPitch: () => void` - View pitch handler
- `chatLoading?: boolean` - Loading state for chat button

### **InvestorProfileCard**

```typescript
<InvestorProfileCard
  profile={profile}
  onChat={() => handleChat(profile.id, profile.full_name)}
  onViewDetails={() => viewProfile(profile.id)}
  chatLoading={chatLoading}
/>
```

**Props:**

- `profile: NetworkProfile` - User profile data
- `onChat: () => void` - Chat button handler
- `onViewDetails: () => void` - View profile handler
- `chatLoading?: boolean` - Loading state for chat button

---

## 📊 Database Schema (Unchanged)

### **conversations**

```sql
id uuid PRIMARY KEY
title text
is_group boolean DEFAULT false
metadata jsonb
created_at timestamptz
updated_at timestamptz
```

### **conversation_members**

```sql
id uuid PRIMARY KEY
conversation_id uuid REFERENCES conversations
profile_id uuid REFERENCES profiles
role text DEFAULT 'member'
joined_at timestamptz
UNIQUE(conversation_id, profile_id)
```

### **messages**

```sql
id uuid PRIMARY KEY
conversation_id uuid REFERENCES conversations
sender_id uuid REFERENCES profiles
content text
metadata jsonb
created_at timestamptz
edited_at timestamptz
deleted boolean DEFAULT false
```

---

## 🔐 RLS Policies (Unchanged)

```sql
-- Users can view conversations they're members of
CREATE POLICY "Conversations: member can view"
  ON conversations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_id = conversations.id
      AND profile_id = auth.uid()
  ));

-- Users can view/manage their membership
CREATE POLICY "ConversationMembers: member access"
  ON conversation_members FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Users can view messages in their conversations
CREATE POLICY "Messages: members can select"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_id = messages.conversation_id
      AND profile_id = auth.uid()
  ));

-- Users can send messages to their conversations
CREATE POLICY "Messages: members can insert"
  ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversation_members
    WHERE conversation_id = messages.conversation_id
      AND profile_id = auth.uid()
  ));
```

---

## 🧪 Testing

### **Manual Test Steps**

#### **Test 1: Founder → Investor Chat**

1. Login as founder
2. Navigate to Network tab
3. Verify investor profiles visible
4. Click "Chat" button on investor
5. ✅ Chat screen opens
6. ✅ Conversation created
7. Send message
8. ✅ Message appears

#### **Test 2: Investor → Founder Chat**

1. Login as investor
2. Navigate to Network tab
3. Verify founder profiles visible
4. Click "Chat" on founder
5. ✅ Chat screen opens
6. ✅ Conversation created
7. Send message
8. ✅ Message appears

#### **Test 3: Two-way Messaging**

1. User A sends message to User B
2. ✅ User B receives message in real-time
3. User B replies
4. ✅ User A receives reply in real-time

#### **Test 4: Presence**

1. User A opens chat with User B
2. ✅ Shows "Offline" initially
3. User B opens app
4. ✅ Status changes to "Online"
5. User B closes app
6. ✅ Status changes to "Offline"

#### **Test 5: Typing Indicators**

1. User A opens chat with User B
2. User B starts typing
3. ✅ User A sees "User B is typing..."
4. User B stops typing
5. ✅ Indicator disappears after 3s
6. User B sends message
7. ✅ Indicator disappears immediately

---

## 🐛 Troubleshooting

### **Issue: No profiles showing on network page**

**Fix:** Check that users have role set in profiles table

```sql
SELECT id, email, role, full_name FROM profiles;
```

### **Issue: Chat button doesn't work**

**Check:**

1. User is authenticated (`user?.id` exists)
2. Target user ID is valid
3. Console for errors in `getOrCreateDirectConversation`

### **Issue: Messages not appearing**

**Check:**

1. Both users are members of conversation
2. RLS policies allow message insertion
3. Realtime subscription active (check browser console)

### **Issue: Typing indicator stuck**

**Fix:** Indicator auto-clears after 3 seconds. If persists, check:

1. `typingTimeoutRef` is clearing properly
2. Channel cleanup on unmount

### **Issue: Presence not updating**

**Check:**

1. User is broadcasting presence (`useBroadcastPresence()` called)
2. Presence channel subscribed correctly
3. Network connection stable

---

## 📈 Performance Tips

### **Optimize Presence Checks**

- Only track presence for active chat conversations
- Unsubscribe from channels when not needed
- Use `useMemo` for presence state

### **Reduce Realtime Load**

- Limit typing events (already throttled to 2s)
- Batch message sends if needed
- Clean up channels on unmount

### **Database Queries**

- Index on `conversation_members(profile_id, conversation_id)`
- Index on `messages(conversation_id, created_at)`
- Limit message fetch to recent 50-100 messages

---

## 🔮 Future Enhancements

1. **Message Read Receipts**

   - Add `message_reads` table
   - Track who read which message
   - Show "Seen" status

2. **Push Notifications**

   - Notify on new messages
   - Notify when user comes online
   - Badge count on chat tab

3. **Rich Media**

   - Image uploads
   - File attachments
   - Voice messages

4. **Group Chats**

   - Multi-user conversations
   - Group naming
   - Admin controls

5. **Message Search**
   - Full-text search
   - Filter by sender
   - Date range

---

## ✅ Checklist

**Before Deployment:**

- [ ] Test founder → investor chat
- [ ] Test investor → founder chat
- [ ] Test two-way messaging
- [ ] Test presence indicators
- [ ] Test typing indicators
- [ ] Test on mobile
- [ ] Test on web
- [ ] Verify no console errors
- [ ] Check RLS policies
- [ ] Test with multiple users

**After Deployment:**

- [ ] Monitor error logs
- [ ] Check realtime channel usage
- [ ] Verify message delivery rate
- [ ] Monitor database performance
- [ ] Collect user feedback

---

## 📚 Related Documentation

- [Main Implementation Doc](./EXPLORE_NETWORK_DIRECT_CHAT_IMPLEMENTATION.md)
- [Chat System Guide](./10-chat-messaging.md)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)

---

**Quick Reference Complete!** ✅
