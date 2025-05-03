
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RepositoryCard from '../components/RepositoryCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRepository } from '@/contexts/RepositoryContext';
import { Plus, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { repositories, userRepositories, deleteRepository } = useRepository();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  
  const reposToDisplay = user ? userRepositories : repositories;
  
  const filteredRepositories = reposToDisplay.filter(repo => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && repo.language.toLowerCase() === filterType.toLowerCase();
  });

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repository/${repoId}`);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };
  
  const handleCreateRepository = () => {
    navigate('/new-repository');
  };
  
  const handleDeleteRepository = async (id: string) => {
    try {
      await deleteRepository(id);
      setSelectedRepo(null);
    } catch (error) {
      console.error("Error deleting repository:", error);
    }
  };
  
  const languages = ['TypeScript', 'JavaScript', 'Python', 'Go', 'CSS', 'Java', 'C++'];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">
          {user ? 'Your Repositories' : 'All Repositories'}
        </h1>
        <Button className="flex items-center bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreateRepository}>
          <Plus className="w-4 h-4 mr-2" /> New Repository
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {languages.map(language => (
              <SelectItem key={language} value={language.toLowerCase()}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredRepositories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredRepositories.map((repo) => (
            <div key={repo.id} className="relative  rounded-md p-4 hover:bg-secondary/20 transition-colors">
              <RepositoryCard
                name={repo.name}
                description={repo.description}
                language={repo.language}
                languageColor={repo.languageColor}
                stars={repo.stars}
                forks={repo.forks}
                lastUpdated={repo.lastUpdated}
                onClick={() => handleRepositoryClick(repo.id)}
              />

              <div className="absolute top-4 right-4 flex space-x-2">
                {user && user.id === repo.userId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Repository</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {repo.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteRepository(repo.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center p-12 bg-secondary rounded-md">
          <p className="text-github-text">No repositories matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
