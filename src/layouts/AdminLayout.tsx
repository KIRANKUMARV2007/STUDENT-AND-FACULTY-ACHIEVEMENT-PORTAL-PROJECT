import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Sidebar } from '../admin/components/Sidebar';
import { DashboardOverview } from '../admin/components/DashboardOverview';
import { Verifications } from '../admin/components/Verifications';
import { RewardRules } from '../admin/components/RewardRules';
import { AccountSettings } from '../admin/components/AccountSettings';
import { ManageFaculty } from '../admin/components/ManageFaculty';
import { ManageStudents } from '../admin/components/ManageStudents';
import { Reports } from '../admin/components/Reports';
import { Notifications } from '../admin/components/Notifications';
import { Departments } from '../admin/components/Departments';
import { AchievementCategories } from '../admin/components/AchievementCategories';
import '../admin/admin.css';

interface AdminProfile {
  name: string;
  id: string;
  email: string;
  avatar: string;
  bio: string;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Loading...',
    id: '...',
    email: '...',
    avatar: '',
    bio: 'Central Administration Oversight for Achievement and Merit Points. Managing institutional excellence across all departments.'
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) return;

      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', authUser.user.id)
        .single();

      if (adminData) {
        setAdminProfile({
          name: `${adminData.first_name} ${adminData.last_name}`,
          id: adminData.user_id,
          email: authUser.user.email || '',
          avatar: adminData.first_name[0] + adminData.last_name[0],
          bio: 'Central Administration Oversight for Achievement and Merit Points.'
        });
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    localStorage.removeItem('remember_device');
    navigate('/');
  };

  const handleSaveProfile = (name: string, id: string, email: string, avatar: string, bio: string) => {
    setAdminProfile({
      name, id, email, avatar, bio
    });
  };

  let activeTab = 'dashboard';
  if (location.pathname.includes('verifications')) activeTab = 'verifications';
  if (location.pathname.includes('reward-rules')) activeTab = 'reward-rules';
  if (location.pathname.includes('faculty')) activeTab = 'faculty';
  if (location.pathname.includes('students') || location.pathname.includes('users')) activeTab = 'students';
  if (location.pathname.includes('reports')) activeTab = 'reports';
  if (location.pathname.includes('departments')) activeTab = 'departments';
  if (location.pathname.includes('notifications')) activeTab = 'notifications';
  if (location.pathname.includes('settings')) activeTab = 'settings';
  if (location.pathname.includes('categories')) activeTab = 'categories';
  if (location.pathname.includes('announcements')) activeTab = 'announcements';

  const setActiveTab = (tab: string) => {
    navigate(`/admin-${tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'verifications': return <Verifications />;
      case 'reward-rules': return <RewardRules />;
      case 'faculty': return <ManageFaculty />;
      case 'students': return <ManageStudents />;
      case 'reports': return <Reports />;
      case 'departments': return <Departments />;
      case 'notifications': return <Notifications onReviewClick={() => setActiveTab('verifications')} />;
      case 'settings':
        return <AccountSettings initialName={adminProfile.name} initialId={adminProfile.id} initialAvatar={adminProfile.avatar} onSaveProfile={handleSaveProfile} />;
      case 'categories': return <AchievementCategories />;
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
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-theme-wrapper">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="d-flex min-vh-100 position-relative">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          adminName={adminProfile.name}
          avatarUrl={adminProfile.avatar}
          onLogout={handleLogout}
        />
        
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto" style={{ maxHeight: '100vh' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
