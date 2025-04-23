// src/lib/stripe-server.ts
// ---------------------------------
// A server-side Stripe SDK instance
// ---------------------------------

import Stripe from 'stripe';

/**
 * The secret key is **never** exposed to the browser.
 * It must live in your .env file and be loaded by your server-side runtime.
 *
 *   STRIPE_SECRET_KEY=sk_live_********************************
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Use the most-recent stable API version (remove the line entirely to
  // let Stripe default to the latest each time you upgrade the SDK).
  apiVersion: '2025-03-31',
});