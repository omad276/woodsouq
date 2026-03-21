import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: role || 'buyer' }
    });

    console.log('authError:', authError);
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert profile directly
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      name,
      email,
      role: role || 'buyer',
      is_verified: false,
      created_at: new Date().toISOString()
    });

    if (profileError) {
      // Rollback: delete auth user if profile insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create profile: ' + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
