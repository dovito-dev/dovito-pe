
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PlanProps {
  name: string;
  price: string;
  description?: string;
  callout?: string;
  stripeProductId: string;
  hasQuantity?: boolean;
}

const plans: PlanProps[] = [
  {
    name: "Pay-as-you-go",
    price: "$1/prompt",
    description: "Buy exactly what you need",
    stripeProductId: "prod_payg_xyz",
    hasQuantity: true
  },
  {
    name: "MEGA Monthly Plan",
    price: "$19/month",
    description: "60 prompts per month",
    callout: "Save 68%",
    stripeProductId: "prod_monthly_xyz"
  },
  {
    name: "WHOPPING Annual Plan",
    price: "$497/year",
    description: "Unlimited prompts (Fair Use Policy applies)",
    stripeProductId: "prod_annual_xyz"
  }
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      const plan = plans.find(p => p.name === selectedPlan);
      if (!plan) return;

      // In a real implementation, this would call the Stripe checkout endpoint
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          productId: plan.stripeProductId,
          quantity: plan.hasQuantity ? quantity : 1
        }
      });

      if (error) throw error;
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.open(data.url, '_blank');
        onClose();
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout Failed',
        description: 'Unable to start checkout process. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">You're Out of Prompts!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Choose the plan that fits you best to keep building.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedPlan === plan.name 
                    ? 'border-2 border-primary shadow-md' 
                    : 'border border-border'
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{plan.name}</h3>
                    {plan.callout && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {plan.callout}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                      {selectedPlan === plan.name && <Check size={14} />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {selectedPlan === plan.name ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedPlan === 'Pay-as-you-go' && (
            <div className="mt-2">
              <label className="text-sm font-medium">
                How many prompts would you like to purchase?
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  type="number" 
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <span className="text-sm text-muted-foreground">
                  Subtotal: ${quantity}.00
                </span>
              </div>
            </div>
          )}

          <Button 
            className="mt-4 w-full" 
            disabled={!selectedPlan || isLoading}
            onClick={handleSubscribe}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
