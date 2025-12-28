-- Migration: Create Feed Posts System
-- Purpose: Replace hardcoded FEED_POSTS with real database-driven activity feed
-- File: 20251210000003_create_feed_posts_system.sql

-- =====================================================
-- 1. CREATE FEED POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Post content
  type text NOT NULL CHECK (type IN ('funding', 'event', 'onboarding', 'achievement', 'milestone', 'announcement')),
  content text NOT NULL,
  
  -- Metadata
  company_name text, -- Pulled from startup_profiles if available
  
  -- Engagement
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feed_posts_user_id ON feed_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_type ON feed_posts(type);
CREATE INDEX IF NOT EXISTS idx_feed_posts_created_at ON feed_posts(created_at DESC);

-- =====================================================
-- 2. CREATE FEED POST LIKES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS feed_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure one like per user per post
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_feed_post_likes_post_id ON feed_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_post_likes_user_id ON feed_post_likes(user_id);

-- =====================================================
-- 3. CREATE FEED POST COMMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS feed_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feed_post_comments_post_id ON feed_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_post_comments_user_id ON feed_post_comments(user_id);

-- =====================================================
-- 4. CREATE FEED POST BOOKMARKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS feed_post_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure one bookmark per user per post
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_feed_post_bookmarks_post_id ON feed_post_bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_post_bookmarks_user_id ON feed_post_bookmarks(user_id);

-- =====================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================

ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_post_bookmarks ENABLE ROW LEVEL SECURITY;

-- Feed Posts: Everyone can view, only owner can create/update/delete
CREATE POLICY "Feed posts are publicly viewable by authenticated users"
  ON feed_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own feed posts"
  ON feed_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feed posts"
  ON feed_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feed posts"
  ON feed_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Likes: Everyone can view, authenticated users can like
CREATE POLICY "Feed post likes are publicly viewable"
  ON feed_post_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON feed_post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON feed_post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments: Everyone can view, authenticated users can comment
CREATE POLICY "Feed post comments are publicly viewable"
  ON feed_post_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON feed_post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON feed_post_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON feed_post_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bookmarks: Users can only see own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON feed_post_bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON feed_post_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete bookmarks"
  ON feed_post_bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. CREATE VIEW FOR FEED WITH FULL POST DATA
-- =====================================================

CREATE OR REPLACE VIEW feed_posts_with_details AS
SELECT 
  fp.id,
  fp.user_id,
  fp.type,
  fp.content,
  fp.company_name,
  fp.created_at,
  fp.updated_at,
  
  -- User details
  p.full_name as user_name,
  p.email,
  p.role as user_role,
  
  -- Engagement counts
  fp.likes_count,
  fp.comments_count,
  fp.shares_count,
  
  -- Time ago calculation (approximation)
  CASE 
    WHEN AGE(now(), fp.created_at) < interval '1 hour' THEN 
      EXTRACT(EPOCH FROM AGE(now(), fp.created_at))::int / 60 || ' minutes ago'
    WHEN AGE(now(), fp.created_at) < interval '1 day' THEN 
      EXTRACT(EPOCH FROM AGE(now(), fp.created_at))::int / 3600 || ' hours ago'
    WHEN AGE(now(), fp.created_at) < interval '7 days' THEN 
      EXTRACT(EPOCH FROM AGE(now(), fp.created_at))::int / 86400 || ' days ago'
    ELSE 
      TO_CHAR(fp.created_at, 'Mon DD, YYYY')
  END as time_ago
  
FROM feed_posts fp
JOIN profiles p ON p.id = fp.user_id
WHERE p.onboarding_completed = true -- Only show posts from completed profiles
ORDER BY fp.created_at DESC;

-- =====================================================
-- 7. CREATE TRIGGERS FOR COUNT UPDATES
-- =====================================================

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_feed_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feed_posts 
    SET likes_count = likes_count + 1,
        updated_at = now()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feed_posts 
    SET likes_count = GREATEST(0, likes_count - 1),
        updated_at = now()
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR DELETE ON feed_post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_feed_post_likes_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION update_feed_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feed_posts 
    SET comments_count = comments_count + 1,
        updated_at = now()
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feed_posts 
    SET comments_count = GREATEST(0, comments_count - 1),
        updated_at = now()
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comments_count_trigger
  AFTER INSERT OR DELETE ON feed_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_feed_post_comments_count();

-- =====================================================
-- 8. SEED SAMPLE FEED POSTS
-- =====================================================

DO $$
DECLARE
  founder1_id uuid;
  founder2_id uuid;
  expert_id uuid;
  investor_id uuid;
  post1_id uuid;
  post2_id uuid;
  post3_id uuid;
  post4_id uuid;
BEGIN
  -- Get existing user IDs (or use sample experts from previous migration)
  SELECT id INTO expert_id FROM profiles WHERE email = 'expert1_sarah@example.com' LIMIT 1;
  
  -- Get some founders if they exist
  SELECT id INTO founder1_id FROM profiles WHERE role = 'founder' AND onboarding_completed = true LIMIT 1;
  SELECT id INTO founder2_id FROM profiles WHERE role = 'founder' AND onboarding_completed = true OFFSET 1 LIMIT 1;
  
  -- Get an investor if exists
  SELECT id INTO investor_id FROM profiles WHERE role = 'investor' AND onboarding_completed = true LIMIT 1;
  
  -- Create sample posts (only if we have users)
  IF expert_id IS NOT NULL THEN
    -- Expert announces new availability
    INSERT INTO feed_posts (user_id, type, content, company_name)
    VALUES (
      expert_id,
      'announcement',
      'New mentorship slots available! Book a session to discuss growth marketing strategies.',
      'NextIgnition'
    )
    RETURNING id INTO post1_id;
    
    -- Add some sample likes and comments
    INSERT INTO feed_post_likes (post_id, user_id)
    VALUES (post1_id, expert_id)
    ON CONFLICT (post_id, user_id) DO NOTHING;
  END IF;
  
  IF founder1_id IS NOT NULL THEN
    -- Founder announces funding
    SELECT company_name INTO STRICT founder2_id FROM startup_profiles WHERE founder_id = founder1_id LIMIT 1;
    
    INSERT INTO feed_posts (user_id, type, content, company_name)
    VALUES (
      founder1_id,
      'funding',
      'Excited to announce we just closed a $2M seed round! Thank you to all our supporters.',
      COALESCE((SELECT company_name FROM startup_profiles WHERE founder_id = founder1_id LIMIT 1), 'TechStart Inc')
    )
    RETURNING id INTO post2_id;
  END IF;
  
  IF founder2_id IS NOT NULL THEN
    -- Founder achievement
    INSERT INTO feed_posts (user_id, type, content, company_name)
    VALUES (
      founder2_id,
      'milestone',
      'Hit 1,000 users today! Incredible journey so far. Thank you to everyone who believed in our vision.',
      COALESCE((SELECT company_name FROM startup_profiles WHERE founder_id = founder2_id LIMIT 1), 'Innovate Labs')
    )
    RETURNING id INTO post3_id;
  END IF;
  
  IF investor_id IS NOT NULL THEN
    -- Investor hosts event
    INSERT INTO feed_posts (user_id, type, content)
    VALUES (
      investor_id,
      'event',
      'Hosting a fireside chat on "Fundraising in 2024" this Friday at 3 PM. DM for details!'
    )
    RETURNING id INTO post4_id;
  END IF;
  
  RAISE NOTICE 'Seeded sample feed posts successfully';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not seed all sample posts - some users may not exist yet';
END $$;

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Check feed posts created
SELECT 'Feed Posts Created' as check, COUNT(*) as count FROM feed_posts;

-- Check feed with details view
SELECT 'Feed Posts with Details' as check, COUNT(*) as count FROM feed_posts_with_details;

-- Sample posts
SELECT 
  user_name,
  type,
  content,
  time_ago,
  likes_count,
  comments_count
FROM feed_posts_with_details
LIMIT 5;
