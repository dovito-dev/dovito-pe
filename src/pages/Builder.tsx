import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Build } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Check, Download, FileDown, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Builder = () => {
  const [bot, setBot] = useState('OpenAI');
  const [userNeed, setUserNeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [selectedBuilds, setSelectedBuilds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBuilds();
    }
  }, [user]);

  const fetchBuilds = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching builds:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your past builds',
        variant: 'destructive',
      });
      return;
    }

    setBuilds(data as Build[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a build',
        variant: 'destructive',
      });
      return;
    }
    
    if (!userNeed.trim()) {
      toast({
        title: 'Input required',
        description: 'Please describe what you want the chatbot to do',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('builds')
        .insert([
          {
            user_id: user.id,
            bot,
            request: userNeed.trim(),
            status: 'In Progress',
            result: ''
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const buildId = data[0].id;
        
        setTimeout(async () => {
          const result = `## Prompt for ${bot}\n\nYou are an AI assistant specialized in ${userNeed.trim()}. Follow these guidelines:\n\n1. Listen carefully to the user's request\n2. Ask clarifying questions if needed\n3. Provide detailed, step-by-step responses\n4. Include examples and explanations\n5. Maintain a helpful and friendly tone\n\nWhen responding to queries about ${userNeed.trim()}, draw upon relevant knowledge and best practices in this field.`;
          
          const { error: updateError } = await supabase
            .from('builds')
            .update({ status: 'Complete', result })
            .eq('id', buildId);
            
          if (updateError) {
            console.error('Error updating build:', updateError);
            toast({
              title: 'Error',
              description: 'Failed to complete the build process',
              variant: 'destructive',
            });
            return;
          }
          
          fetchBuilds();
          
          navigate(`/result/${buildId}`);
        }, 2000);
        
        toast({
          title: 'Build started',
          description: 'Your prompt is being generated...',
        });
      }
    } catch (error) {
      console.error('Error creating build:', error);
      toast({
        title: 'Error',
        description: 'Failed to create a new build',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectBuild = (id: string) => {
    setSelectedBuilds(prev => {
      if (prev.includes(id)) {
        return prev.filter(buildId => buildId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedBuilds(builds.map(build => build.id));
    } else {
      setSelectedBuilds([]);
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

  const exportBuilds = (format: 'txt' | 'csv' | 'pdf' | 'html') => {
    if (selectedBuilds.length === 0) {
      toast({
        title: 'No builds selected',
        description: 'Please select at least one build to export',
        variant: 'destructive',
      });
      return;
    }

    const selectedBuildData = builds.filter(build => selectedBuilds.includes(build.id));
    
    let content = '';
    let filename = `prompt-engineer-exports-${new Date().toISOString().slice(0, 10)}`;
    
    switch (format) {
      case 'txt':
        content = selectedBuildData.map(build => 
          `ID: ${build.id}\nBot: ${build.bot}\nRequest: ${build.request}\nStatus: ${build.status}\nCreated: ${formatDate(build.created_at)}\n\n${build.result}\n\n---\n\n`
        ).join('');
        filename += '.txt';
        break;
        
      case 'csv':
        content = 'ID,Bot,Request,Status,Created At,Result\n';
        content += selectedBuildData.map(build => 
          `"${build.id}","${build.bot}","${build.request.replace(/"/g, '""')}","${build.status}","${build.created_at}","${build.result.replace(/"/g, '""')}"`
        ).join('\n');
        filename += '.csv';
        break;
        
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
  <title>Prompt Engineer Exports</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .build { border: 1px solid #ccc; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
    .meta { color: #666; margin-bottom: 10px; }
    .result { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Prompt Engineer Exports</h1>
  <p>Generated on ${new Date().toLocaleString()}</p>
  
  ${selectedBuildData.map(build => `
  <div class="build">
    <div class="meta">
      <strong>ID:</strong> ${build.id}<br>
      <strong>Bot:</strong> ${build.bot}<br>
      <strong>Request:</strong> ${build.request}<br>
      <strong>Status:</strong> ${build.status}<br>
      <strong>Created:</strong> ${formatDate(build.created_at)}
    </div>
    <div class="result">${build.result}</div>
  </div>
  `).join('')}
</body>
</html>`;
        filename += '.html';
        break;
        
      case 'pdf':
        toast({
          title: 'PDF export',
          description: 'PDF export would be implemented with a library like jsPDF in a real application.',
        });
        return;
    }
    
    const blob = new Blob([content], { type: format === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export complete',
      description: `Your builds have been exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <Layout requireAuth>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="botSelect">Select AI Bot</Label>
                <Select value={bot} onValueChange={setBot}>
                  <SelectTrigger id="botSelect">
                    <SelectValue placeholder="Select a bot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Claude">Claude</SelectItem>
                    <SelectItem value="Google Gemini">Google Gemini</SelectItem>
                    <SelectItem value="Grok">Grok</SelectItem>
                    <SelectItem value="Perplexity">Perplexity</SelectItem>
                    <SelectItem value="Meta Llama">Meta Llama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userNeed">Describe what you want the chatbot to do</Label>
                <Textarea 
                  id="userNeed"
                  placeholder="Describe what you want the chatbot to do..."
                  value={userNeed}
                  onChange={(e) => setUserNeed(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>
              
              <Button 
                id="submitBuild"
                type="submit" 
                className="w-full bg-dovito hover:bg-dovito/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Building Prompt...
                  </>
                ) : (
                  'Build Prompt'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Past Builds</CardTitle>
            
            {builds.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBuilds('txt')}
                  disabled={selectedBuilds.length === 0}
                >
                  TXT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBuilds('csv')}
                  disabled={selectedBuilds.length === 0}
                >
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBuilds('html')}
                  disabled={selectedBuilds.length === 0}
                >
                  HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBuilds('pdf')}
                  disabled={selectedBuilds.length === 0}
                >
                  PDF
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {builds.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't created any prompts yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table id="pastBuildsList">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all builds"
                        />
                      </TableHead>
                      <TableHead>Bot</TableHead>
                      <TableHead className="hidden md:table-cell">Request</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {builds.map((build) => (
                      <TableRow key={build.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBuilds.includes(build.id)}
                            onCheckedChange={() => handleSelectBuild(build.id)}
                            aria-label={`Select build ${build.id}`}
                          />
                        </TableCell>
                        <TableCell>{build.bot}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                          {build.request}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                            build.status === 'Complete' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {build.status === 'Complete' ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                {build.status}
                              </>
                            ) : (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                {build.status}
                              </>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(build.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/result/${build.id}`)}
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Builder;
