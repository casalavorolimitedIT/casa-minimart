import { redirect } from "next/navigation";
import { createPmsServerClient } from "@/lib/supabase/pms-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createPmsServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/home");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
      <header
        className="border-b px-5 py-3 flex items-center justify-between sticky top-0 z-10"
        style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: "#C8720A" }}
          >
            C
          </span>
          <div>
            <p
              className="text-sm font-bold text-[#2C1A0E] leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Casalavoro
            </p>
            <p className="text-[10px] text-[#A89070] leading-none mt-0.5">
              Admin
            </p>
          </div>
        </div>
        <p className="text-xs text-[#A89070] hidden sm:block truncate max-w-xs">
          {user.email}
        </p>
      </header>
      {children}
    </div>
  );
}
