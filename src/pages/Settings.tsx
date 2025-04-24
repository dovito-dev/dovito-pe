
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
  const [quotaRequestName, setQuotaRequestName] = useState('');
  const [quotaRequestMessage, setQuotaRequestMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRequestSubmitting, setIsRequestSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
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
