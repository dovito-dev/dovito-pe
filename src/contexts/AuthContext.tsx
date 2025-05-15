import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  // Add dev mode properties
  isDevMode: boolean;
  toggleDevAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(isDevelopment);
  // Store a mock user for development mode
  const [mockUser, setMockUser] = useState<User | null>(null);
  const [mockProfile, setMockProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  // Create a mock user for development mode
  const createMockUser = () => {
    const mockUserId = 'dev-user-123';
    const mockUserObj = {
      id: mockUserId,
      email: 'dev@example.com',
      user_metadata: { name: 'Dev User' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;
    
    const mockProfileObj = {
      id: mockUserId,
      email: 'dev@example.com',
      name: 'Dev User',
      plan: 'monthly', // Set to whatever plan you want to test
      credits: 10,
      usage: 5,
      quota: 100,
    } as Profile;
    
    setMockUser(mockUserObj);
    setMockProfile(mockProfileObj);
  };

  // Initialize mock user
  useEffect(() => {
    if (isDevMode) {
      createMockUser();
    }
  }, [isDevMode]);

  useEffect(() => {
    // Only set up Supabase auth listeners if not in dev mode
    if (!isDevMode) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setTimeout(() => {
              fetchProfile(session.user.id);
            }, 0);
          } else {
            setProfile(null);
          }
        }
      );

      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      });

      setLoading(false);
      
      return () => subscription.unsubscribe();
    }
  }, [isDevMode]);

  // Toggle between signed in and signed out in dev mode
  const toggleDevAuth = () => {
    if (!isDevMode) return;

    if (user) {
      // Sign out
      setUser(null);
      setProfile(null);
      setSession(null);
      toast({
        title: "Dev Mode",
        description: "Signed out in development mode",
      });
    } else {
      // Sign in with mock user
      setUser(mockUser);
      setProfile(mockProfile);
      // Create a minimal mock session
      setSession({
        user: mockUser!,
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: new Date().getTime() + 3600 * 1000,
        token_type: 'bearer',
      } as Session);
      toast({
        title: "Dev Mode",
        description: "Signed in with mock user in development mode",
      });
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createProfile(userId, user?.email || null);
        }
        return;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };
  
  const createProfile = async (userId: string, email: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId, 
          email: email,
          name: email ? email.split('@')[0] : null,
          plan: 'free'
        }]);
        
      if (error) {
        console.error('Error creating profile:', error);
        return;
      }
      
      // Fetch the newly created profile
      fetchProfile(userId);
    } catch (error) {
      console.error('Unexpected error creating profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send magic link",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        await createProfile(data.user.id, data.user.email);
      }
      
      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signIn,
        signInWithMagicLink,
        signInWithGoogle,
        signUp,
        signOut,
        loading,
        // Add dev mode properties
        isDevMode,
        toggleDevAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
