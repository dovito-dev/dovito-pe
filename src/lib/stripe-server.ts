
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
  // Using the latest API version
  apiVersion: '2025-03-31.basil',
});

// Product IDs to use for the different subscription plans
export const STRIPE_PRODUCTS = {
  PAY_AS_YOU_GO: 'prod_payg_xyz',
  MONTHLY: 'prod_monthly_xyz',
  ANNUAL: 'prod_annual_xyz'
};

// Function to determine credits to add based on product ID and quantity
export const calculateCreditsForProduct = (productId: string, quantity: number = 1): number => {
  switch(productId) {
    case STRIPE_PRODUCTS.PAY_AS_YOU_GO:
      return quantity; // 1 credit per $1
    case STRIPE_PRODUCTS.MONTHLY:
      return 60; // 60 credits for monthly plan
    case STRIPE_PRODUCTS.ANNUAL:
      return 999999; // Effectively unlimited for annual plan
    default:
      return 0;
  }
};

// Function to determine plan type based on product ID
export const getPlanTypeForProduct = (productId: string): string => {
  switch(productId) {
    case STRIPE_PRODUCTS.PAY_AS_YOU_GO:
      return 'pay-as-you-go';
    case STRIPE_PRODUCTS.MONTHLY:
      return 'monthly';
    case STRIPE_PRODUCTS.ANNUAL:
      return 'annual';
    default:
      return 'free';
  }
};
