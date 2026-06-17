import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supabaseConfig } from "./config";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  await supabase.auth.getSession();

  // Also refresh PMS session for dashboard auth
  const pmsClient = createServerClient(
    process.env.NEXT_PUBLIC_PMS_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_PMS_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  await pmsClient.auth.getSession();

  return response;
}
