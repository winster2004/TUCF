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
import './Dashboard.css';

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
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back!</h1>
          <p className="dashboard-subtitle">Here's your career progress overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Current Streak</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>🔥 7 days</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div key={index} className="tucf-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <p className="text-sm font-medium mt-1" style={{ color: 'var(--accent)' }}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 122, 0, 0.14)' }}>
                  <Icon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="content-grid">
        <div className="content-wide tucf-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Job Matches</h2>
            <button className="text-sm font-medium" style={{ color: 'var(--accent)' }}>View all</button>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg transition-colors" style={{ background: '#0f0f0f', border: '1px solid var(--border)' }}>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                    {job.saved && <Star className="h-4 w-4 fill-current" style={{ color: 'var(--accent)' }} />}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{job.company} • {job.location}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{job.posted}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm tucf-btn-primary">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tucf-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Tasks</h2>
            <Calendar className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="space-y-3">
            {todayTasks.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <button className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? 'bg-orange-500 border-orange-500'
                    : 'border-[#2f2f2f] hover:border-orange-500'
                }`}>
                  {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                </button>
                <span
                  className={`text-sm ${item.completed ? 'line-through' : ''}`}
                  style={{ color: item.completed ? '#6b7280' : 'var(--text-secondary)' }}
                >
                  {item.task}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 rounded-md text-sm font-medium transition-colors" style={{ color: 'var(--accent)', border: '1px solid var(--border)', background: 'rgba(255,122,0,0.08)' }}>
            Add New Task
          </button>
        </div>
      </div>

      <div className="tucf-card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="quick-grid">
          <button className="rounded-lg p-4 transition-colors" style={{ background: 'rgba(255,122,0,0.12)' }}>
            <Briefcase className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Find Jobs</p>
          </button>
          <button className="rounded-lg p-4 transition-colors" style={{ background: 'rgba(255,122,0,0.12)' }}>
            <FileText className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Check ATS Score</p>
          </button>
          <button className="rounded-lg p-4 transition-colors" style={{ background: 'rgba(255,122,0,0.12)' }}>
            <Globe className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">Update Portfolio</p>
          </button>
          <button className="rounded-lg p-4 transition-colors" style={{ background: 'rgba(255,122,0,0.12)' }}>
            <TrendingUp className="h-6 w-6 mb-2" />
            <p className="text-sm font-medium">View Progress</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;