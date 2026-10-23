import { requireUser } from "@/lib/auth/dal";
import { query } from "@/lib/db";
import { Flash, PageHeader, formatDateTime } from "@/components/admin/ui";
import UserManager, { type UserRow } from "./UserManager";

export const metadata = { title: "Users & roles" };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const me = await requireUser("admin");
  const { created } = await searchParams;
  const users = await query<{ id: string; name: string; email: string; role: UserRow["role"]; active: boolean; last_login_at: Date | null; created_at: Date }>(
    `select id,name,email,role,active,last_login_at,created_at from admin_users order by created_at asc`
  );

  return (
    <>
      <PageHeader title="Users & roles" description="Control who can sign in to this dashboard and what they can do." />
      {created && <Flash>User created. Share the password with them securely.</Flash>}
      <UserManager
        meId={me.id}
        users={users.map((u) => ({
          id: u.id, name: u.name, email: u.email, role: u.role, active: u.active,
          lastLogin: u.last_login_at ? formatDateTime(u.last_login_at) : "Never",
        }))}
      />
    </>
  );
}
