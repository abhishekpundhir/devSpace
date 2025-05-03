
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileBrowser, { FileItem } from '../components/FileBrowser';
import ProjectEvolutionTimeline from '../components/ProjectEvolutionTimeline';
import CodeViewer from '../components/CodeViewer';
import { Eye, Star, GitFork, GitCommitHorizontal, Plus, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRepository } from '@/contexts/RepositoryContext';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const fileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.enum(["file", "directory"]),
});

const Repository = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('code');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { repositories, addFile } = useRepository();
  const { toast } = useToast();
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);

  // Find the repository based on the id parameter or use a default
  const repository = id 
    ? repositories.find(repo => repo.id === id)
    : repositories[0];  

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      name: "",
      type: "file",
    },
  });

  useEffect(() => {
    if (!repository) {
      navigate('/dashboard');
    }
  }, [repository, navigate]);

  const handleAddFile = async (data: z.infer<typeof fileSchema>) => {
    if (!repository) return;
    
    try {
      await addFile(repository.id, {
        name: data.name,
        type: data.type,
        lastCommit: Math.random().toString(36).substring(2, 10),
        lastCommitMessage: `Add ${data.type} ${data.name}`,
        lastUpdated: 'just now',
      });
      
      form.reset();
      setIsAddFileOpen(false);
      
      toast({
        title: "File added",
        description: `${data.name} has been added to the repository`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add file",
        variant: "destructive",
      });
    }
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
  };

  if (!repository) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <GitFork className="inline-block mr-2" />
            <span className="text-github-text">octocat /</span> {repository.name}
          </h1>
          <p className="text-github-text mt-2">{repository.description}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>Watch</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Star</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>Fork</span>
          </Button>
        </div>
      </div>

      <div className="bg-secondary rounded-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{ backgroundColor: repository.languageColor }}
            />
            <span className="text-sm">{repository.language}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span className="text-sm">{repository.stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span className="text-sm">{repository.forks}</span>
          </div>
        </div>
        <span className="text-sm text-github-text">Last updated {repository.lastUpdated}</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-github-border rounded-none p-0 h-auto">
          <TabsTrigger 
            value="code"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 py-2 rounded-none bg-transparent"
          >
            Code
          </TabsTrigger>
          <TabsTrigger 
            value="evolution"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 py-2 rounded-none bg-transparent"
          >
            Evolution Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="commits"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 py-2 rounded-none bg-transparent"
          >
            Commits
          </TabsTrigger>
          <TabsTrigger 
            value="issues"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 py-2 rounded-none bg-transparent"
          >
            Issues
          </TabsTrigger>
          <TabsTrigger 
            value="pull-requests"
            className="data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:rounded-none data-[state=active]:shadow-none px-4 py-2 rounded-none bg-transparent"
          >
            Pull Requests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="py-6">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs">main</Button>
              <span className="text-sm text-github-text">5 branches</span>
            </div>
            
            <Dialog open={isAddFileOpen} onOpenChange={setIsAddFileOpen}>
              <DialogTrigger asChild>
                <Button className="github-button">
                  <Plus className="w-4 h-4 mr-1" /> Add file
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add file</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddFile)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="file">File</SelectItem>
                              <SelectItem value="directory">Directory</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          {selectedFile ? (
            <div className="mb-4">
              <Button 
                variant="link" 
                onClick={() => setSelectedFile(null)} 
                className="p-0 mb-4"
              >
                ← Back to files
              </Button>
              <CodeViewer 
                repoId={repository.id} 
                fileName={selectedFile} 
                content="// This is a sample file content\n\nconst helloWorld = () => {\n  console.log('Hello, world!');\n};\n\nexport default helloWorld;" 
              />
            </div>
          ) : (
            <FileBrowser 
              files={repository.files} 
              onFileClick={handleFileClick}
            />
          )}
        </TabsContent>
        
        <TabsContent value="evolution" className="py-6">
          <ProjectEvolutionTimeline repository={repository.name} />
        </TabsContent>
        
        <TabsContent value="commits" className="py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start p-4 border-b border-github-border">
                <div className="mr-4">
                  <GitCommitHorizontal className="w-6 h-6 text-github-text" />
                </div>
                <div>
                  <h3 className="font-medium">Update documentation and examples</h3>
                  <p className="text-sm text-github-text">
                    Commit {Math.random().toString(36).substring(2, 10)} by octocat · {i} day{i !== 1 ? 's' : ''} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="issues" className="py-6">
          <div className="flex justify-center items-center p-12 text-github-text">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No issues found</p>
              <p>Issues you create will appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pull-requests" className="py-6">
          <div className="flex justify-center items-center p-12 text-github-text">
            <div className="text-center">
              <GitCommitHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No pull requests found</p>
              <p>Pull requests you create will appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Repository;
