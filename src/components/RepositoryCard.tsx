
import React from 'react';
import { Star, GitFork } from 'lucide-react';

interface RepositoryCardProps {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  name,
  description,
  language,
  languageColor,
  stars,
  forks,
  lastUpdated,
  isSelected = false,
  onClick
}) => {
  return (
    <div 
      className={`repository-card cursor-pointer p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow ${isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-github-border'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">{name}</h3>
        <div className="flex space-x-3 text-github-text">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span className="text-sm">{stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span className="text-sm">{forks}</span>
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-github-text line-clamp-2">{description}</p>
      
      <div className="mt-4 flex items-center space-x-4 text-xs text-github-text">
        {language && (
          <div className="flex items-center space-x-1">
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{ backgroundColor: languageColor }} 
            />
            <span>{language}</span>
          </div>
        )}
        <span>Updated {lastUpdated}</span>
      </div>
    </div>
  );
};

export default RepositoryCard;
