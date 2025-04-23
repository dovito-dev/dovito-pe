// src/lib/stripe-client.ts
// ----------------------------------------
// A browser-safe helper that loads Stripe.js
// ----------------------------------------

import { loadStripe } from '@stripe/stripe-js';

/**
 * The publishable key is safe to expose to the browser.
 * It also lives in your .env file (prefixed with VITE_ so Vite exposes it).
 *
 *   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_********************************
 */
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
);