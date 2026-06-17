import { redirect } from "next/navigation";
import { createPmsServerClient } from "@/lib/supabase/pms-server";

export async function requireAdmin() {
  const supabase = await createPmsServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/home");
  return user;
}
