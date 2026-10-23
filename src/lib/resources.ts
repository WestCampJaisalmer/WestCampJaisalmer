/**
 * Config-driven definition of every editable content type. The admin list/edit screens,
 * validation, DB writes and public mapping are all generated from this one file.
 * Pure module (no server imports) so client form components can read it too.
 */
import { IMAGE_URL_ERROR, isAllowedImageUrl } from "@/lib/image-url";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "tags"
  | "select"
  | "itinerary";

export interface FieldDef {
  /** camelCase key used in forms and in the public data shape */
  name: string;
  /** snake_case DB column */
  column: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  /** render half-width on desktop */
  half?: boolean;
  /** nullable column - empty value stores NULL */
  nullable?: boolean;
  default?: string | number;
}

export interface ResourceDef {
  key: string;
  table: string;
  singular: string;
  plural: string;
  description: string;
  /** lucide icon name, resolved in the admin UI */
  icon: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: FieldDef[];
  /** field names shown as extra table columns */
  listColumns: string[];
  searchColumns: string[];
  hasFeatured: boolean;
  /** public pages that show this content (for "View on site" links) */
  publicPath?: string;
}

const ratingFields: FieldDef[] = [
  { name: "rating", column: "rating", label: "Rating", type: "number", min: 1, max: 5, step: 0.1, default: 4.5, half: true },
  { name: "reviews", column: "reviews", label: "Review count", type: "number", min: 0, integer: true, default: 0, half: true },
];

const stayFields: FieldDef[] = [
  { name: "name", column: "name", label: "Name", type: "text", required: true, placeholder: "Hotel Heritage Haveli" },
  { name: "location", column: "location", label: "Location", type: "text", required: true, placeholder: "Near Jaisalmer Fort", half: true },
  { name: "price", column: "price", label: "Price per night (₹)", type: "number", required: true, min: 0, integer: true, half: true },
  ...ratingFields,
  { name: "tag", column: "tag", label: "Badge / tag", type: "text", nullable: true, placeholder: "Best Seller", help: "Optional label shown on the card.", half: true },
  { name: "image", column: "image", label: "Cover image", type: "image", required: true },
  { name: "amenities", column: "amenities", label: "Amenities", type: "tags", help: "Type an amenity and press Enter." },
  { name: "description", column: "description", label: "Description", type: "textarea", required: true },
];

export const RESOURCES: Record<string, ResourceDef> = {
  hotels: {
    key: "hotels",
    table: "hotels",
    singular: "Hotel",
    plural: "Hotels",
    description: "Heritage havelis and palace stays.",
    icon: "Building2",
    titleField: "name",
    subtitleField: "location",
    imageField: "image",
    fields: stayFields,
    listColumns: ["price", "rating"],
    searchColumns: ["name", "location", "description"],
    hasFeatured: true,
    publicPath: "/camps-hotels?type=hotel",
  },
  camps: {
    key: "camps",
    table: "camps",
    singular: "Camp",
    plural: "Camps",
    description: "Swiss tents and luxury desert camps.",
    icon: "Tent",
    titleField: "name",
    subtitleField: "location",
    imageField: "image",
    fields: stayFields,
    listColumns: ["price", "rating"],
    searchColumns: ["name", "location", "description"],
    hasFeatured: true,
    publicPath: "/camps-hotels?type=camp",
  },
  tours: {
    key: "tours",
    table: "tours",
    singular: "Tour",
    plural: "Tours & Activities",
    description: "Safaris, cultural evenings and guided experiences.",
    icon: "Compass",
    titleField: "title",
    subtitleField: "location",
    imageField: "image",
    fields: [
      { name: "title", column: "title", label: "Title", type: "text", required: true, placeholder: "Camel Safari" },
      { name: "location", column: "location", label: "Location", type: "text", required: true, half: true },
      { name: "duration", column: "duration", label: "Duration", type: "text", required: true, placeholder: "2-3 Hours", half: true },
      { name: "price", column: "price", label: "Price (₹)", type: "number", required: true, min: 0, integer: true, half: true },
      { name: "unit", column: "unit", label: "Price unit", type: "text", default: "person", help: "e.g. person, jeep, couple", half: true },
      ...ratingFields,
      { name: "tag", column: "tag", label: "Badge / tag", type: "text", nullable: true, half: true },
      { name: "image", column: "image", label: "Cover image", type: "image", required: true },
      { name: "description", column: "description", label: "Description", type: "textarea", required: true },
    ],
    listColumns: ["price", "duration"],
    searchColumns: ["title", "location", "description"],
    hasFeatured: true,
    publicPath: "/tours-places",
  },
  destinations: {
    key: "destinations",
    table: "destinations",
    singular: "Destination",
    plural: "Destinations",
    description: "Places to visit around Jaisalmer.",
    icon: "MapPin",
    titleField: "name",
    subtitleField: "subtitle",
    imageField: "image",
    fields: [
      { name: "name", column: "name", label: "Name", type: "text", required: true, placeholder: "Sam Sand Dunes" },
      { name: "subtitle", column: "subtitle", label: "Subtitle", type: "text", placeholder: "Desert Adventure", half: true },
      { name: "distance", column: "distance", label: "Distance", type: "text", placeholder: "40 km from city", half: true },
      { name: "image", column: "image", label: "Cover image", type: "image", required: true },
      { name: "description", column: "description", label: "Description", type: "textarea", required: true },
    ],
    listColumns: ["distance"],
    searchColumns: ["name", "subtitle", "description"],
    hasFeatured: true,
    publicPath: "/tours-places",
  },
  packages: {
    key: "packages",
    table: "packages",
    singular: "Package",
    plural: "Holiday Packages",
    description: "Multi-day tour packages with itineraries.",
    icon: "Package",
    titleField: "name",
    subtitleField: "duration",
    imageField: "image",
    fields: [
      { name: "name", column: "name", label: "Package name", type: "text", required: true },
      { name: "duration", column: "duration", label: "Duration", type: "text", required: true, placeholder: "3 Days / 2 Nights", half: true },
      {
        name: "category", column: "category", label: "Category", type: "select", required: true, half: true, default: "desert",
        options: [
          { value: "desert", label: "Desert" },
          { value: "family", label: "Family" },
          { value: "honeymoon", label: "Honeymoon" },
          { value: "heritage", label: "Heritage" },
        ],
      },
      { name: "price", column: "price", label: "Price (₹)", type: "number", required: true, min: 0, integer: true, half: true },
      { name: "originalPrice", column: "original_price", label: "Original price (₹)", type: "number", min: 0, integer: true, nullable: true, help: "Shown struck-through to display a discount.", half: true },
      ...ratingFields,
      { name: "tag", column: "tag", label: "Badge / tag", type: "text", nullable: true, half: true },
      { name: "location", column: "location", label: "Location", type: "text", required: true, half: true },
      { name: "image", column: "image", label: "Cover image", type: "image", required: true },
      { name: "description", column: "description", label: "Summary", type: "textarea", required: true },
      { name: "inclusions", column: "inclusions", label: "Inclusions", type: "tags", help: "Type an inclusion and press Enter." },
      { name: "itinerary", column: "itinerary", label: "Day-wise itinerary", type: "itinerary" },
    ],
    listColumns: ["price", "category"],
    searchColumns: ["name", "location", "description"],
    hasFeatured: true,
    publicPath: "/packages",
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    singular: "Testimonial",
    plural: "Testimonials",
    description: "Guest reviews shown on the home page.",
    icon: "Quote",
    titleField: "name",
    subtitleField: "city",
    imageField: "avatar",
    fields: [
      { name: "name", column: "name", label: "Guest name", type: "text", required: true, half: true },
      { name: "city", column: "city", label: "City / country", type: "text", placeholder: "Delhi, India", half: true },
      { name: "rating", column: "rating", label: "Rating (1-5)", type: "number", required: true, min: 1, max: 5, integer: true, default: 5, half: true },
      { name: "avatar", column: "avatar", label: "Avatar", type: "image", help: "Optional. A placeholder initial is used when empty." },
      { name: "review", column: "review", label: "Review", type: "textarea", required: true },
    ],
    listColumns: ["rating"],
    searchColumns: ["name", "city", "review"],
    hasFeatured: false,
    publicPath: "/",
  },
  "gallery-images": {
    key: "gallery-images",
    table: "gallery_images",
    singular: "Gallery photo",
    plural: "Gallery",
    description: "Photos shown on the gallery page.",
    icon: "Images",
    titleField: "title",
    subtitleField: "location",
    imageField: "src",
    fields: [
      { name: "title", column: "title", label: "Title", type: "text", required: true },
      { name: "location", column: "location", label: "Location", type: "text", half: true },
      { name: "category", column: "category", label: "Category", type: "select", required: true, half: true, options: [] /* filled at runtime from gallery_categories */ },
      {
        name: "aspect", column: "aspect", label: "Shape", type: "select", required: true, default: "landscape", half: true,
        options: [
          { value: "landscape", label: "Landscape" },
          { value: "portrait", label: "Portrait" },
          { value: "square", label: "Square" },
        ],
      },
      { name: "src", column: "src", label: "Photo", type: "image", required: true },
    ],
    listColumns: ["category"],
    searchColumns: ["title", "location", "category"],
    hasFeatured: false,
    publicPath: "/gallery",
  },
  "gallery-categories": {
    key: "gallery-categories",
    table: "gallery_categories",
    singular: "Gallery category",
    plural: "Gallery Categories",
    description: "Filter tabs on the gallery page.",
    icon: "Tags",
    titleField: "label",
    fields: [
      { name: "label", column: "label", label: "Label", type: "text", required: true, placeholder: "Desert Camps & Tents" },
    ],
    listColumns: [],
    searchColumns: ["label", "id"],
    hasFeatured: false,
    publicPath: "/gallery",
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES);

export function getResource(key: string): ResourceDef | null {
  return Object.prototype.hasOwnProperty.call(RESOURCES, key) ? RESOURCES[key] : null;
}

export interface ItineraryDay {
  day: string;
  title: string;
  desc: string;
}

// ───────────────────────── parsing / validation (shared) ─────────────────────────

export interface ParsedForm {
  values: Record<string, unknown>; // keyed by DB column
  errors: Record<string, string>; // keyed by field name
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export function parseResourceForm(def: ResourceDef, fd: FormData, extraOptions?: Record<string, string[]>): ParsedForm {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const f of def.fields) {
    const raw = str(fd.get(f.name));

    if (f.type === "tags") {
      let list: string[] = [];
      try {
        const parsed = JSON.parse(raw || "[]");
        if (Array.isArray(parsed)) list = parsed.map((x) => String(x).trim()).filter(Boolean).slice(0, 50);
      } catch {
        errors[f.name] = "Invalid list.";
      }
      values[f.column] = JSON.stringify(list);
      continue;
    }

    if (f.type === "itinerary") {
      let days: ItineraryDay[] = [];
      try {
        const parsed = JSON.parse(raw || "[]");
        if (Array.isArray(parsed)) {
          days = parsed
            .map((d) => ({
              day: String(d?.day ?? "").trim(),
              title: String(d?.title ?? "").trim(),
              desc: String(d?.desc ?? "").trim(),
            }))
            .filter((d) => d.day || d.title || d.desc)
            .slice(0, 30);
        }
      } catch {
        errors[f.name] = "Invalid itinerary.";
      }
      values[f.column] = JSON.stringify(days);
      continue;
    }

    if (f.type === "number") {
      if (raw === "") {
        if (f.required) errors[f.name] = `${f.label} is required.`;
        values[f.column] = f.nullable ? null : f.default ?? 0;
        continue;
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        errors[f.name] = `${f.label} must be a number.`;
      } else if (f.min !== undefined && n < f.min) {
        errors[f.name] = `${f.label} must be at least ${f.min}.`;
      } else if (f.max !== undefined && n > f.max) {
        errors[f.name] = `${f.label} must be at most ${f.max}.`;
      }
      values[f.column] = f.integer ? Math.round(n) : Math.round(n * 10) / 10;
      continue;
    }

    if (f.type === "select") {
      const allowed = (f.options?.length ? f.options.map((o) => o.value) : extraOptions?.[f.name]) ?? [];
      if (!raw) {
        if (f.required) errors[f.name] = `${f.label} is required.`;
        values[f.column] = f.default ?? "";
      } else if (allowed.length && !allowed.includes(raw)) {
        errors[f.name] = `Choose a valid ${f.label.toLowerCase()}.`;
      } else {
        values[f.column] = raw;
      }
      continue;
    }

    // text / textarea / image
    if (f.required && !raw) errors[f.name] = `${f.label} is required.`;
    if (raw.length > (f.type === "textarea" ? 5000 : 500)) errors[f.name] = `${f.label} is too long.`;
    if (f.type === "image" && raw && !isAllowedImageUrl(raw)) {
      errors[f.name] = IMAGE_URL_ERROR;
    }
    values[f.column] = raw === "" && f.nullable ? null : raw || (f.default ?? "");
  }

  return { values, errors };
}

/** DB row -> camelCase item (the shape the public components already use). */
export function rowToItem(def: ResourceDef, row: Record<string, any>): Record<string, any> {
  const item: Record<string, any> = {
    id: row.id,
    active: row.active,
    featured: row.featured,
    sortOrder: row.sort_order,
  };
  for (const f of def.fields) {
    let v = row[f.column];
    if (f.type === "number" && v !== null && v !== undefined) v = Number(v);
    if (v === null) v = undefined;
    item[f.name] = v;
  }
  return item;
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}
