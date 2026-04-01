import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient, SupabaseClient } from '@supabase/supabase-js';
import { sendInquiryEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  return createAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// GET /api/inquiries - List inquiries for the authenticated seller
export async function GET() {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('inquiries')
    .select(`
      *,
      listing:listings(id, title)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/inquiries - Create a new inquiry and send email notification
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const supabaseAdmin = getSupabaseAdmin();

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.seller_id || !body.message || !body.sender_email || !body.sender_name) {
      return NextResponse.json(
        { error: 'Missing required fields: seller_id, message, sender_email, sender_name' },
        { status: 400 }
      );
    }

    // Get current user (optional - inquiries can be anonymous)
    const { data: { user } } = await supabase.auth.getUser();

    // Create the inquiry in the database using admin client (bypasses RLS for anonymous users)
    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        sender_id: user?.id || null,
        seller_id: body.seller_id,
        listing_id: body.listing_id || null,
        message: body.message,
        sender_email: body.sender_email,
        sender_name: body.sender_name,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get seller's email and name for notification
    const { data: sellerProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, name')
      .eq('id', body.seller_id)
      .single();

    // Get listing title if listing_id provided
    let listingTitle: string | undefined;
    if (body.listing_id) {
      const { data: listing } = await supabaseAdmin
        .from('listings')
        .select('title')
        .eq('id', body.listing_id)
        .single();
      listingTitle = listing?.title;
    }

    // Send email notification to seller
    if (sellerProfile?.email) {
      const emailResult = await sendInquiryEmail({
        sellerEmail: sellerProfile.email,
        sellerName: sellerProfile.name || 'Seller',
        senderName: body.sender_name,
        senderEmail: body.sender_email,
        listingTitle,
        message: body.message,
      });

      if (!emailResult.success) {
        console.error('Failed to send inquiry email:', emailResult.error);
        // Don't fail the request if email fails - inquiry is still saved
      }
    }

    return NextResponse.json({
      ...inquiry,
      emailSent: !!sellerProfile?.email,
    }, { status: 201 });
  } catch (err) {
    console.error('Inquiry creation error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PATCH /api/inquiries - Mark inquiry as read
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Missing inquiry id' }, { status: 400 });
    }

    // Check ownership
    const { data: inquiry } = await supabase
      .from('inquiries')
      .select('seller_id')
      .eq('id', body.id)
      .single();

    if (!inquiry || inquiry.seller_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update({ is_read: body.is_read ?? true })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
