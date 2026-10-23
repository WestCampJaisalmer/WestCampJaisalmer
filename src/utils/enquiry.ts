export interface EnquiryPayload {
  type: "booking" | "plan_trip" | "contact" | "gallery" | "other";
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  details?: Record<string, unknown>;
  itemType?: string;
  itemId?: string;
  itemName?: string;
}

/**
 * Records the enquiry in the admin dashboard. Fire-and-forget: it must never block or break the
 * WhatsApp hand-off, so failures are swallowed. `keepalive` lets it finish even if the tab
 * navigates away to WhatsApp.
 */
export function recordEnquiry(payload: EnquiryPayload): void {
  if (typeof window === "undefined") return;
  try {
    void fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, sourcePage: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
