export const ENQUIRY_STATUSES = [
  { value: "new", label: "New", hint: "Not yet handled" },
  { value: "contacted", label: "Contacted", hint: "Guest has been reached" },
  { value: "quoted", label: "Quoted", hint: "Price / plan sent" },
  { value: "confirmed", label: "Confirmed", hint: "Booking confirmed" },
  { value: "completed", label: "Completed", hint: "Stay / tour done" },
  { value: "cancelled", label: "Cancelled", hint: "Guest cancelled or lost" },
  { value: "spam", label: "Spam", hint: "Junk / test enquiry" },
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]["value"];

export const ENQUIRY_TYPES = [
  { value: "booking", label: "Booking request" },
  { value: "plan_trip", label: "Custom trip plan" },
  { value: "contact", label: "Contact form" },
  { value: "gallery", label: "Gallery photo" },
  { value: "other", label: "Other" },
] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number]["value"];

export const statusLabel = (v: string) => ENQUIRY_STATUSES.find((s) => s.value === v)?.label ?? v;
export const typeLabel = (v: string) => ENQUIRY_TYPES.find((s) => s.value === v)?.label ?? v;
