import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const seedPosts = [
  {
    title: 'Modern Minimalist Table',
    category: 'Furniture',
    description: 'A sleek modern dining table crafted from solid walnut with clean lines and natural finish.',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  },
  {
    title: 'Sustainable Timber House',
    category: 'Architecture',
    description: 'Award-winning residential design featuring cross-laminated timber construction and passive solar design.',
    image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
  },
  {
    title: 'Wood Sculpture - Flow',
    category: 'Artistic',
    description: 'Abstract sculpture carved from a single piece of reclaimed oak, representing the flow of water.',
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800',
  },
  {
    title: 'Precision CNC Joints',
    category: 'Engineering',
    description: 'Innovative interlocking joint system designed for modular furniture assembly without fasteners.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  },
  {
    title: 'Hand-Carved Cabinet',
    category: 'Furniture',
    description: 'Traditional Japanese-inspired cabinet with hand-carved details and dovetail joinery.',
    image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
  },
  {
    title: 'Timber Bridge Design',
    category: 'Engineering',
    description: 'Pedestrian bridge concept using glulam beams and tensioned steel cables for 50m span.',
    image_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
  },
];

export async function POST() {
  const supabase = await createClient();

  // Check if posts already exist
  const { count } = await supabase
    .from('creative_posts')
    .select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    return NextResponse.json({ message: 'Seed data already exists', count });
  }

  // Insert seed posts (without user_id for demo purposes)
  const { data, error } = await supabase
    .from('creative_posts')
    .insert(seedPosts.map(post => ({
      ...post,
      user_id: null,
      likes_count: Math.floor(Math.random() * 50) + 5,
    })))
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Seed data created', posts: data });
}
