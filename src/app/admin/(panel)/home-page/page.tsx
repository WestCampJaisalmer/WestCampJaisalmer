import { ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { getHome } from "@/lib/content";
import { Flash, PageHeader } from "@/components/admin/ui";
import HomeForm from "./HomeForm";

export const metadata = { title: "Home page" };

export default async function HomePageEditor({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  await requireUser("editor");
  const { reset } = await searchParams;
  const home = await getHome();

  return (
    <>
      <PageHeader
        title="Home page"
        description="Change the banner, photos and headlines on your home page."
        actions={
          <div className="flex w-full sm:w-auto">
            <a href="/" target="_blank" rel="noreferrer" className="adm-btn-ghost w-full sm:w-auto justify-center"><ExternalLink size={15} /> View home page</a>
          </div>
        }
      />
      {reset && <Flash>The home page is back to its original design.</Flash>}
      <HomeForm home={home} />
    </>
  );
}
