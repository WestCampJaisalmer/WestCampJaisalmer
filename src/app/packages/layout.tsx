import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/packages",
  "Jaisalmer Holiday Packages - Desert Camp & Heritage Trips",
  "Handpicked Jaisalmer tour packages with desert camp stays, camel safari, sightseeing and meals. Flexible itineraries and best prices on direct booking."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
