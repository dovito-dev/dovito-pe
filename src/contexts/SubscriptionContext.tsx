
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionContextType {
  credits: number;
  plan: string | null;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  refreshCredits: () => Promise<void>;
  deductCredit: () => Promise<boolean>;
  isPlanActive: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [plan, setPlan] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isPlanActive, setIsPlanActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get user's credits and plan when user changes
  useEffect(() => {
    if (user) {
      refreshCredits();
    }
  }, [user]);

  const refreshCredits = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    
    try {
      // Get user profile which contains the credits
      const { data, error } = await supabase
        .from('profiles')
        .select('credits, usage, quota, plan')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error refreshing credits:', error);
        setError(error);
        return;
      }
      
      // Update credits state
      if (data) {
        setCredits(data.credits ?? 0);
        setPlan(data.plan ?? null);
        setIsPlanActive(data.plan === 'monthly' || data.plan === 'annual');
      }
      
      // Add development logs
      if (process.env.NODE_ENV === 'development') {
        console.log("DEV: Subscription context", { 
          loading: false, 
          error: null, 
          data,
          credits: data?.credits,
          plan: data?.plan,
          isPlanActive: data?.plan === 'monthly' || data?.plan === 'annual'
        });
      }
    } catch (error) {
      console.error('Error refreshing credits:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const deductCredit = async (): Promise<boolean> => {
    if (!user) return false;
    
    // Monthly and annual subscribers don't use credits
    if (isPlanActive) return true;
    
    // For pay-as-you-go or free users, check credits
    if (credits <= 0) {
      setShowSubscriptionModal(true);
      return false;
    }
    
    try {
      // Use the deduct-credit edge function
      const { error } = await supabase.functions.invoke('deduct-credit', {
        body: { userId: user.id }
      });
      
      if (error) {
        console.error('Error deducting credit:', error);
        return false;
      }
      
      // Update local state
      setCredits(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error deducting credit:', error);
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        credits,
        plan,
        showSubscriptionModal,
        setShowSubscriptionModal,
        refreshCredits,
        deductCredit,
        isPlanActive
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
