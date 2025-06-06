
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Builder from "@/pages/Builder";
import Result from "@/pages/Result";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import { useSubscription } from "@/contexts/SubscriptionContext";
import DevAuthToggle from "@/components/auth/DevAuthToggle";

const queryClient = new QueryClient();

// Modal wrapper to conditionally show subscription modal
const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { showSubscriptionModal, setShowSubscriptionModal } = useSubscription();
  
  return (
    <>
      {children}
      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="light">
        <AuthProvider>
          <SubscriptionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/builder" element={
                  <ModalWrapper>
                    <Builder />
                  </ModalWrapper>
                } />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <DevAuthToggle />
            </BrowserRouter>
          </SubscriptionProvider>
        </AuthProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
