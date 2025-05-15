
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const QuotaDisplay = () => {
  const { user } = useAuth();
  const { credits, plan } = useSubscription();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('usage, quota, credits, plan')
        .eq('id', user?.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  // If we have a subscription plan (monthly or annual), show that instead of credits
  if (plan === 'monthly') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-dovito font-medium">MEGA Monthly</span>
      </div>
    );
  }
  
  if (plan === 'annual') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-dovito font-medium">WHOPPING Annual</span>
      </div>
    );
  }

  // For free and pay-as-you-go users, show credits or usage/quota
  return (
    <div className="flex items-center gap-2 text-sm">
      {typeof profile.credits !== 'undefined' && profile.credits !== null ? (
        <span>Credits: {profile.credits}</span>
      ) : (
        <>
          <span>{profile.usage || 0}</span>
          <span>/</span>
          <span>{profile.quota === null ? 'UNLIMITED' : profile.quota}</span>
        </>
      )}
    </div>
  );
};

export default QuotaDisplay;
