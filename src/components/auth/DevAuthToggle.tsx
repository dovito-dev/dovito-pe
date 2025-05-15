
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const DevAuthToggle = () => {
  const { user, toggleDevAuth, isDevMode } = useAuth();
  
  if (!isDevMode) return null;
  
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <Switch 
          id="dev-auth-toggle" 
          checked={!!user} 
          onCheckedChange={toggleDevAuth}
        />
        <Label htmlFor="dev-auth-toggle" className="cursor-pointer">
          {user ? 'Signed In' : 'Signed Out'} (Dev Mode)
        </Label>
      </div>
    </div>
  );
};

export default DevAuthToggle;
