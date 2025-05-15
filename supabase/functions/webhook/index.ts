
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // This webhook doesn't need CORS headers as it's called by Stripe, not browsers
  
  try {
    const stripeSignature = req.headers.get("stripe-signature");
    if (!stripeSignature) {
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature" }),
        { status: 400 }
      );
    }

    const body = await req.text();
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Verify and parse the webhook
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const productId = session.metadata?.product_id;
        
        if (!userId || !productId) {
          console.error("Missing metadata:", session.metadata);
          return new Response(JSON.stringify({ error: "Missing metadata" }), { status: 400 });
        }

        // Get plan and credits to add based on product
        let plan = "free";
        let creditsToAdd = 0;
        
        switch (productId) {
          case "prod_payg_xyz":
            plan = "pay-as-you-go";
            creditsToAdd = parseInt(session.metadata?.quantity || "0", 10);
            break;
          case "prod_monthly_xyz":
            plan = "monthly";
            creditsToAdd = 60; // Monthly plan gets 60 credits
            break;
          case "prod_annual_xyz":
            plan = "annual";
            creditsToAdd = 999999; // Effectively unlimited
            break;
        }

        // Update user's profile in Supabase
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: plan,
            credits: creditsToAdd,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
        
        if (error) {
          console.error("Error updating profile:", error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Skip if deleted customer or no metadata
        if (customer.deleted || !customer.metadata?.user_id) {
          return new Response(JSON.stringify({ success: false, reason: "Customer deleted or missing user_id" }), { status: 200 });
        }
        
        const userId = customer.metadata.user_id;
        const isActive = subscription.status === "active";
        
        // Determine plan from price
        let plan = "free";
        let creditsToAdd = 0;
        
        if (isActive) {
          // Get the price ID from the subscription
          const priceId = subscription.items.data[0].price.id;
          const price = await stripe.prices.retrieve(priceId);
          const productId = price.product;
          
          // Get the product details (we need to know if it's monthly or annual)
          const product = await stripe.products.retrieve(productId as string);
          
          // Determine plan based on product
          if (product.name.toLowerCase().includes("monthly")) {
            plan = "monthly";
            creditsToAdd = 60;
          } else if (product.name.toLowerCase().includes("annual")) {
            plan = "annual";
            creditsToAdd = 999999; // Effectively unlimited
          }
        }
        
        // Update user profile
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: isActive ? plan : "free",
            credits: isActive ? creditsToAdd : 0,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
        
        if (error) {
          console.error("Error updating profile after subscription change:", error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Skip if deleted customer or no metadata
        if (customer.deleted || !customer.metadata?.user_id) {
          return new Response(JSON.stringify({ success: false, reason: "Customer deleted or missing user_id" }), { status: 200 });
        }
        
        const userId = customer.metadata.user_id;
        
        // Reset user to free plan with default credits
        const { error } = await supabase
          .from("profiles")
          .update({
            plan: "free",
            credits: 5, // Default free credits
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
        
        if (error) {
          console.error("Error resetting profile after subscription deletion:", error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
});
