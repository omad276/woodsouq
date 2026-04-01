import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('creative_posts')
    .select(`
      *,
      profiles:user_id (name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get comments count for each post
  const postsWithCounts = await Promise.all(
    (posts || []).map(async (post) => {
      const { count } = await supabase
        .from('creative_comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id);

      return {
        ...post,
        creator_name: post.profiles?.name || 'Anonymous',
        comments_count: count || 0,
      };
    })
  );

  return NextResponse.json(postsWithCounts);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, category, description, image_url } = body;

  if (!title || !category || !image_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('creative_posts')
    .insert({
      user_id: user.id,
      title,
      category,
      description,
      image_url,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
