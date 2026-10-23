/**
 * Editable home-page content (images + headline text). Pure module: used by the public
 * components, the loader and the admin form. Empty values always fall back to the defaults,
 * so "reset" is just clearing a field.
 */
export interface HomeContent {
  // ── images
  logo: string;
  heroImage: string;
  storyBackground: string;
  storyMainImage: string;
  storyTopImage: string;
  storyBottomImage: string;
  experienceBackground: string;
  experienceHotelsImage: string;
  experienceCampsImage: string;
  experienceToursImage: string;
  tharBackground: string;
  tharImage: string;
  ctaBackground: string;
  videoImage: string;
  // ── hero
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBadge: string;
  // ── story
  storyEyebrow: string;
  storyHeading: string;
  storyDescription: string;
  storyButton: string;
  storyMainCaption: string;
  storyTopCaption: string;
  storyBottomCaption: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  // ── experiences
  experienceEyebrow: string;
  experienceHeading: string;
  experienceDescription: string;
  // ── thar magic
  tharEyebrow: string;
  tharHeading: string;
  tharHeadingAccent: string;
  tharDescription: string;
  // ── call to action
  ctaHeading: string;
  ctaText: string;
}

export const DEFAULT_HOME: HomeContent = {
  logo: "/images/Jaisalmer_logo.png",
  heroImage: "/images/banners/hero-fort.jpg",
  storyBackground: "/images/banners/Dreamy_Desert_Fort_at_Sunrise.png",
  storyMainImage: "/images/activities/desert-dining.jpg",
  storyTopImage: "/images/camps/royal-camp.jpg",
  storyBottomImage: "/images/activities/camel-safari.jpg",
  experienceBackground: "/images/banners/Foliage_Banner.png",
  experienceHotelsImage: "/images/hotels/golden-palace.jpg",
  experienceCampsImage: "/images/camps/royal-camp.jpg",
  experienceToursImage: "/images/activities/jeep-safari.jpg",
  tharBackground: "/images/banners/Sunrise_Banner.png",
  tharImage: "/images/activities/thar-magic.jpg",
  ctaBackground: "/images/banners/Beneath_Fort.png",
  videoImage: "/images/activities/desert-dining.jpg",

  heroEyebrow: "DISCOVER • EXPLORE • EXPERIENCE",
  heroTitle: "Jaisalmer",
  heroSubtitle: "— A Land of Golden Stories",
  heroDescription: "Heritage stays, luxury desert camps, thrilling tours and unforgettable experiences in the heart of Rajasthan.",
  heroBadge: "More\nthan a\nDestination",

  storyEyebrow: "EXPERIENCE JAISALMER",
  storyHeading: "Royal Heritage\nDesert Adventures\nTimeless Memories",
  storyDescription: "From majestic forts to golden dunes, Jaisalmer offers a perfect blend of history, culture and adventure.",
  storyButton: "Explore Jaisalmer",
  storyMainCaption: "Desert Dining\nUnder the Stars",
  storyTopCaption: "Luxury Camps",
  storyBottomCaption: "Camel Safari",
  stat1Value: "800+",
  stat1Label: "Happy Travelers",
  stat2Value: "50+",
  stat2Label: "Experiences",
  stat3Value: "4.8",
  stat3Label: "Average Rating",

  experienceEyebrow: "CURATED JAISALMER",
  experienceHeading: "Choose Your\nPerfect Experience",
  experienceDescription: "Heritage havelis, luxury desert camps, thrilling safaris and authentic folk cultural experiences crafted for every traveler.",

  tharEyebrow: "DISCOVER THE REAL BEAUTY",
  tharHeading: "Feel the Magic",
  tharHeadingAccent: "of the Thar Desert",
  tharDescription: "Golden sands, starry skies and unforgettable moments await you in Jaisalmer. Let us create a memorable journey for your perfect desert getaway.",

  ctaHeading: "Plan Your Jaisalmer Getaway Today",
  ctaText: "Hotels, Camps, Tours and Unique Experiences — All in One Place.",
};

export function mergeHome(stored: Partial<HomeContent> | null | undefined): HomeContent {
  const out = { ...DEFAULT_HOME };
  for (const key of Object.keys(DEFAULT_HOME) as (keyof HomeContent)[]) {
    const v = stored?.[key];
    if (typeof v === "string" && v.trim() !== "") out[key] = v;
  }
  return out;
}

// ───────────────────────── admin form description ─────────────────────────

export interface HomeFieldDef {
  key: keyof HomeContent;
  label: string;
  type: "image" | "text" | "textarea";
  help?: string;
  half?: boolean;
}

export interface HomeSectionDef {
  id: string;
  title: string;
  description: string;
  fields: HomeFieldDef[];
}

const LINES = "Press Enter for a new line.";

export const HOME_SECTIONS: HomeSectionDef[] = [
  {
    id: "hero",
    title: "Hero banner",
    description: "The big photo and headline at the very top of the home page.",
    fields: [
      { key: "heroImage", label: "Banner image", type: "image", help: "Wide landscape photo, at least 1920 px wide. Text sits on top, so darker or calmer areas on the left read best." },
      { key: "heroEyebrow", label: "Small tag above the title", type: "text", half: true },
      { key: "heroTitle", label: "Main title", type: "text", half: true },
      { key: "heroSubtitle", label: "Subtitle", type: "text" },
      { key: "heroDescription", label: "Description", type: "textarea" },
      { key: "heroBadge", label: "Handwritten text on the right", type: "textarea", help: `Shown on large screens. ${LINES}` },
    ],
  },
  {
    id: "story",
    title: "Experience Jaisalmer",
    description: "The section with the headline, three numbers and the three overlapping photos.",
    fields: [
      { key: "storyBackground", label: "Background image", type: "image" },
      { key: "storyEyebrow", label: "Small label", type: "text", half: true },
      { key: "storyButton", label: "Button text", type: "text", half: true },
      { key: "storyHeading", label: "Heading", type: "textarea", help: LINES },
      { key: "storyDescription", label: "Description", type: "textarea" },
      { key: "storyMainImage", label: "Large photo (opens the video)", type: "image" },
      { key: "storyMainCaption", label: "Large photo caption", type: "textarea", help: LINES },
      { key: "storyTopImage", label: "Top-right photo", type: "image" },
      { key: "storyTopCaption", label: "Top-right caption", type: "text" },
      { key: "storyBottomImage", label: "Bottom-right photo", type: "image" },
      { key: "storyBottomCaption", label: "Bottom-right caption", type: "text" },
      { key: "stat1Value", label: "Number 1", type: "text", half: true },
      { key: "stat1Label", label: "Label 1", type: "text", half: true },
      { key: "stat2Value", label: "Number 2", type: "text", half: true },
      { key: "stat2Label", label: "Label 2", type: "text", half: true },
      { key: "stat3Value", label: "Number 3 (shown with a star)", type: "text", half: true },
      { key: "stat3Label", label: "Label 3", type: "text", half: true },
    ],
  },
  {
    id: "experience",
    title: "Choose your perfect experience",
    description: "The dark green band with the Hotels / Camps / Tours cards.",
    fields: [
      { key: "experienceBackground", label: "Background image", type: "image" },
      { key: "experienceEyebrow", label: "Small label", type: "text" },
      { key: "experienceHeading", label: "Heading", type: "textarea", help: LINES },
      { key: "experienceDescription", label: "Description", type: "textarea" },
      { key: "experienceHotelsImage", label: "Hotels card photo", type: "image" },
      { key: "experienceCampsImage", label: "Camps card photo", type: "image" },
      { key: "experienceToursImage", label: "Tours card photo", type: "image" },
    ],
  },
  {
    id: "thar",
    title: "Feel the magic of the Thar Desert",
    description: "The sunrise section with the traveller photo and the Plan Your Trip button.",
    fields: [
      { key: "tharBackground", label: "Background image", type: "image" },
      { key: "tharImage", label: "Side photo", type: "image" },
      { key: "tharEyebrow", label: "Small label", type: "text" },
      { key: "tharHeading", label: "Heading", type: "text", half: true },
      { key: "tharHeadingAccent", label: "Heading (second line, italic)", type: "text", half: true },
      { key: "tharDescription", label: "Description", type: "textarea" },
    ],
  },
  {
    id: "cta",
    title: "Call-to-action banner",
    description: "The night-time banner above the footer, and the video pop-up picture.",
    fields: [
      { key: "ctaBackground", label: "Background image", type: "image" },
      { key: "ctaHeading", label: "Heading", type: "text" },
      { key: "ctaText", label: "Text", type: "textarea" },
      { key: "videoImage", label: "Video pop-up picture", type: "image", help: "Shown when visitors click the play button." },
    ],
  },
  {
    id: "brand",
    title: "Logo",
    description: "Used in the top menu, the mobile menu and the footer.",
    fields: [{ key: "logo", label: "Logo image", type: "image", help: "A transparent PNG works best, roughly 3:2 in shape." }],
  },
];
