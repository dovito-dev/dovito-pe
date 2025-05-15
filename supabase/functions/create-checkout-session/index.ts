
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "No authorization header" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get user from auth header
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Authentication error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Parse request body
    const { productId, quantity = 1 } = await req.json();
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Init Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if user exists in Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    
    let customerId = customers.data.length > 0 ? customers.data[0].id : null;
    
    // If customer doesn't exist, create one
    if (!customerId && user.email) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Determine mode and line items based on the product
    let mode: 'payment' | 'subscription' = 'payment';
    let lineItems = [];
    
    switch (productId) {
      case 'prod_payg_xyz':
        // Pay-as-you-go is a one-time payment
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Prompts Credits',
              description: 'Pay-as-you-go prompt credits',
            },
            unit_amount: 100, // $1.00
          },
          quantity: Number(quantity),
        });
        mode = 'payment';
        break;
      
      case 'prod_monthly_xyz':
        // Monthly subscription
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MEGA Monthly Plan',
              description: '60 prompts per month',
            },
            unit_amount: 1900, // $19.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        });
        mode = 'subscription';
        break;
      
      case 'prod_annual_xyz':
        // Annual subscription
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'WHOPPING Annual Plan',
              description: 'Unlimited prompts (Fair Use Policy applies)',
            },
            unit_amount: 49700, // $497.00
            recurring: {
              interval: 'year',
            },
          },
          quantity: 1,
        });
        mode = 'subscription';
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid product ID" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: mode,
      success_url: `${req.headers.get("origin") || "https://pe.dovito.com"}/settings?checkout=success`,
      cancel_url: `${req.headers.get("origin") || "https://pe.dovito.com"}/settings?checkout=canceled`,
      metadata: {
        user_id: user.id,
        product_id: productId,
        quantity: quantity.toString(),
      },
    });
    
    // Return session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
