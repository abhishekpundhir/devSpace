
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepository } from '@/contexts/RepositoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RepositoryForm from '@/components/RepositoryForm';
import { useToast } from "@/hooks/use-toast";

const NewRepository = () => {
  const { createRepository } = useRepository();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const languageColors: Record<string, string> = {
        'TypeScript': '#2b7489',
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'Go': '#00ADD8',
        'Ruby': '#701516',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'CSS': '#563d7c',
        'HTML': '#e34c26',
        'Other': '#ededed'
      };

      const newRepo = await createRepository({
        name: data.name,
        description: data.description || '',
        language: data.language,
        languageColor: languageColors[data.language] || '#ededed',
        stars: 0,
        forks: 0,
        lastUpdated: 'just now',
        isPrivate: data.isPrivate,
        files: [],
      });

      toast({
        title: "Repository created",
        description: `${newRepo.name} has been created successfully`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create repository",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a new repository</CardTitle>
          <CardDescription>
            A repository contains all your project's files, revision history, and collaborator discussions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepositoryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRepository;
