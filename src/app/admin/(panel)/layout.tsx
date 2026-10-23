import { requireUser } from "@/lib/auth/dal";
import { queryOne } from "@/lib/db";
import { RESOURCES } from "@/lib/resources";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

const NAV_ORDER = ["hotels", "camps", "tours", "destinations", "packages", "testimonials", "gallery-images", "gallery-categories"];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("viewer");
  const [row, reviews] = await Promise.all([
    queryOne<{ n: number }>(`select count(*)::int as n from enquiries where status = 'new'`),
    queryOne<{ n: number }>(`select count(*)::int as n from testimonials where status = 'pending'`),
  ]);

  const content = NAV_ORDER.map((k) => ({
    key: k,
    label: RESOURCES[k].plural,
    icon: RESOURCES[k].icon,
    badge: k === "testimonials" ? reviews?.n ?? 0 : undefined,
  }));

  return (
    <>
      <Sidebar user={{ name: user.name, email: user.email, role: user.role }} content={content} newEnquiries={row?.n ?? 0} />
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </>
  );
}
