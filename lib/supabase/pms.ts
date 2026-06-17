import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_PMS_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_PMS_SUPABASE_ANON_KEY!;

let _instance: SupabaseClient | null = null;

// Returns a singleton on the client, fresh instance on the server.
export function getPmsClient(): SupabaseClient {
  if (typeof window === "undefined") {
    return createClient(url, anonKey);
  }
  if (!_instance) _instance = createClient(url, anonKey);
  return _instance;
}
