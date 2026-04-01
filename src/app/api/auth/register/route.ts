import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const userRole = role || 'buyer';

    // Clean up any orphaned profile first (from previous failed registrations)
    const { error: deleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('email', email);

    if (deleteError) {
      console.log('Profile cleanup error (may be ok if no orphan exists):', deleteError.message);
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: userRole }
    });

    if (authError) {
      // Return the actual error message for debugging
      return NextResponse.json({
        error: `Registration failed: ${authError.message}`
      }, { status: 400 });
    }

    if (!authData?.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Verify profile was created by trigger, if not create it manually
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single();

    if (!profile) {
      // Trigger didn't create profile, create manually
      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: authData.user.id,
        name,
        email,
        role: userRole,
        is_verified: false
      });

      if (profileError) {
        // Rollback: delete auth user
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json({
          error: 'Failed to create user profile. Please try again.'
        }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
