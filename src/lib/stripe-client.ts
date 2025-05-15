
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

// Function to handle checkout session creation
export const createCheckoutSession = async (productId: string, quantity: number = 1) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Function to open the customer portal
export const openCustomerPortal = async () => {
  try {
    const response = await fetch('/api/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { url } = await response.json();
    if (url) window.open(url, '_blank');
    return url;
  } catch (error) {
    console.error('Error opening customer portal:', error);
    throw error;
  }
};
