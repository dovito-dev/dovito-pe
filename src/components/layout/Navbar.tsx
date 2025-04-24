import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuotaDisplay from './QuotaDisplay';
const Navbar = () => {
  const {
    user
  } = useAuth();
  return <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-3xl items-center justify-between rounded-full bg-zinc-900/70 px-6 py-3 backdrop-blur-lg shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        {user && <QuotaDisplay />}
        
        <div className={`text-xl font-bold ${user ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
          <Link to="/builder" className="text-dovito hover:opacity-90 transition-opacity">
            Prompt Engineer by Dovito
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? <>
              <Link to="/builder">
                <Button variant="ghost" size="sm" className="bg-slate-700 hover:bg-slate-600">
                  Builder
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-700 hover:bg-slate-600">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            </> : <Link to="/login">
              <Button>Login</Button>
            </Link>}
        </div>
      </nav>
    </div>;
};
export default Navbar;