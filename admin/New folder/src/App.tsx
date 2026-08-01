import { useState } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { Verifications } from './components/Verifications';
import { RewardRules } from './components/RewardRules';
import { AccountSettings } from './components/AccountSettings';
import { ManageFaculty } from './components/ManageFaculty';
import { ManageStudents } from './components/ManageStudents';
import { Reports } from './components/Reports';
import { Notifications } from './components/Notifications';
import { Departments } from './components/Departments';
import { AchievementCategories } from './components/AchievementCategories';

interface AdminProfile {
  name: string;
  id: string;
  email: string;
  avatar: string;
  bio: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Global Admin Profile State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'System Admin',
    id: 'ADM-99420-Z',
    email: 'admin@institution.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Central Administration Oversight for Achievement and Merit Points. Managing institutional excellence across all departments.'
  });

  const handleLoginSuccess = (admin: { admin_id: string; name?: string; email?: string }) => {
    setAdminProfile(prev => ({
      ...prev,
      id: admin.admin_id,
      name: admin.name || prev.name,
      email: admin.email || prev.email
    }));
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('remember_device');
    setIsLoggedIn(false);
  };

  const handleSaveProfile = (name: string, id: string, email: string, avatar: string, bio: string) => {
    setAdminProfile({
      name,
      id,
      email,
      avatar,
      bio
    });
  };

  // Rendering active panel
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'verifications':
        return <Verifications />;
      case 'reward-rules':
        return <RewardRules />;
      case 'faculty':
        return <ManageFaculty />;
      case 'students':
        return <ManageStudents />;
      case 'reports':
        return <Reports />;
      case 'departments':
        return <Departments />;
      case 'notifications':
        return <Notifications onReviewClick={() => setActiveTab('verifications')} />;
      case 'settings':
        return (
          <AccountSettings 
            initialName={adminProfile.name}
            initialId={adminProfile.id}
            initialAvatar={adminProfile.avatar}
            onSaveProfile={handleSaveProfile}
          />
        );
      case 'categories':
        return <AchievementCategories />;
      case 'announcements':
        return (
          <div className="glass-panel p-5 text-start fade-in-up">
            <h5 className="fw-bold mb-3 text-primary">Portal Announcements</h5>
            <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Broadcast university-wide achievement metrics or badge milestones.</p>
            <div className="glass-panel p-3.5" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <strong className="text-primary d-block mb-1">📢 Annual Merit Audit Scheduled</strong>
              <p className="text-secondary mb-0" style={{ fontSize: '0.8rem' }}>Verification logs will close on August 15th for the upcoming audit.</p>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      {/* Fixed Ambient Background Mesh Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="d-flex min-vh-100 position-relative">
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            adminName={adminProfile.name}
            avatarUrl={adminProfile.avatar}
            onLogout={handleLogout}
          />
          
          {/* Main Workspace Frame */}
          <main className="flex-grow-1 p-3 p-md-4 overflow-auto" style={{ maxHeight: '100vh' }}>
            {renderContent()}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
