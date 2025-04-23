import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
const Home = () => {
  const {
    user
  } = useAuth();
  return <Layout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block">Create Perfect AI Prompts</span>
          <span className="mt-2 block text-dovito">For Any Model</span>
        </h1>
        
        <p className="mt-6 max-w-lg text-lg text-muted-foreground">
          Prompt Engineer helps you craft effective prompts for OpenAI, Claude, 
          Gemini, and other AI models. Build, save, and export your prompts.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {user ? <Link to="/builder">
              <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                Go to Builder
              </Button>
            </Link> : <>
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
            </>}
        </div>
      </div>
      
      <div id="features" className="py-16 container">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="space-y-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Multi-Bot Support</h3>
              <p className="text-lg text-muted-foreground">Create and customize prompts for various AI models including OpenAI, Claude, Google Gemini, and more.</p>
              
            </div>
            <Card className="overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <img src="/lovable-uploads/ad7a9cb3-4192-4617-ba88-96936ed79935.png" alt="AI Bot Interface" className="object-cover w-full h-full rounded-t-lg" />
              </AspectRatio>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="space-y-4 md:order-2">
              <h3 className="text-2xl font-semibold">Prompt History & Management</h3>
              <p className="text-lg text-muted-foreground">Keep track of all your prompts in one place. Access your history, and quickly find your most successful prompts for reuse.</p>
              
            </div>
            <Card className="overflow-hidden md:order-1">
              <AspectRatio ratio={16 / 9}>
                <img src="/lovable-uploads/c982a2a2-67be-4adb-aeca-9e1329bd79f7.png" alt="Prompt History Interface" className="object-cover w-full h-full rounded-t-lg" />
              </AspectRatio>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Export & Share</h3>
              <p className="text-lg text-muted-foreground">Export your prompts in multiple formats. Support for TXT, CSV, and HTML formats makes it easy to integrate with your existing workflows.</p>
              
            </div>
            <Card className="overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <img src="/lovable-uploads/915fd21c-5341-4d6b-afbd-4257f5184ead.png" alt="Export Interface" className="object-cover w-full h-full rounded-t-lg" />
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
            {user ? <Link to="/builder">
                <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                  Go to Builder
                </Button>
              </Link> : <Link to="/login?tab=signup">
                <Button size="lg" className="bg-dovito hover:bg-dovito/90">
                  Sign Up Free
                </Button>
              </Link>}
          </div>
        </Card>
      </div>
    </Layout>;
};
export default Home;