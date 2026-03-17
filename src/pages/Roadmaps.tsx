import React, { useState } from 'react';
import { Map, Code, Database, Globe, CheckCircle, Play, ExternalLink, BookOpen } from 'lucide-react';

const Roadmaps: React.FC = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState('frontend');
  const [progress, setProgress] = useState<{[key: string]: boolean}>({});

  const roadmaps = {
    frontend: {
      title: 'Frontend Development',
      icon: Globe,
      color: 'orange',
      sections: [
        {
          title: 'HTML & CSS Basics',
          items: [
            'HTML Structure & Semantics',
            'CSS Selectors & Properties',
            'Flexbox & Grid Layout',
            'Responsive Design',
            'CSS Animations'
          ]
        },
        {
          title: 'JavaScript Fundamentals',
          items: [
            'Variables & Data Types',
            'Functions & Scope',
            'DOM Manipulation',
            'Event Handling',
            'Async JavaScript'
          ]
        },
        {
          title: 'React.js',
          items: [
            'Components & JSX',
            'State & Props',
            'Hooks',
            'Context API',
            'React Router'
          ]
        },
        {
          title: 'Advanced Topics',
          items: [
            'TypeScript',
            'State Management (Redux)',
            'Testing (Jest, RTL)',
            'Build Tools (Webpack, Vite)',
            'Performance Optimization'
          ]
        }
      ]
    },
    backend: {
      title: 'Backend Development',
      icon: Database,
      color: 'orange',
      sections: [
        {
          title: 'Server Fundamentals',
          items: [
            'HTTP Protocol',
            'RESTful APIs',
            'Authentication & Authorization',
            'Security Best Practices',
            'API Documentation'
          ]
        },
        {
          title: 'Node.js & Express',
          items: [
            'Node.js Runtime',
            'Express Framework',
            'Middleware',
            'Route Handling',
            'Error Handling'
          ]
        },
        {
          title: 'Databases',
          items: [
            'SQL Basics',
            'MongoDB',
            'Database Design',
            'ORMs & ODMs',
            'Database Optimization'
          ]
        },
        {
          title: 'DevOps & Deployment',
          items: [
            'Docker Basics',
            'CI/CD Pipelines',
            'Cloud Platforms (AWS)',
            'Monitoring & Logging',
            'Scaling Applications'
          ]
        }
      ]
    },
    dsa: {
      title: 'Data Structures & Algorithms',
      icon: Code,
      color: 'orange',
      sections: [
        {
          title: 'Basic Data Structures',
          items: [
            'Arrays & Strings',
            'Linked Lists',
            'Stacks & Queues',
            'Hash Tables',
            'Trees & Binary Trees'
          ]
        },
        {
          title: 'Advanced Data Structures',
          items: [
            'Binary Search Trees',
            'Heaps',
            'Graphs',
            'Tries',
            'Disjoint Set Union'
          ]
        },
        {
          title: 'Algorithms',
          items: [
            'Sorting Algorithms',
            'Searching Algorithms',
            'Two Pointers',
            'Sliding Window',
            'Recursion & Backtracking'
          ]
        },
        {
          title: 'Advanced Algorithms',
          items: [
            'Dynamic Programming',
            'Graph Algorithms',
            'Greedy Algorithms',
            'String Algorithms',
            'Mathematical Algorithms'
          ]
        }
      ]
    }
  };

  const toggleProgress = (item: string) => {
    setProgress(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const getCompletionPercentage = (roadmapKey: string) => {
    const roadmap = roadmaps[roadmapKey as keyof typeof roadmaps];
    const totalItems = roadmap.sections.reduce((acc, section) => acc + section.items.length, 0);
    const completedItems = roadmap.sections.reduce((acc, section) => 
      acc + section.items.filter(item => progress[item]).length, 0
    );
    return Math.round((completedItems / totalItems) * 100);
  };

  const currentRoadmap = roadmaps[selectedRoadmap as keyof typeof roadmaps];
  const Icon = currentRoadmap.icon;

  const dsaSheets = [
    { name: 'Striver A2Z DSA Sheet', problems: 191, url: '#', difficulty: 'Beginner to Advanced' },
    { name: 'LeetCode Top 150', problems: 150, url: '#', difficulty: 'Interview Focused' },
    { name: 'NeetCode 150', problems: 150, url: '#', difficulty: 'System Design + Coding' },
    { name: 'GFG Must Do Problems', problems: 450, url: '#', difficulty: 'All Levels' },
  ];

  const resources = [
    { title: 'JavaScript Complete Course', type: 'YouTube', duration: '12 hours', url: '#' },
    { title: 'React Official Documentation', type: 'Documentation', duration: 'Self-paced', url: '#' },
    { title: 'Node.js Crash Course', type: 'YouTube', duration: '3 hours', url: '#' },
    { title: 'System Design Interview', type: 'Book', duration: '200 pages', url: '#' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Learning Roadmaps</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Structured learning paths for your career growth</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Roadmap Selection */}
          <div className="tucf-card" style={{ padding: '16px' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Choose Roadmap</h2>
            <div className="space-y-2">
              {Object.entries(roadmaps).map(([key, roadmap]) => {
                const RoadmapIcon = roadmap.icon;
                const isSelected = selectedRoadmap === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedRoadmap(key)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isSelected
                        ? 'text-white'
                        : ''
                    }`}
                    style={isSelected ? { background: 'rgba(255,122,0,0.15)', color: 'var(--accent)' } : { color: 'var(--text-secondary)' }}
                  >
                    <RoadmapIcon className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium text-sm">{roadmap.title}</p>
                      <p className="text-xs" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {getCompletionPercentage(key)}% complete
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="tucf-card" style={{ padding: '16px' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Progress</h2>
            <div className="space-y-3">
              {Object.entries(roadmaps).map(([key, roadmap]) => {
                const percentage = getCompletionPercentage(key);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>{roadmap.title}</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{percentage}%</span>
                    </div>
                    <div className="tucf-progress-track mt-1">
                      <div
                        className="tucf-progress-fill transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Roadmap */}
          <div className="tucf-card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,122,0,0.14)' }}>
                <Icon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{currentRoadmap.title}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {getCompletionPercentage(selectedRoadmap)}% Complete • 
                  {currentRoadmap.sections.reduce((acc, section) => acc + section.items.length, 0)} Topics
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {currentRoadmap.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-l-4 pl-4" style={{ borderLeftColor: 'var(--border)' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer"
                        style={{ background: '#0f0f0f' }}
                        onClick={() => toggleProgress(item)}
                      >
                        <button
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            progress[item]
                              ? 'bg-orange-500 border-orange-500'
                              : 'border-[#303030] hover:border-orange-500'
                          }`}
                        >
                          {progress[item] && <CheckCircle className="h-3 w-3 text-white" />}
                        </button>
                        <span className={`text-sm ${progress[item] ? 'line-through' : ''}`} style={{ color: progress[item] ? '#6b7280' : 'var(--text-secondary)' }}>
                          {item}
                        </span>
                        <div className="flex-1"></div>
                        <button className="transition-colors" style={{ color: 'var(--accent)' }}>
                          <Play className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DSA Sheets */}
          {selectedRoadmap === 'dsa' && (
            <div className="tucf-card">
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
                <BookOpen className="h-5 w-5 mr-2" style={{ color: 'var(--accent)' }} />
                Popular DSA Sheets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dsaSheets.map((sheet, index) => (
                  <div key={index} className="p-4 rounded-lg transition-colors" style={{ background: '#0f0f0f', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{sheet.name}</h3>
                      <ExternalLink className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{sheet.problems} problems</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sheet.difficulty}</p>
                    <button className="mt-3 w-full py-2 text-white rounded-md transition-colors text-sm tucf-btn-primary">
                      Start Practicing
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="tucf-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
              <Play className="h-5 w-5 mr-2" style={{ color: 'var(--accent)' }} />
              Recommended Resources
            </h2>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg transition-colors" style={{ background: '#0f0f0f', border: '1px solid var(--border)' }}>
                  <div className="flex-1">
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{resource.title}</h3>
                    <div className="flex items-center space-x-4 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,122,0,0.12)', color: 'var(--accent)' }}>
                        {resource.type}
                      </span>
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                  <button className="transition-colors" style={{ color: 'var(--accent)' }}>
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;