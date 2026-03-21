import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const results: { buckets: string[]; created: string[]; errors: string[] } = {
    buckets: [],
    created: [],
    errors: []
  };

  // List of buckets to ensure exist
  const requiredBuckets = [
    { name: 'listings', public: true },
    { name: 'avatars', public: true },
    { name: 'logos', public: true },
  ];

  // Get existing buckets
  const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    return NextResponse.json({ error: `Failed to list buckets: ${listError.message}` }, { status: 500 });
  }

  const existingNames = existingBuckets?.map(b => b.name) || [];
  results.buckets = existingNames;

  // Create missing buckets
  for (const bucket of requiredBuckets) {
    if (!existingNames.includes(bucket.name)) {
      const { error: createError } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });

      if (createError) {
        results.errors.push(`${bucket.name}: ${createError.message}`);
      } else {
        results.created.push(bucket.name);
      }
    }
  }

  // Verify listings bucket is public
  const { data: listingsBucket } = await supabase.storage.getBucket('listings');

  return NextResponse.json({
    success: results.errors.length === 0,
    existingBuckets: results.buckets,
    createdBuckets: results.created,
    errors: results.errors,
    listingsBucketPublic: listingsBucket?.public || false
  });
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // List existing buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    buckets: buckets?.map(b => ({ name: b.name, public: b.public })) || []
  });
}
