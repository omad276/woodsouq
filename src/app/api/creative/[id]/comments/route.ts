import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from('creative_comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { comment, user_name } = body;

  if (!comment) {
    return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('creative_comments')
    .insert({
      post_id: id,
      user_id: user?.id || null,
      user_name: user_name || 'Guest',
      comment,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
