
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Create Perfect AI Prompts</span>
          <span className="mt-2 block text-dovito">For Any Bot</span>
        </h1>
        
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">
          Prompt Engineer helps you craft effective prompts for OpenAI, Claude, 
          Gemini, and other AI models. Build, save, and export your prompts.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link to="/builder">
              <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                Go to Builder
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login?tab=signup">
                <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                  Get Started
                </Button>
              </Link>
              <Link to="/login?tab=signin">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div id="features" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Bot Support</h3>
              <p className="text-muted-foreground mb-4">
                Create prompts for OpenAI, Claude, Google Gemini, Grok, Perplexity, and Meta Llama.
              </p>
              <div className="rounded-lg bg-gray-900 p-4 text-sm">
                <p className="text-green-400">// Example: Bot Selection</p>
                <p className="text-gray-300">Select Bot: OpenAI GPT-4</p>
                <p className="text-gray-300">Temperature: 0.7</p>
                <p className="text-gray-300">Max Tokens: 2048</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Build History</h3>
              <p className="text-muted-foreground mb-4">
                Access all your previous prompts in one place with full export capabilities.
              </p>
              <div className="rounded-lg bg-gray-900 p-4 text-sm">
                <p className="text-blue-400">// Recent Builds</p>
                <p className="text-gray-300">Marketing Copy Generator</p>
                <p className="text-gray-300">Story Outline Creator</p>
                <p className="text-gray-300">Code Refactoring Assistant</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Export Options</h3>
              <p className="text-muted-foreground mb-4">
                Download your prompts in multiple formats like TXT, CSV, PDF, and HTML.
              </p>
              <div className="rounded-lg bg-gray-900 p-4 text-sm">
                <p className="text-yellow-400">// Export Formats</p>
                <p className="text-gray-300">✓ Plain Text (.txt)</p>
                <p className="text-gray-300">✓ Structured Data (.csv)</p>
                <p className="text-gray-300">✓ Web Format (.html)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="py-16">
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Ready to get started?</h2>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Join Prompt Engineer today and improve your AI interactions.
          </p>
          
          <div className="flex justify-center">
            {user ? (
              <Link to="/builder">
                <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                  Go to Builder
                </Button>
              </Link>
            ) : (
              <Link to="/login?tab=signup">
                <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                  Sign Up Free
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
