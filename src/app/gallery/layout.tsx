import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/gallery",
  "Jaisalmer Photo Gallery - Desert Camps, Fort & Dunes",
  "Browse photos of Thar desert camps, Jaisalmer Fort, Sam Sand Dunes, camel safaris, folk evenings and heritage stays from West Camp Jaisalmer."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
