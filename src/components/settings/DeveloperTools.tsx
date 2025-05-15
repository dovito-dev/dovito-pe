
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    __simulateLoadingState: boolean;
    __simulateErrorState: boolean;
    __simulateEmptyState: boolean;
  }
}

const DeveloperTools = () => {
  const [bypassLoginEnabled, setBypassLoginEnabled] = useState(false);
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleBypassLogin = async () => {
    if (bypassLoginEnabled) {
      try {
        await supabase.auth.signInWithPassword({
          email: "admin@pe.dovito.com",
          password: "password"
        });
        toast({
          title: "Development Login",
          description: "Bypassed login with development credentials",
        });
      } catch (error) {
        console.error("Development login failed:", error);
        toast({
          title: "Development Login Failed",
          description: "Could not log in with development credentials",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Bypass Disabled",
        description: "Enable the toggle first to bypass login",
      });
    }
  };

  const simulateLoadingState = () => {
    window.__simulateLoadingState = true;
    toast({
      title: "Loading State Simulated",
      description: "Components will show loading state where implemented",
    });
  };

  const simulateErrorState = () => {
    window.__simulateErrorState = true;
    toast({
      title: "Error State Simulated",
      description: "Components will show error state where implemented",
    });
  };

  const simulateEmptyState = () => {
    window.__simulateEmptyState = true;
    toast({
      title: "Empty State Simulated",
      description: "Components will show empty state where implemented",
    });
  };

  const resetSimulations = () => {
    delete window.__simulateLoadingState;
    delete window.__simulateErrorState;
    delete window.__simulateEmptyState;
    toast({
      title: "Simulations Reset",
      description: "All UI state simulations have been reset",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Tools</CardTitle>
        <CardDescription>
          Developer-only toggles for UI state testing and auth bypass
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="bypass-login">Bypass Login</Label>
            <span className="text-xs text-muted-foreground">
              Enable to auto-login with development credentials
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="bypass-login"
              checked={bypassLoginEnabled}
              onCheckedChange={setBypassLoginEnabled}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBypassLogin}
            >
              Apply
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">UI State Simulation</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={simulateLoadingState}>
              Simulate Loading
            </Button>
            <Button variant="outline" onClick={simulateErrorState}>
              Simulate Error
            </Button>
            <Button variant="outline" onClick={simulateEmptyState}>
              Simulate No Data
            </Button>
            <Button variant="outline" onClick={resetSimulations}>
              Reset Simulations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperTools;
