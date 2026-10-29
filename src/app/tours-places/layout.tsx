import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/tours-places",
  "Jaisalmer Tours, Camel Safari & Places to Visit",
  "Explore Jaisalmer Fort, Sam Sand Dunes, Kuldhara and Gadisar Lake. Book camel safaris, jeep safaris, cultural evenings and guided desert tours."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
