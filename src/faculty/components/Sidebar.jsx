import React from 'react';
import { 
  Grid, Clock, CheckSquare, GraduationCap, BarChart3, 
  FileSpreadsheet, Bell, User, LogOut, BookOpen, Award
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid },
    { id: 'approvals', label: 'Pending Approvals', icon: Clock },
    { id: 'verified', label: 'Verified Achievements', icon: CheckSquare },
    { id: 'students', label: 'Student Portfolio', icon: GraduationCap },
    { id: 'analytics', label: 'Department Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="sidebar-panel h-100">
      {/* Brand Header */}
      <div className="d-flex align-items-center gap-2 mb-4 px-2">
        <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <GraduationCap size={22} />
        </div>
        <div>
          <h5 className="mb-0 fw-bold text-dark font-heading lh-sm" style={{ fontSize: '1.05rem' }}>Faculty Portal</h5>
          <span className="text-muted fs-8">Higher Education Mgmt.</span>
        </div>
      </div>

      <div className="sidebar-divider m-0 mb-3"></div>

      {/* Navigation List */}
      <nav className="nav flex-column flex-grow-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-link nav-link-glass text-start w-100 ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="sidebar-divider"></div>

        {/* Profile (Mobile View Toggle / Sidebar detail) */}
        <div className="d-flex align-items-center gap-3 px-2 py-1 mb-2 d-none d-lg-flex">
          <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
            {user?.avatar || 'SJ'}
          </div>
          <div className="overflow-hidden">
            <h6 className="mb-0 text-dark font-heading fs-7 text-truncate">{user?.name || 'Dr. Sarah Jenkins'}</h6>
            <span className="text-muted fs-8 text-truncate d-block">{user?.role || 'Associate Professor'}</span>
          </div>
        </div>

        {/* Logout button */}
        <button
          className="nav-link nav-link-glass text-danger text-start w-100 mt-auto"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Version Tag */}
      <div className="text-muted fs-8 mt-3 ps-2">
        v1.0.4
      </div>
    </div>
  );
}
