import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  FileText, 
  Globe, 
  Map, 
  Settings,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/jobs', icon: Briefcase, label: 'Job Search' },
  { path: '/ats', icon: FileText, label: 'ATS Scoring' },
  { path: '/portfolio', icon: Globe, label: 'Portfolio' },
  { path: '/roadmaps', icon: Map, label: 'Roadmaps' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-md border-r border-gray-200 transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;