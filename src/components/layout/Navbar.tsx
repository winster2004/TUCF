import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black border-b" style={{ borderBottomColor: 'var(--border)' }}>
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4 w-60">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg transition-colors md:block"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
              <span className="text-white font-bold text-sm">{userInitial}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{userName}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>69 md Landsorway</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;