
/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  // Add window.env global
  interface Window {
    env?: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_STRIPE_PUBLISHABLE_KEY: string;
    };
  }
