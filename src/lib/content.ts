import "server-only";
import { unstable_cache } from "next/cache";
import { query, queryOne } from "@/lib/db";
import { RESOURCES, rowToItem } from "@/lib/resources";
import { mergeSettings, type SiteSettings } from "@/lib/settings-defaults";
import { mergeHome, type HomeContent } from "@/lib/home-defaults";
import {
  hotelsData,
  campsData,
  toursData,
  destinationsData,
  testimonialsData,
  packagesData,
  type Hotel,
  type Camp,
  type Tour,
  type Destination,
  type Testimonial,
  type TravelPackage,
} from "@/data/jaisalmerData";
import { galleryImages as staticGallery, galleryCategories as staticCategories, type GalleryImage } from "@/data/galleryData";

export const CONTENT_TAG = "site-content";

export interface GalleryCategory {
  id: string;
  label: string;
}

export interface SiteContent {
  hotels: Hotel[];
  camps: Camp[];
  tours: Tour[];
  destinations: Destination[];
  testimonials: Testimonial[];
  packages: TravelPackage[];
  galleryImages: GalleryImage[];
  galleryCategories: GalleryCategory[];
  settings: SiteSettings;
  home: HomeContent;
}

const ORDER = "order by sort_order asc, created_at asc";

async function list(key: string) {
  const def = RESOURCES[key];
  // Guest reviews are only public once an admin has approved them.
  const approvedOnly = key === "testimonials" ? "and status = 'approved'" : "";
  const rows = await query(`select * from ${def.table} where active = true ${approvedOnly} ${ORDER}`);
  return rows.map((r) => rowToItem(def, r));
}

export async function getSettings(): Promise<SiteSettings> {
  const row = await queryOne<{ value: Partial<SiteSettings> }>(`select value from settings where key = 'site'`);
  return mergeSettings(row?.value);
}

export async function getHome(): Promise<HomeContent> {
  const row = await queryOne<{ value: Partial<HomeContent> }>(`select value from settings where key = 'home'`);
  return mergeHome(row?.value);
}

async function loadContent(): Promise<SiteContent> {
  const [hotels, camps, tours, destinations, testimonials, packages, gallery, cats, settings, home] = await Promise.all([
    list("hotels"),
    list("camps"),
    list("tours"),
    list("destinations"),
    list("testimonials"),
    list("packages"),
    list("gallery-images"),
    query(`select id, label from gallery_categories where active = true ${ORDER}`),
    getSettings(),
    getHome(),
  ]);

  const labelOf = new Map(cats.map((c: any) => [c.id, c.label as string]));
  const galleryImages = gallery.map((g) => ({
    id: g.id,
    src: g.src,
    title: g.title,
    category: g.category,
    categoryLabel: labelOf.get(g.category) ?? g.category,
    location: g.location ?? "",
    aspect: g.aspect,
  })) as unknown as GalleryImage[];

  return {
    hotels: hotels as unknown as Hotel[],
    camps: camps as unknown as Camp[],
    tours: tours as unknown as Tour[],
    destinations: destinations as unknown as Destination[],
    testimonials: testimonials as unknown as Testimonial[],
    packages: packages as unknown as TravelPackage[],
    galleryImages,
    galleryCategories: [{ id: "all", label: "All Photos" }, ...cats.map((c: any) => ({ id: c.id, label: c.label }))],
    settings,
    home,
  };
}

const cachedContent = unstable_cache(loadContent, ["site-content-v2"], {
  tags: [CONTENT_TAG],
  revalidate: 300,
});

/** The original static data - used if the database is unreachable so the site never goes blank. */
export function fallbackContent(): SiteContent {
  return {
    hotels: hotelsData,
    camps: campsData,
    tours: toursData,
    destinations: destinationsData,
    testimonials: testimonialsData,
    packages: packagesData,
    galleryImages: staticGallery,
    galleryCategories: staticCategories.map((c) => ({ id: c.id, label: c.label })),
    settings: mergeSettings(null),
    home: mergeHome(null),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await cachedContent();
  } catch (err) {
    console.error("[content] database unavailable, serving static fallback:", (err as Error).message);
    return fallbackContent();
  }
}
