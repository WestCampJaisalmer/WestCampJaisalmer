import { requireUser } from "@/lib/auth/dal";
import { getSettings } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireUser("admin");
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Site settings" description="Contact details, SEO, announcement banner, social links and currency rates." />
      <SettingsForm settings={settings} />
    </>
  );
}
