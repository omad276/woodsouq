import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const migrationSQL = `
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

-- Create creative_likes table
CREATE TABLE IF NOT EXISTS creative_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES creative_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
`;

const policiesSQL = `
-- Enable RLS
ALTER TABLE creative_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view creative posts" ON creative_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON creative_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON creative_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON creative_posts;
DROP POLICY IF EXISTS "Anyone can view comments" ON creative_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON creative_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON creative_comments;
DROP POLICY IF EXISTS "Anyone can view likes" ON creative_likes;
DROP POLICY IF EXISTS "Authenticated users can like" ON creative_likes;
DROP POLICY IF EXISTS "Users can unlike" ON creative_likes;

-- Create policies
CREATE POLICY "Anyone can view creative posts" ON creative_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON creative_posts FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own posts" ON creative_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON creative_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view comments" ON creative_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON creative_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own comments" ON creative_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view likes" ON creative_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON creative_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON creative_likes FOR DELETE USING (auth.uid() = user_id);
`;

const functionsSQL = `
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
`;

const seedSQL = `
INSERT INTO creative_posts (title, category, description, image_url, likes_count) VALUES
('Modern Minimalist Table', 'Furniture', 'A sleek modern dining table crafted from solid walnut with clean lines and natural finish.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 23),
('Sustainable Timber House', 'Architecture', 'Award-winning residential design featuring cross-laminated timber construction and passive solar design.', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', 45),
('Wood Sculpture - Flow', 'Artistic', 'Abstract sculpture carved from a single piece of reclaimed oak, representing the flow of water.', 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800', 31),
('Precision CNC Joints', 'Engineering', 'Innovative interlocking joint system designed for modular furniture assembly without fasteners.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 18),
('Hand-Carved Cabinet', 'Furniture', 'Traditional Japanese-inspired cabinet with hand-carved details and dovetail joinery.', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', 27),
('Timber Bridge Design', 'Engineering', 'Pedestrian bridge concept using glulam beams and tensioned steel cables for 50m span.', 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800', 39)
ON CONFLICT DO NOTHING;
`;

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const results: string[] = [];

  try {
    // Create tables
    const { error: tablesError } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    if (tablesError) {
      // Try direct query approach
      const { error } = await supabase.from('creative_posts').select('id').limit(1);
      if (error?.code === '42P01') {
        // Table doesn't exist, we need to create it via SQL editor
        return NextResponse.json({
          error: 'Tables need to be created manually in Supabase SQL Editor',
          sql: migrationSQL + policiesSQL + functionsSQL + seedSQL
        }, { status: 400 });
      }
    }
    results.push('Tables checked/created');

    // Check if data exists
    const { count } = await supabase
      .from('creative_posts')
      .select('*', { count: 'exact', head: true });

    if (!count || count === 0) {
      // Insert seed data
      const { error: seedError } = await supabase.from('creative_posts').insert([
        { title: 'Modern Minimalist Table', category: 'Furniture', description: 'A sleek modern dining table crafted from solid walnut with clean lines and natural finish.', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', likes_count: 23 },
        { title: 'Sustainable Timber House', category: 'Architecture', description: 'Award-winning residential design featuring cross-laminated timber construction and passive solar design.', image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800', likes_count: 45 },
        { title: 'Wood Sculpture - Flow', category: 'Artistic', description: 'Abstract sculpture carved from a single piece of reclaimed oak, representing the flow of water.', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800', likes_count: 31 },
        { title: 'Precision CNC Joints', category: 'Engineering', description: 'Innovative interlocking joint system designed for modular furniture assembly without fasteners.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', likes_count: 18 },
        { title: 'Hand-Carved Cabinet', category: 'Furniture', description: 'Traditional Japanese-inspired cabinet with hand-carved details and dovetail joinery.', image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', likes_count: 27 },
        { title: 'Timber Bridge Design', category: 'Engineering', description: 'Pedestrian bridge concept using glulam beams and tensioned steel cables for 50m span.', image_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800', likes_count: 39 },
      ]);

      if (seedError) {
        results.push(`Seed error: ${seedError.message}`);
      } else {
        results.push('Seed data inserted');
      }
    } else {
      results.push(`Data already exists: ${count} posts`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
