import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
      
      <div id="features" className="py-16 container">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="space-y-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Multi-Bot Support</h3>
              <p className="text-lg text-muted-foreground">
                Create and customize prompts for various AI models including OpenAI, Claude, 
                Google Gemini, and more. Fine-tune your interactions with precise control over
                temperature, tokens, and other parameters.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Support for all major AI models</li>
                <li>✓ Advanced parameter controls</li>
                <li>✓ Model-specific optimizations</li>
              </ul>
            </div>
            <Card className="overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src="photo-1488590528505-98d2b5aba04b" 
                  alt="AI Bot Interface"
                  className="object-cover w-full h-full rounded-t-lg"
                />
              </AspectRatio>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="space-y-4 md:order-2">
              <h3 className="text-2xl font-semibold">Prompt History & Management</h3>
              <p className="text-lg text-muted-foreground">
                Keep track of all your prompts in one place. Access your history, 
                organize by categories, and quickly find your most successful prompts
                for reuse or refinement.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Comprehensive prompt history</li>
                <li>✓ Smart categorization</li>
                <li>✓ Quick search and filters</li>
              </ul>
            </div>
            <Card className="overflow-hidden md:order-1">
              <AspectRatio ratio={16/9}>
                <img 
                  src="photo-1461749280684-dccba630e2f6" 
                  alt="Prompt History Interface"
                  className="object-cover w-full h-full rounded-t-lg"
                />
              </AspectRatio>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Export & Share</h3>
              <p className="text-lg text-muted-foreground">
                Export your prompts in multiple formats or share them directly with your team.
                Support for TXT, CSV, PDF, and HTML formats makes it easy to integrate
                with your existing workflows.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Multiple export formats</li>
                <li>✓ Team sharing capabilities</li>
                <li>✓ Version control</li>
              </ul>
            </div>
            <Card className="overflow-hidden">
              <AspectRatio ratio={16/9}>
                <img 
                  src="photo-1486312338219-ce68d2c6f44d" 
                  alt="Export Interface"
                  className="object-cover w-full h-full rounded-t-lg"
                />
              </AspectRatio>
            </Card>
          </div>
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
