
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuotaDisplay from './QuotaDisplay';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-3xl items-center justify-between rounded-full bg-white px-6 py-3 shadow-lg">
        {user ? (
          <>
            <QuotaDisplay />
            <Link
              to="/builder"
              className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-dovito hover:opacity-90 transition-opacity"
            >
              Prompt Engineer by Dovito
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/builder">
                <Button variant="ghost" size="sm" className="bg-gray-100 hover:bg-gray-200">
                  Builder
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <Link
              to="/"
              className="text-xl font-bold text-dovito hover:opacity-90 transition-opacity"
            >
              Prompt Engineer by Dovito
            </Link>
            <Link to="/login" className="absolute right-4">
              <Button className="bg-transparent hover:bg-gray-100">Login</Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
