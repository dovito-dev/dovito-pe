
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings = () => {
  const { user, profile, signOut } = useAuth();
  const { credits, plan, refreshCredits } = useSubscription();
  const [name, setName] = useState(profile?.name || '');
  const [quotaRequestName, setQuotaRequestName] = useState('');
  const [quotaRequestMessage, setQuotaRequestMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const { toast } = useToast();

  // Update name state when profile changes
  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  // Refresh credits when component mounts
  useEffect(() => {
    if (user) {
      refreshCredits();
    }
  }, [user]);

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

  const handleQuotaRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsRequestSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('usage_requests')
        .insert({
          user_id: user.id,
          name: quotaRequestName,
          message: quotaRequestMessage
        });
      
      if (error) throw error;
      
      setRequestSubmitted(true);
      setQuotaRequestName('');
      setQuotaRequestMessage('');
      
      toast({
        title: 'Request Submitted',
        description: 'Your quota increase request has been sent.',
      });
    } catch (error) {
      console.error('Error submitting quota request:', error);
      toast({
        title: 'Request Failed',
        description: 'Failed to submit your request',
        variant: 'destructive',
      });
    } finally {
      setIsRequestSubmitting(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Error',
        description: 'Could not open subscription portal. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  if (!user) {
    return (
      <Layout requireAuth>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dovito" />
        </div>
      </Layout>
    );
  }

  const getPlanDisplay = () => {
    switch(plan) {
      case 'monthly':
        return 'MEGA Monthly ($19/month)';
      case 'annual':
        return 'WHOPPING Annual ($497/year)';
      case 'pay-as-you-go':
        return 'Pay-as-you-go ($1/prompt)';
      default:
        return 'Free Plan';
    }
  };

  return (
    <Layout requireAuth>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-8">
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
                <CardTitle>Request Quota Increase</CardTitle>
                <CardDescription>
                  Ask for more daily submissions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleQuotaRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestName">Name</Label>
                    <Input
                      id="requestName"
                      value={quotaRequestName}
                      onChange={(e) => setQuotaRequestName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requestMessage">Message</Label>
                    <Input
                      id="requestMessage"
                      value={quotaRequestMessage}
                      onChange={(e) => setQuotaRequestMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isRequestSubmitting}
                    className="w-full bg-dovito hover:bg-dovito/90"
                  >
                    {isRequestSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Request Increase'
                    )}
                  </Button>
                  
                  {requestSubmitted && (
                    <p className="text-sm text-green-500 mt-2">
                      Request sent. We'll review your request soon.
                    </p>
                  )}
                </form>
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
                  <X className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and credits
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium">{getPlanDisplay()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plan === 'annual' 
                          ? 'Unlimited prompts (Fair Use Policy applies)' 
                          : plan === 'monthly'
                            ? '60 prompts per month'
                            : `${credits} credits remaining`}
                      </p>
                    </div>
                    <Button
                      onClick={handleManageSubscription}
                      disabled={isLoadingPortal || !plan || plan === 'free'}
                      variant="outline"
                    >
                      {isLoadingPortal ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      Manage Subscription
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Available Plans</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className={`p-4 ${plan === 'pay-as-you-go' ? 'border-2 border-dovito' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Pay-as-you-go</h3>
                        {plan === 'pay-as-you-go' && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold">$1 per prompt</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Buy exactly what you need
                      </p>
                    </Card>
                    
                    <Card className={`p-4 ${plan === 'monthly' ? 'border-2 border-dovito' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Monthly Plan</h3>
                        {plan === 'monthly' ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Current
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Save 68%
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold">$19/month</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        60 prompts
                      </p>
                    </Card>
                    
                    <Card className={`p-4 ${plan === 'annual' ? 'border-2 border-dovito' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Annual Plan</h3>
                        {plan === 'annual' && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold">$497/year</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Unlimited (see Fair Use)
                      </p>
                    </Card>
                  </div>
                  
                  <Button
                    onClick={() => window.location.href = '/builder'}
                    className="w-full bg-dovito hover:bg-dovito/90"
                  >
                    Go to Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
