
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const { user, profile, signOut } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();

  const updateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePlanChange = async () => {
    if (!user || !profile) return;
    
    setIsUpgrading(true);
    
    try {
      // In a real implementation, this would redirect to Stripe checkout
      // For now, we'll just toggle the plan type directly
      
      const newPlan = profile.plan === 'free' ? 'paid' : 'free';
      
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Reload the page to refresh the profile data
      window.location.reload();
      
      toast({
        title: 'Plan updated',
        description: `Your plan has been changed to ${newPlan}.`,
      });
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: 'Plan change failed',
        description: 'Failed to update your subscription plan',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!user || !profile) {
    return (
      <Layout requireAuth>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dovito" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed
                </p>
              </div>
              
              <Button 
                onClick={updateProfile} 
                disabled={isUpdating}
                className="bg-dovito hover:bg-dovito/90"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="planType">Current Plan</Label>
                <Input
                  id="planType"
                  value={profile.plan === 'free' ? 'Free' : 'Paid'}
                  disabled
                />
              </div>
              
              <Button 
                id="upgradePlan"
                onClick={handlePlanChange} 
                disabled={isUpgrading}
                variant={profile.plan === 'free' ? 'default' : 'destructive'}
                className={profile.plan === 'free' ? 'bg-dovito hover:bg-dovito/90' : ''}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : profile.plan === 'free' ? (
                  'Upgrade to Paid'
                ) : (
                  'Downgrade to Free'
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground">
                {profile.plan === 'free' 
                  ? 'Upgrade to paid plan for unlimited builds and premium features.' 
                  : 'Downgrading will limit your access to basic features only.'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Button 
                id="logout"
                variant="destructive" 
                onClick={signOut}
              >
                Log out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
