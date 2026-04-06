import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Briefcase,
  FileText, 
  Globe, 
  Map,
  Settings,
  FilePenLine,
  Target,
  Milestone,
  Bot,
  ScrollText,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/jobs', icon: Briefcase, label: 'Job Search' },
  { path: '/ats', icon: FileText, label: 'ATS Score Checker' },
  { path: '/portfolio', icon: Globe, label: 'Portfolio Builder' },
  { path: '/roadmaps', icon: Map, label: 'Roadmaps' },
  { path: '/roadmap-generator', icon: Milestone, label: 'Roadmap Planner' },
  { path: '/interview-prep', icon: Target, label: 'Interview Guide' },
  { path: '/ai-assistant', icon: Bot, label: 'AI Chat Bot' },
  { path: '/cover-letter', icon: FilePenLine, label: 'CV Generator' },
  { path: '/resume-builder', icon: ScrollText, label: 'Resume Builder' },
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
                title={item.label}
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
