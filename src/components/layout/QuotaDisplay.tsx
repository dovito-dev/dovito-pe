
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const QuotaDisplay = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('usage, quota')
        .eq('id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span>{profile.usage}</span>
      <span>/</span>
      <span>{profile.quota === null ? 'UNLIMITED' : profile.quota}</span>
    </div>
  );
};

export default QuotaDisplay;
