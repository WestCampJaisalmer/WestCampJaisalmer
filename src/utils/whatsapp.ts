export const WHATSAPP_NUMBER = "917877221729";

/**
 * Builds the direct WhatsApp chat URL with encoded text
 */
export function getWhatsAppUrl(message: string, phone: string = WHATSAPP_NUMBER): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Opens WhatsApp in a new browser tab/app
 */
export function openWhatsApp(message: string, phone: string = WHATSAPP_NUMBER): void {
  const url = getWhatsAppUrl(message, phone);
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}
