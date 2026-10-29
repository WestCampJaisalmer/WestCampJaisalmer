import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "/about",
  "About Us - Our Story in the Golden City of Jaisalmer",
  "Meet West Camp Jaisalmer - a local team creating authentic desert camp stays, heritage hotel bookings and unforgettable Thar experiences in Rajasthan."
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
