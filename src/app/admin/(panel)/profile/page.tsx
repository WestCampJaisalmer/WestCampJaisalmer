import { requireUser } from "@/lib/auth/dal";
import { PageHeader } from "@/components/admin/ui";
import ProfileForms from "./ProfileForms";

export const metadata = { title: "My profile" };

export default async function ProfilePage() {
  const user = await requireUser("viewer");
  return (
    <>
      <PageHeader title="My profile" description="Update your details and password." />
      <ProfileForms name={user.name} email={user.email} role={user.role} />
    </>
  );
}
