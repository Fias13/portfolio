import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "portfolio-media";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY as string, {
      auth: { persistSession: false },
    })
  : null;

if (isSupabaseConfigured) {
  console.log(`Media uploads: using Supabase Storage bucket "${BUCKET}"`);
} else {
  console.log("Media uploads: using local disk (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to use Supabase Storage instead)");
}

let bucketReady: Promise<void> | null = null;

async function ensureBucket(): Promise<void> {
  if (!supabase) return;
  const { data, error } = await supabase.storage.getBucket(BUCKET);
  if (!data || error) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (createError && !/already exists/i.test(createError.message)) {
      console.warn(`Could not create Supabase Storage bucket "${BUCKET}": ${createError.message}`);
    }
  }
}

function ensureBucketOnce(): Promise<void> {
  if (!bucketReady) bucketReady = ensureBucket();
  return bucketReady;
}

export async function uploadToSupabase(buffer: Buffer, storagePath: string, contentType: string): Promise<string> {
  if (!supabase) throw new Error("Supabase storage is not configured");
  await ensureBucketOnce();

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, { contentType, upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function deleteFromSupabase(storagePath: string): Promise<void> {
  if (!supabase) return;
  await supabase.storage.from(BUCKET).remove([storagePath]);
}

export function extractSupabaseStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
