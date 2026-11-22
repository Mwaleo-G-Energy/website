const configuredNumber = process.env.NEXT_PUBLIC_MWALEO_WHATSAPP_NUMBER?.trim() ?? "";

export const WHATSAPP_NUMBER = /^[1-9]\d{7,14}$/.test(configuredNumber) ? configuredNumber : undefined;
export const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : undefined;
export const SHOP_LOCALITY = "Nairobi CBD";
