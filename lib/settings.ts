import prisma from "./prisma";

export interface AppSettings {
  appUrl: string;
  stripeSuccessUrl: string;
  stripeCancelUrl: string;
  stripeBillingReturnUrl: string;
}

let cachedSettings: AppSettings | null = null;
let lastFetch = 0;
const CACHE_TTL = 60000; // 1 minute

export async function getSettings(): Promise<AppSettings> {
  const now = Date.now();
  
  if (cachedSettings && now - lastFetch < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const dbSettings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    const appUrl = 
      dbSettings?.appUrl || 
      process.env.NEXT_PUBLIC_APP_URL || 
      "http://localhost:3000";

    const settings: AppSettings = {
      appUrl,
      stripeSuccessUrl:
        dbSettings?.stripeSuccessUrl ||
        process.env.STRIPE_SUCCESS_URL ||
        `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      stripeCancelUrl:
        dbSettings?.stripeCancelUrl ||
        process.env.STRIPE_CANCEL_URL ||
        `${appUrl}/checkout/cancel`,
      stripeBillingReturnUrl:
        dbSettings?.stripeBillingReturnUrl ||
        `${appUrl}/dashboard/billing`,
    };

    cachedSettings = settings;
    lastFetch = now;

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    
    const fallbackUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return {
      appUrl: fallbackUrl,
      stripeSuccessUrl: `${fallbackUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      stripeCancelUrl: `${fallbackUrl}/checkout/cancel`,
      stripeBillingReturnUrl: `${fallbackUrl}/dashboard/billing`,
    };
  }
}

export function clearSettingsCache(): void {
  cachedSettings = null;
  lastFetch = 0;
}
