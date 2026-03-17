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
import './Sidebar.css';

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
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="sidebar-icon" />
                {isOpen && (
                  <span className="sidebar-label">{item.label}</span>
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