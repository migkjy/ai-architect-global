export type PaymentProvider = "lemon-squeezy" | "stripe" | "paypal";

export interface PaymentConfig {
  provider: PaymentProvider;
  locale: string;
  currency: string; // 'USD', 'KRW', 'JPY'
}

/**
 * Returns the default payment configuration for a given locale.
 *
 * - en: Lemon Squeezy (USD) — currently active
 * - ko: Lemon Squeezy (USD) — TODO: switch to Stripe/PayPal when KRW support added
 * - ja: Lemon Squeezy (USD) — TODO: switch to Stripe/PayPal when JPY support added
 */
export function getPaymentConfig(locale: string): PaymentConfig {
  switch (locale) {
    case "ko":
      return {
        provider: "lemon-squeezy", // TODO: switch to 'stripe' when KRW account is set up
        locale: "ko",
        currency: "USD", // TODO: change to 'KRW' when supported
      };
    case "ja":
      return {
        provider: "lemon-squeezy", // TODO: switch to 'stripe' when JPY account is set up
        locale: "ja",
        currency: "USD", // TODO: change to 'JPY' when supported
      };
    default:
      return {
        provider: "lemon-squeezy",
        locale: "en",
        currency: "USD",
      };
  }
}

/**
 * Returns the checkout URL for a product based on the payment configuration.
 *
 * Currently only Lemon Squeezy is implemented. Stripe and PayPal
 * checkout URL generation will be added when those providers are set up.
 */
export function getCheckoutUrl(
  productId: string,
  config: PaymentConfig
): string {
  switch (config.provider) {
    case "lemon-squeezy": {
      // Use existing env-based URL resolution
      const url = process.env[productId as string] as string | undefined;
      return url ?? "#";
    }
    case "stripe": {
      // TODO: Implement Stripe checkout URL generation
      // Will use STRIPE_PRICE_ID_{productId} env vars
      return "#";
    }
    case "paypal": {
      // TODO: Implement PayPal checkout URL generation
      return "#";
    }
    default:
      return "#";
  }
}
