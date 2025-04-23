// src/lib/stripe-server.ts
// -------------------------
// A server-side Stripe SDK instance
// -------------------------

import Stripe from 'stripe';

/**
 * Secret key comes from your .env (never commit it):
 *   STRIPE_SECRET_KEY=sk_live_********************************
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // valid literal in the current Stripe d.ts union:
  apiVersion: '2025-03-31.basil',
});