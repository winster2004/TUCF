import React from 'react';
import { 
  Briefcase, 
  FileText, 
  Globe, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Jobs Applied', value: '24', icon: Briefcase, color: 'blue', change: '+12%' },
    { label: 'ATS Score Avg', value: '78%', icon: FileText, color: 'green', change: '+5%' },
    { label: 'Portfolio Views', value: '156', icon: Globe, color: 'purple', change: '+23%' },
    { label: 'Skills Progress', value: '67%', icon: TrendingUp, color: 'orange', change: '+15%' },
  ];

  const recentJobs = [
    { title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', posted: '2 hours ago', saved: true },
    { title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Bangalore', posted: '5 hours ago', saved: false },
    { title: 'React Developer', company: 'InnovateLabs', location: 'Hyderabad', posted: '1 day ago', saved: true },
  ];

  const todayTasks = [
    { task: 'Update resume with new project', completed: false },
    { task: 'Apply to 3 frontend positions', completed: true },
    { task: 'Complete DSA practice problems', completed: false },
    { task: 'Review portfolio feedback', completed: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's your career progress overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-orange-600">🔥 7 days</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-500',
            green: 'bg-green-500 text-green-500',
            purple: 'bg-purple-500 text-purple-500',
            orange: 'bg-orange-500 text-orange-500',
          };
          
          return (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} bg-opacity-20`}>
                  <Icon className={`h-6 w-6 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Job Matches</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</button>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-100/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    {job.saved && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                  <p className="text-gray-500 text-xs mt-1">{job.posted}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {todayTasks.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <button className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                </button>
                <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition-colors">
            Add New Task
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
            <Briefcase className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Find Jobs</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
            <FileText className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Check ATS Score</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
            <Globe className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Update Portfolio</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
            <TrendingUp className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">View Progress</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;