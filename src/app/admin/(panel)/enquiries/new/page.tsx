import { requireUser } from "@/lib/auth/dal";
import { PageHeader } from "@/components/admin/ui";
import ManualEnquiryForm from "./ManualEnquiryForm";

export const metadata = { title: "Log enquiry" };

export default async function NewEnquiryPage() {
  await requireUser("editor");
  return (
    <>
      <PageHeader
        back={{ href: "/admin/enquiries", label: "All enquiries" }}
        title="Log an enquiry"
        description="Record a phone call, walk-in or WhatsApp lead so everything is tracked in one place."
      />
      <ManualEnquiryForm />
    </>
  );
}
