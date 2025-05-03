
import React, { useState, useEffect } from 'react';
import { GitMerge, GitBranch, User, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimelineEvent {
  id: number;
  type: 'commit' | 'merge' | 'branch' | 'contributor' | 'complexity';
  title: string;
  description: string;
  author: string;
  date: string;
  impact?: 'low' | 'medium' | 'high';
  codeChange?: {
    additions: number;
    deletions: number;
  };
}

interface ProjectEvolutionTimelineProps {
  repository: string;
}

const ProjectEvolutionTimeline: React.FC<ProjectEvolutionTimelineProps> = ({ repository }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch timeline data (mocked for now) with Indian contributor names
  useEffect(() => {
    // In a real app, this would fetch from an API
    setTimeout(() => {
      const mockEvents: TimelineEvent[] = [
        {
          id: 1,
          type: 'commit',
          title: 'Initial commit',
          description: 'Project setup and basic structure',
          author: 'arjundev',
          date: '28 days ago',
          impact: 'low',
          codeChange: {
            additions: 120,
            deletions: 0
          }
        },
        {
          id: 2,
          type: 'branch',
          title: 'Created feature-auth branch',
          description: 'New branch for authentication system',
          author: 'arjundev',
          date: '24 days ago'
        },
        {
          id: 3,
          type: 'contributor',
          title: 'New contributor added',
          description: 'priyapatel joined the project',
          author: 'system',
          date: '22 days ago'
        },
        {
          id: 4,
          type: 'commit',
          title: 'Implemented OAuth2 support',
          description: 'Added Google and GitHub OAuth2 providers',
          author: 'priyapatel',
          date: '21 days ago',
          impact: 'medium',
          codeChange: {
            additions: 340,
            deletions: 15
          }
        },
        {
          id: 5,
          type: 'merge',
          title: 'Merged feature-auth into main',
          description: 'Authentication system complete',
          author: 'arjundev',
          date: '18 days ago'
        },
        {
          id: 6,
          type: 'complexity',
          title: 'Code complexity reduced by 18%',
          description: 'Refactored authentication module',
          author: 'priyapatel',
          date: '15 days ago',
          impact: 'high'
        },
        {
          id: 7,
          type: 'commit',
          title: 'Added user profile features',
          description: 'User can now edit profile and preferences',
          author: 'priyapatel',
          date: '12 days ago',
          impact: 'medium',
          codeChange: {
            additions: 220,
            deletions: 45
          }
        },
        {
          id: 8,
          type: 'branch',
          title: 'Created feature-search branch',
          description: 'New branch for advanced search capabilities',
          author: 'vikramsingh',
          date: '10 days ago'
        },
        {
          id: 9,
          type: 'commit',
          title: 'Implemented search indexing',
          description: 'Added elasticsearch integration',
          author: 'vikramsingh',
          date: '8 days ago',
          impact: 'high',
          codeChange: {
            additions: 560,
            deletions: 23
          }
        },
        {
          id: 10,
          type: 'merge',
          title: 'Merged feature-search into main',
          description: 'Search capabilities complete',
          author: 'arjundev',
          date: '5 days ago'
        },
        {
          id: 11,
          type: 'contributor',
          title: 'New contributor added',
          description: 'ananyatech joined the project',
          author: 'system',
          date: '4 days ago'
        },
        {
          id: 12,
          type: 'commit',
          title: 'Added localization support',
          description: 'Support for multiple Indian languages',
          author: 'ananyatech',
          date: '3 days ago',
          impact: 'medium',
          codeChange: {
            additions: 345,
            deletions: 12
          }
        },
        {
          id: 13,
          type: 'complexity',
          title: 'Improved algorithm efficiency by 25%',
          description: 'Optimized search algorithm using Vedic techniques',
          author: 'kavitacoder',
          date: '2 days ago',
          impact: 'high'
        },
        {
          id: 14,
          type: 'commit',
          title: 'Added dark mode support',
          description: 'Theme inspired by traditional Indian art colors',
          author: 'rahulverma',
          date: '1 day ago',
          impact: 'low',
          codeChange: {
            additions: 180,
            deletions: 35
          }
        }
      ];
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1500);
  }, [repository]);

  const filteredEvents = activeFilter === "all" 
    ? events 
    : events.filter(event => event.type === activeFilter);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <div className="timeline-node"></div>;
      case 'merge':
        return <div className="timeline-node bg-purple-500 border-purple-500"></div>;
      case 'branch':
        return <div className="timeline-node bg-blue-500 border-blue-500"></div>;
      case 'contributor':
        return <div className="timeline-node bg-yellow-500 border-yellow-500"></div>;
      case 'complexity':
        return <div className="timeline-node bg-green-500 border-green-500"></div>;
      default:
        return <div className="timeline-node"></div>;
    }
  };

  const getImpactColor = (impact?: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getEventTypeTitle = (type: string) => {
    switch (type) {
      case 'commit':
        return 'Commit';
      case 'merge':
        return 'Merge';
      case 'branch':
        return 'Branch';
      case 'contributor':
        return 'Contributor';
      case 'complexity':
        return 'Complexity';
      default:
        return 'Event';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Evolution Timeline</CardTitle>
        <CardDescription>
          Track the key milestones, structural changes, and development patterns of this repository
        </CardDescription>
        <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="commit">Commits</TabsTrigger>
            <TabsTrigger value="merge">Merges</TabsTrigger>
            <TabsTrigger value="branch">Branches</TabsTrigger>
            <TabsTrigger value="contributor">Contributors</TabsTrigger>
            <TabsTrigger value="complexity">Complexity</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-4 flex-1 py-2 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative pl-10 pt-2">
            <div className="timeline-line"></div>
            <div className="space-y-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="relative animate-fade-in">
                  <div className="absolute -left-10 mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="mb-1 flex justify-between items-center">
                    <h4 className="text-sm font-medium">{event.title}</h4>
                    <span className="text-xs text-github-text">{event.date}</span>
                  </div>
                  <p className="text-sm text-github-text mb-2">{event.description}</p>
                  <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      {event.type === 'commit' && <Code className="w-3 h-3 mr-1" />}
                      {event.type === 'merge' && <GitMerge className="w-3 h-3 mr-1" />}
                      {event.type === 'branch' && <GitBranch className="w-3 h-3 mr-1" />}
                      {event.type === 'contributor' && <User className="w-3 h-3 mr-1" />}
                      {event.type === 'complexity' && <Code className="w-3 h-3 mr-1" />}
                      {getEventTypeTitle(event.type)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                      <User className="w-3 h-3 mr-1" />
                      {event.author}
                    </span>
                    {event.impact && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full ${getImpactColor(event.impact)}`}>
                        Impact: {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)}
                      </span>
                    )}
                    {event.codeChange && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-green-600 dark:text-green-400">+{event.codeChange.additions}</span>
                        <span className="mx-1">/</span>
                        <span className="text-red-600 dark:text-red-400">-{event.codeChange.deletions}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectEvolutionTimeline;
