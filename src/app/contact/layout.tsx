import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/contact",
  "Contact & Book - Camps, Hotels and Tours in Jaisalmer",
  "Call, WhatsApp or email West Camp Jaisalmer to plan your trip. Support available 8:00 AM - 10:00 PM every day, with replies within 24 hours."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
