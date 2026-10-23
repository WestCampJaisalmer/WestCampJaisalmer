/** Pure module (no server imports) so client components can use the type + defaults. */
export interface SiteSettings {
  siteName: string;
  tagline: string;
  whatsappNumber: string; // digits only, with country code
  phone: string; // display, e.g. +91 78772 21729
  email: string;
  address: string;
  mapEmbedUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  /** INR per 1 unit of the foreign currency, e.g. USD: 86 */
  rateUSD: number;
  rateEUR: number;
  rateGBP: number;
  rateAED: number;
  enquiriesEnabled: boolean;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "West Camp Jaisalmer",
  tagline: "A Land of Golden Stories",
  whatsappNumber: "917877221729",
  phone: "+91 78772 21729",
  email: "bk3661758@gmail.com",
  address: "Jaisalmer, Rajasthan, India",
  mapEmbedUrl: "",
  seoTitle: "Jaisalmer - Travel & Experiences | A Land of Golden Stories",
  seoDescription:
    "Heritage stays, luxury desert camps, thrilling tours and unforgettable experiences in the heart of Rajasthan.",
  seoKeywords:
    "Jaisalmer tourism, Thar desert camp, Jaisalmer hotels, camel safari, Sam sand dunes, Rajasthan travel",
  announcementEnabled: false,
  announcementText: "",
  announcementLink: "",
  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",
  rateUSD: 86,
  rateEUR: 93,
  rateGBP: 110,
  rateAED: 23.4,
  enquiriesEnabled: true,
};

export function mergeSettings(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  return { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
}
