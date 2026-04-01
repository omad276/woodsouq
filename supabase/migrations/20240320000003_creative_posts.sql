-- Create creative_posts table
CREATE TABLE IF NOT EXISTS creative_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Engineering', 'Artistic', 'Furniture', 'Architecture')),
  description TEXT,
  image_url TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creative_comments table
CREATE TABLE IF NOT EXISTS creative_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES creative_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creative_likes table (to track one like per user per post)
CREATE TABLE IF NOT EXISTS creative_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES creative_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE creative_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_likes ENABLE ROW LEVEL SECURITY;

-- Policies for creative_posts
CREATE POLICY "Anyone can view creative posts" ON creative_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON creative_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own posts" ON creative_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON creative_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for creative_comments
CREATE POLICY "Anyone can view comments" ON creative_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON creative_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own comments" ON creative_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for creative_likes
CREATE POLICY "Anyone can view likes" ON creative_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON creative_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" ON creative_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_creative_posts_user_id ON creative_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_creative_posts_category ON creative_posts(category);
CREATE INDEX IF NOT EXISTS idx_creative_posts_created_at ON creative_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creative_comments_post_id ON creative_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_creative_likes_post_id ON creative_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_creative_likes_user_id ON creative_likes(user_id);

-- RPC functions for atomic like count updates
CREATE OR REPLACE FUNCTION increment_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE creative_posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE creative_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
