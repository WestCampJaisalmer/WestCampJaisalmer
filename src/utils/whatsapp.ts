export const WHATSAPP_NUMBER = "917877221729";

// Overridden at runtime from the admin "Site settings" (see ContentProvider).
let activeNumber = WHATSAPP_NUMBER;

export function setWhatsAppNumber(number: string) {
  const digits = (number || "").replace(/[^0-9]/g, "");
  if (digits) activeNumber = digits;
}

export function getWhatsAppNumber(): string {
  return activeNumber;
}

/**
 * Builds the direct WhatsApp chat URL with encoded text
 */
export function getWhatsAppUrl(message: string, phone: string = activeNumber): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Opens WhatsApp in a new browser tab/app
 */
export function openWhatsApp(message: string, phone: string = activeNumber): void {
  const url = getWhatsAppUrl(message, phone);
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}
