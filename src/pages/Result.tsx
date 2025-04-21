
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Build } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Clipboard, Check, Loader2, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const [build, setBuild] = useState<Build | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBuild(id);
      
      // If status is "In Progress", poll for updates
      const interval = setInterval(() => {
        if (build && build.status === 'In Progress') {
          fetchBuild(id);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [id, build?.status]);

  const fetchBuild = async (buildId: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('builds')
        .select('*')
        .eq('id', buildId)
        .single();
        
      if (error) throw error;
      
      setBuild(data as Build);
    } catch (error) {
      console.error('Error fetching build:', error);
      toast({
        title: 'Error',
        description: 'Failed to load the build details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!build?.result) return;
    
    try {
      await navigator.clipboard.writeText(build.result);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard',
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading && !build) {
    return (
      <Layout requireAuth>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dovito" />
        </div>
      </Layout>
    );
  }

  if (!build) {
    return (
      <Layout requireAuth>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Build Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested build could not be found.
          </p>
          <Link to="/builder">
            <Button>Back to Builder</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="max-w-3xl mx-auto">
        <Link to="/builder" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Builder
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle>Prompt Result</CardTitle>
            <CardDescription>
              Bot: {build.bot} | Created: {formatDate(build.created_at)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Your Request</h3>
              <p className="p-3 bg-gray-800/50 rounded-md">{build.request}</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Generated Prompt</h3>
                <span 
                  id="status"
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                    build.status === 'Complete' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}
                >
                  {build.status === 'Complete' ? (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      Build Complete
                    </>
                  ) : (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Build In Progress
                    </>
                  )}
                </span>
              </div>
              
              {build.status === 'Complete' ? (
                <div className="relative">
                  <Textarea
                    id="finalPrompt"
                    value={build.result}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <Button
                    id="copyPrompt"
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                    disabled={copied}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] bg-gray-800/20 rounded-md">
                  <Loader2 className="h-8 w-8 animate-spin text-dovito mb-4" />
                  <p>Generating your prompt...</p>
                  <p className="text-sm text-muted-foreground mt-2">This usually takes a few seconds.</p>
                </div>
              )}
            </div>
            
            {build.status === 'Complete' && (
              <div className="flex justify-end">
                <Button 
                  className="bg-dovito hover:bg-dovito/90"
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Result;
