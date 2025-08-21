import React, { useState } from 'react';
import { Map, Code, Database, Globe, CheckCircle, Play, ExternalLink, BookOpen } from 'lucide-react';

const Roadmaps: React.FC = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState('frontend');
  const [progress, setProgress] = useState<{[key: string]: boolean}>({});

  const roadmaps = {
    frontend: {
      title: 'Frontend Development',
      icon: Globe,
      color: 'blue',
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
      color: 'green',
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
      color: 'purple',
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
        <h1 className="text-3xl font-bold text-gray-900">Learning Roadmaps</h1>
        <p className="text-gray-600 mt-1">Structured learning paths for your career growth</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Roadmap Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3">Choose Roadmap</h2>
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
                        ? `bg-${roadmap.color}-600 text-white`
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <RoadmapIcon className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium text-sm">{roadmap.title}</p>
                      <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {getCompletionPercentage(key)}% complete
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3">Progress</h2>
            <div className="space-y-3">
              {Object.entries(roadmaps).map(([key, roadmap]) => {
                const percentage = getCompletionPercentage(key);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{roadmap.title}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`bg-${roadmap.color}-600 h-2 rounded-full transition-all`}
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
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 bg-${currentRoadmap.color}-100 rounded-lg`}>
                <Icon className={`h-6 w-6 text-${currentRoadmap.color}-600`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentRoadmap.title}</h2>
                <p className="text-gray-600">
                  {getCompletionPercentage(selectedRoadmap)}% Complete • 
                  {currentRoadmap.sections.reduce((acc, section) => acc + section.items.length, 0)} Topics
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {currentRoadmap.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-l-4 border-gray-200 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => toggleProgress(item)}
                      >
                        <button
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            progress[item]
                              ? `bg-${currentRoadmap.color}-600 border-${currentRoadmap.color}-600`
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {progress[item] && <CheckCircle className="h-3 w-3 text-white" />}
                        </button>
                        <span className={`text-sm ${progress[item] ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {item}
                        </span>
                        <div className="flex-1"></div>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
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
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                Popular DSA Sheets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dsaSheets.map((sheet, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{sheet.name}</h3>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{sheet.problems} problems</p>
                    <p className="text-xs text-gray-500">{sheet.difficulty}</p>
                    <button className="mt-3 w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                      Start Practicing
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Play className="h-5 w-5 mr-2 text-red-600" />
              Recommended Resources
            </h2>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {resource.type}
                      </span>
                      <span>{resource.duration}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
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