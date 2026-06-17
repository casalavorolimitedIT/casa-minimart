import { createClient } from "@supabase/supabase-js";

// Server-only. Uses service_role key — bypasses RLS.
export function createPmsAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_PMS_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
