
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import { FileItem } from '@/components/FileBrowser';

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  userId: string;
  isPrivate: boolean;
  files: FileItem[];
}

interface RepositoryContextType {
  repositories: Repository[];
  userRepositories: Repository[];
  createRepository: (repo: Omit<Repository, 'id' | 'userId'>) => Promise<Repository>;
  updateRepository: (id: string, data: Partial<Repository>) => Promise<Repository>;
  deleteRepository: (id: string) => Promise<void>;
  getRepository: (id: string) => Repository | undefined;
  addFile: (repoId: string, file: Omit<FileItem, 'id'>) => Promise<FileItem>;
  updateFile: (repoId: string, fileId: string, content: string) => Promise<void>;
  deleteFile: (repoId: string, fileId: string) => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

// Enhanced mock repositories with Indian themes and more detailed files
const initialRepositories: Repository[] = [
  {
    id: '1',
    name: 'bharat-ui-components',
    description: 'A collection of React components with Indian cultural themes and designs for modern web applications',
    language: 'TypeScript',
    languageColor: '#2b7489',
    stars: 128,
    forks: 23,
    lastUpdated: '2 days ago',
    userId: '1',
    isPrivate: false,
    files: [
      { id: '1-1', name: 'src', type: 'directory', lastCommit: 'a1b2c3d', lastCommitMessage: 'Add festivals component', lastUpdated: '2 days ago' },
      { id: '1-2', name: 'README.md', type: 'file', lastCommit: 'i7j8k9l', lastCommitMessage: 'Update documentation', lastUpdated: '3 days ago' },
      { id: '1-3', name: 'package.json', type: 'file', lastCommit: 'x7y8z9', lastCommitMessage: 'Add new dependencies', lastUpdated: '5 days ago' },
      { id: '1-4', name: 'FestivalCalendar.tsx', type: 'file', lastCommit: 'f5g6h7i', lastCommitMessage: 'Add Diwali celebration component', lastUpdated: '2 days ago' },
      { id: '1-5', name: 'HoliColorPicker.tsx', type: 'file', lastCommit: 'j8k9l0', lastCommitMessage: 'Fix color selection bug', lastUpdated: '4 days ago' },
    ]
  },
  {
    id: '2',
    name: 'indic-language-processor',
    description: 'A JavaScript library optimized for Indian language processing and localization with support for 22 official languages',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 95,
    forks: 18,
    lastUpdated: '5 days ago',
    userId: '1',
    isPrivate: false,
    files: [
      { id: '2-1', name: 'lib', type: 'directory', lastCommit: 'e4f5g6h', lastCommitMessage: 'Add Hindi transliteration', lastUpdated: '5 days ago' },
      { id: '2-2', name: 'package.json', type: 'file', lastCommit: 'm0n1o2p', lastCommitMessage: 'Bump dependencies', lastUpdated: '1 week ago' },
      { id: '2-3', name: 'index.js', type: 'file', lastCommit: 'q1r2s3t', lastCommitMessage: 'Fix module exports', lastUpdated: '2 weeks ago' },
      { id: '2-4', name: 'transliterate.js', type: 'file', lastCommit: 's7t8u9v', lastCommitMessage: 'Add Bengali transliteration', lastUpdated: '3 days ago' },
      { id: '2-5', name: 'dictionary.json', type: 'file', lastCommit: 'w1x2y3z', lastCommitMessage: 'Update Tamil vocabulary', lastUpdated: '1 week ago' },
    ]
  },
  {
    id: '3',
    name: 'desi-marketplace',
    description: 'An open-source e-commerce platform for promoting local Indian products and artisans with support for craft categories',
    language: 'TypeScript',
    languageColor: '#2b7489',
    stars: 207,
    forks: 42,
    lastUpdated: '1 day ago',
    userId: '2',
    isPrivate: false,
    files: [
      { id: '3-1', name: 'src', type: 'directory', lastCommit: 'h1i2j3k', lastCommitMessage: 'Add payment gateway integration', lastUpdated: '1 day ago' },
      { id: '3-2', name: 'public', type: 'directory', lastCommit: 'l4m5n6o', lastCommitMessage: 'Update assets', lastUpdated: '3 days ago' },
      { id: '3-3', name: 'README.md', type: 'file', lastCommit: 'p7q8r9s', lastCommitMessage: 'Add contributor guidelines', lastUpdated: '1 week ago' },
      { id: '3-4', name: 'ArtisanProfile.tsx', type: 'file', lastCommit: 'b3c4d5e', lastCommitMessage: 'Add verification badge', lastUpdated: '2 days ago' },
      { id: '3-5', name: 'ProductGallery.tsx', type: 'file', lastCommit: 'f6g7h8i', lastCommitMessage: 'Optimize image loading', lastUpdated: '4 days ago' },
    ]
  },
  {
    id: '4',
    name: 'ayush-health-api',
    description: 'REST API providing information on Ayurvedic herbs, treatments, and health practices with seasonal recommendations',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 156,
    forks: 32,
    lastUpdated: '3 days ago',
    userId: '3',
    isPrivate: false,
    files: [
      { id: '4-1', name: 'api', type: 'directory', lastCommit: 't1u2v3w', lastCommitMessage: 'Add new endpoints', lastUpdated: '3 days ago' },
      { id: '4-2', name: 'data', type: 'directory', lastCommit: 'x4y5z6a', lastCommitMessage: 'Update herb database', lastUpdated: '1 week ago' },
      { id: '4-3', name: 'requirements.txt', type: 'file', lastCommit: 'b7c8d9e', lastCommitMessage: 'Add new dependencies', lastUpdated: '2 weeks ago' },
      { id: '4-4', name: 'herbs_controller.py', type: 'file', lastCommit: 'j9k0l1m', lastCommitMessage: 'Add seasonal recommendations', lastUpdated: '5 days ago' },
      { id: '4-5', name: 'doshas_schema.py', type: 'file', lastCommit: 'n2o3p4q', lastCommitMessage: 'Fix validation rules', lastUpdated: '1 week ago' },
    ]
  },
  {
    id: '5',
    name: 'productivity-pomodoro',
    description: 'A time management application inspired by the concept of Indian tea breaks for improved productivity and work-life balance',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 83,
    forks: 15,
    lastUpdated: '6 days ago',
    userId: '1',
    isPrivate: true,
    files: [
      { id: '5-1', name: 'src', type: 'directory', lastCommit: 'f1g2h3i', lastCommitMessage: 'Add notification system', lastUpdated: '6 days ago' },
      { id: '5-2', name: 'styles', type: 'directory', lastCommit: 'j4k5l6m', lastCommitMessage: 'Update theme colors', lastUpdated: '1 week ago' },
      { id: '5-3', name: 'package.json', type: 'file', lastCommit: 'n7o8p9q', lastCommitMessage: 'Update dependencies', lastUpdated: '2 weeks ago' },
      { id: '5-4', name: 'BreakTimer.js', type: 'file', lastCommit: 'r5s6t7u', lastCommitMessage: 'Fix timer reset bug', lastUpdated: '1 week ago' },
      { id: '5-5', name: 'QuoteGenerator.js', type: 'file', lastCommit: 'v8w9x0y', lastCommitMessage: 'Add inspirational quotes API', lastUpdated: '8 days ago' },
    ]
  },
  {
    id: '6',
    name: 'classical-raga-player',
    description: 'A digital music player focused on classical Indian ragas with time-of-day recommendations and mood analysis',
    language: 'TypeScript',
    languageColor: '#2b7489',
    stars: 175,
    forks: 28,
    lastUpdated: '4 days ago',
    userId: '5',
    isPrivate: false,
    files: [
      { id: '6-1', name: 'src', type: 'directory', lastCommit: 'z1a2b3c', lastCommitMessage: 'Add time-based recommendations', lastUpdated: '4 days ago' },
      { id: '6-2', name: 'assets', type: 'directory', lastCommit: 'd4e5f6g', lastCommitMessage: 'Add instrument samples', lastUpdated: '1 week ago' },
      { id: '6-3', name: 'RagaPlayer.tsx', type: 'file', lastCommit: 'h7i8j9k', lastCommitMessage: 'Improve audio quality', lastUpdated: '5 days ago' },
      { id: '6-4', name: 'RagaDatabase.json', type: 'file', lastCommit: 'l0m1n2o', lastCommitMessage: 'Add Bhairavi raga details', lastUpdated: '1 week ago' },
      { id: '6-5', name: 'TaalVisualizer.tsx', type: 'file', lastCommit: 'p3q4r5s', lastCommitMessage: 'Add Teen Taal pattern', lastUpdated: '9 days ago' },
    ]
  },
  {
    id: '7',
    name: 'bharat-design-system',
    description: 'A comprehensive design system inspired by Indian art forms, textiles and architecture for modern web applications',
    language: 'CSS',
    languageColor: '#563d7c',
    stars: 312,
    forks: 67,
    lastUpdated: '2 days ago',
    userId: '6',
    isPrivate: false,
    files: [
      { id: '7-1', name: 'components', type: 'directory', lastCommit: 't6u7v8w', lastCommitMessage: 'Add Warli-inspired icons', lastUpdated: '2 days ago' },
      { id: '7-2', name: 'scss', type: 'directory', lastCommit: 'x9y0z1a', lastCommitMessage: 'Update color palette', lastUpdated: '5 days ago' },
      { id: '7-3', name: 'PatternLibrary.js', type: 'file', lastCommit: 'b2c3d4e', lastCommitMessage: 'Add Bandhani pattern generator', lastUpdated: '3 days ago' },
      { id: '7-4', name: 'ColorSchemes.json', type: 'file', lastCommit: 'f5g6h7i', lastCommitMessage: 'Add festival color themes', lastUpdated: '1 week ago' },
      { id: '7-5', name: 'Typography.css', type: 'file', lastCommit: 'j8k9l0m', lastCommitMessage: 'Add Devanagari font support', lastUpdated: '10 days ago' },
    ]
  },
  {
    id: '8',
    name: 'react-for-beginners',
    description: 'A beginner-friendly React tutorial series with examples relevant to Indian developers and businesses',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 429,
    forks: 98,
    lastUpdated: '1 day ago',
    userId: '3',
    isPrivate: false,
    files: [
      { id: '8-1', name: 'tutorials', type: 'directory', lastCommit: 'n1o2p3q', lastCommitMessage: 'Add chapter on context API', lastUpdated: '1 day ago' },
      { id: '8-2', name: 'examples', type: 'directory', lastCommit: 'r4s5t6u', lastCommitMessage: 'Add food delivery app example', lastUpdated: '3 days ago' },
      { id: '8-3', name: 'README.md', type: 'file', lastCommit: 'v7w8x9y', lastCommitMessage: 'Update course structure', lastUpdated: '4 days ago' },
      { id: '8-4', name: 'ComponentBasics.js', type: 'file', lastCommit: 'z0a1b2c', lastCommitMessage: 'Fix code examples', lastUpdated: '6 days ago' },
      { id: '8-5', name: 'HooksExplained.js', type: 'file', lastCommit: 'd3e4f5g', lastCommitMessage: 'Add useReducer examples', lastUpdated: '1 week ago' },
    ]
  },
  {
    id: '9',
    name: 'vedic-math-algorithms',
    description: 'Implementation of Vedic Mathematics techniques as modern algorithms for computational efficiency',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 267,
    forks: 53,
    lastUpdated: '5 days ago',
    userId: '7',
    isPrivate: false,
    files: [
      { id: '9-1', name: 'algorithms', type: 'directory', lastCommit: 'h6i7j8k', lastCommitMessage: 'Add Nikhilam method', lastUpdated: '5 days ago' },
      { id: '9-2', name: 'tests', type: 'directory', lastCommit: 'l9m0n1o', lastCommitMessage: 'Add benchmarks', lastUpdated: '1 week ago' },
      { id: '9-3', name: 'urdhva_tiryagbhyam.py', type: 'file', lastCommit: 'p2q3r4s', lastCommitMessage: 'Optimize multiplication algorithm', lastUpdated: '6 days ago' },
      { id: '9-4', name: 'ekadhikena.py', type: 'file', lastCommit: 't5u6v7w', lastCommitMessage: 'Fix edge cases', lastUpdated: '9 days ago' },
      { id: '9-5', name: 'benchmark_results.md', type: 'file', lastCommit: 'x8y9z0a', lastCommitMessage: 'Update performance comparison', lastUpdated: '2 weeks ago' },
    ]
  }
];

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>(initialRepositories);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get user repositories
  const userRepositories = repositories.filter(
    repo => user && repo.userId === user.id
  );

  const createRepository = async (repo: Omit<Repository, 'id' | 'userId'>): Promise<Repository> => {
    if (!user) throw new Error('You must be logged in to create a repository');

    const newRepo: Repository = {
      ...repo,
      id: `${repositories.length + 1}`,
      userId: user.id,
      files: [],
    };

    setRepositories([...repositories, newRepo]);
    
    toast({
      title: "Repository created",
      description: `${newRepo.name} has been created successfully`,
    });

    return newRepo;
  };

  const updateRepository = async (id: string, data: Partial<Repository>): Promise<Repository> => {
    const index = repositories.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Repository not found');
    }

    if (repositories[index].userId !== user?.id) {
      throw new Error('You do not have permission to update this repository');
    }

    const updatedRepo = { ...repositories[index], ...data };
    const updatedRepos = [...repositories];
    updatedRepos[index] = updatedRepo;
    
    setRepositories(updatedRepos);
    
    toast({
      title: "Repository updated",
      description: `${updatedRepo.name} has been updated successfully`,
    });

    return updatedRepo;
  };

  const deleteRepository = async (id: string): Promise<void> => {
    const repo = repositories.find(r => r.id === id);
    
    if (!repo) {
      throw new Error('Repository not found');
    }

    if (repo.userId !== user?.id) {
      throw new Error('You do not have permission to delete this repository');
    }

    setRepositories(repositories.filter(r => r.id !== id));
    
    toast({
      title: "Repository deleted",
      description: `${repo.name} has been deleted successfully`,
    });
  };

  const getRepository = (id: string): Repository | undefined => {
    return repositories.find(r => r.id === id);
  };

  const addFile = async (repoId: string, file: Omit<FileItem, 'id'>): Promise<FileItem> => {
    const index = repositories.findIndex(r => r.id === repoId);
    
    if (index === -1) {
      throw new Error('Repository not found');
    }

    if (repositories[index].userId !== user?.id) {
      throw new Error('You do not have permission to add files to this repository');
    }

    const newFile: FileItem = { 
      ...file,
      id: `${repoId}-${repositories[index].files.length + 1}`
    };
    
    const updatedRepo = { 
      ...repositories[index], 
      files: [...repositories[index].files, newFile],
      lastUpdated: 'just now'
    };
    
    const updatedRepos = [...repositories];
    updatedRepos[index] = updatedRepo;
    
    setRepositories(updatedRepos);
    
    toast({
      title: "File added",
      description: `${file.name} has been added to ${updatedRepo.name}`,
    });

    return newFile;
  };

  const updateFile = async (repoId: string, fileName: string, content: string): Promise<void> => {
    const repoIndex = repositories.findIndex(r => r.id === repoId);
    
    if (repoIndex === -1) {
      throw new Error('Repository not found');
    }

    if (repositories[repoIndex].userId !== user?.id) {
      throw new Error('You do not have permission to update files in this repository');
    }

    const fileIndex = repositories[repoIndex].files.findIndex(f => f.name === fileName);
    
    if (fileIndex === -1) {
      throw new Error('File not found');
    }

    const updatedFile = { 
      ...repositories[repoIndex].files[fileIndex],
      lastCommit: Math.random().toString(36).substring(2, 10),
      lastCommitMessage: 'Update file content',
      lastUpdated: 'just now'
    };
    
    const updatedFiles = [...repositories[repoIndex].files];
    updatedFiles[fileIndex] = updatedFile;
    
    const updatedRepo = { 
      ...repositories[repoIndex], 
      files: updatedFiles,
      lastUpdated: 'just now'
    };
    
    const updatedRepos = [...repositories];
    updatedRepos[repoIndex] = updatedRepo;
    
    setRepositories(updatedRepos);
    
    toast({
      title: "File updated",
      description: `${fileName} has been updated`,
    });
  };

  const deleteFile = async (repoId: string, fileName: string): Promise<void> => {
    const repoIndex = repositories.findIndex(r => r.id === repoId);
    
    if (repoIndex === -1) {
      throw new Error('Repository not found');
    }

    if (repositories[repoIndex].userId !== user?.id) {
      throw new Error('You do not have permission to delete files in this repository');
    }

    const fileIndex = repositories[repoIndex].files.findIndex(f => f.name === fileName);
    
    if (fileIndex === -1) {
      throw new Error('File not found');
    }

    const updatedFiles = repositories[repoIndex].files.filter(f => f.name !== fileName);
    
    const updatedRepo = { 
      ...repositories[repoIndex], 
      files: updatedFiles,
      lastUpdated: 'just now'
    };
    
    const updatedRepos = [...repositories];
    updatedRepos[repoIndex] = updatedRepo;
    
    setRepositories(updatedRepos);
    
    toast({
      title: "File deleted",
      description: `${fileName} has been deleted from ${updatedRepo.name}`,
    });
  };

  return (
    <RepositoryContext.Provider
      value={{
        repositories,
        userRepositories,
        createRepository,
        updateRepository,
        deleteRepository,
        getRepository,
        addFile,
        updateFile,
        deleteFile
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
};
