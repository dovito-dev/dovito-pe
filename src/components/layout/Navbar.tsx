
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-3xl items-center justify-between rounded-full border border-gray-200 bg-background/80 px-6 py-3 backdrop-blur-lg shadow-lg">
        <Link to="/" className="text-xl font-bold text-dovito">
          Prompt Engineer
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button 
            id="themeToggle"
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="h-9 w-9 rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/builder">
                <Button variant="ghost">Builder</Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
