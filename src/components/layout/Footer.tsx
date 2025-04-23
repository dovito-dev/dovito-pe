
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Prompt Engineer by Dovito
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="https://dovito.com/legal/terms/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="https://dovito.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="https://github.com/dovito-dev/dovito-pe" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
