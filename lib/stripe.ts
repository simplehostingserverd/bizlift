import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
      appInfo: {
        name: "BizLift",
        version: "1.0.0",
      },
    })
  : null;

export default stripe;

// Helper function to format amount for Stripe (convert dollars to cents)
export function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;

  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

// Helper function to format amount from Stripe (convert cents to dollars)
export function formatAmountFromStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;

  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }

  return zeroDecimalCurrency ? amount : amount / 100;
}
