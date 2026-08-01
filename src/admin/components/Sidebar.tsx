import React from 'react';
import { 
  Award, Grid, Users, Building2, Trophy, Settings, LogOut, 
  GraduationCap, FileText, Settings2, CheckCircle, Bell, Megaphone
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminName: string;
  avatarUrl: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  adminName, 
  avatarUrl, 
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Grid size={18} /> },
    { id: 'students', label: 'Students', icon: <GraduationCap size={18} /> },
    { id: 'faculty', label: 'Faculty', icon: <Users size={18} /> },
    { id: 'departments', label: 'Departments', icon: <Building2 size={18} /> },
    { id: 'categories', label: 'Achievement Categories', icon: <Trophy size={18} /> },
    { id: 'reward-rules', label: 'Reward Point Rules', icon: <Settings2 size={18} /> },
    { id: 'verifications', label: 'Achievements', icon: <CheckCircle size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <div 
      className="glass-panel d-none d-lg-flex flex-column justify-content-between p-4 m-3 position-sticky"
      style={{
        width: '280px',
        height: 'calc(100vh - 2rem)',
        top: '1rem',
        zIndex: 100
      }}
    >
      <div>
        {/* Brand Logo Header */}
        <div className="d-flex align-items-center gap-3 mb-4 px-2">
          <div 
            className="d-flex align-items-center justify-content-center p-2 rounded-3 text-white" 
            style={{ background: 'var(--primary-brand)', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)' }}
          >
            <Award size={22} />
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
              AchievementPortal
            </h6>
            <span className="text-secondary" style={{ fontSize: '0.72rem' }}>Institutional Portal</span>
          </div>
        </div>

        {/* Dynamic Admin Profile Card in Sidebar header (like in image 2 & 4) */}
        <div 
          className="d-flex align-items-center gap-3 p-2.5 mb-4 rounded-3" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.18)', 
            border: '1px solid rgba(255, 255, 255, 0.15)',
            margin: '0 -4px'
          }}
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Admin Avatar" 
              className="rounded-circle object-cover"
              style={{ width: '40px', height: '40px', border: '2px solid rgba(37, 99, 235, 0.2)' }}
            />
          ) : (
            <div 
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" 
              style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}
            >
              {adminName ? adminName.slice(0, 2).toUpperCase() : 'AD'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="fw-bold mb-0 text-truncate text-primary" style={{ fontSize: '0.88rem' }}>
              {adminName || 'System Admin'}
            </p>
            <p className="text-secondary mb-0 text-truncate" style={{ fontSize: '0.72rem' }}>
              Institutional Portal
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="d-flex flex-column gap-1.5" style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn border-0 text-start w-100 py-2.5 px-3 rounded-3 d-flex align-items-center gap-3 transition ${isActive ? 'btn-glass-primary' : 'text-secondary hover-bg-light'}`}
                style={!isActive ? { background: 'transparent', fontSize: '0.9rem' } : { fontSize: '0.9rem' }}
              >
                {item.icon}
                <span className="fw-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile info & Logout */}
      <div className="pt-3 border-top border-light-subtle">
        <button 
          onClick={onLogout}
          className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 border-opacity-25"
          style={{ padding: '8px 10px', fontSize: '0.85rem' }}
        >
          <LogOut size={15} />
          <span>System Logout</span>
        </button>
      </div>
    </div>
  );
};
