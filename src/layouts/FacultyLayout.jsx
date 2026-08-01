import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../faculty/components/Sidebar';
import Dashboard from '../faculty/components/Dashboard';
import PendingApprovals from '../faculty/components/PendingApprovals';
import VerifiedAchievements from '../faculty/components/VerifiedAchievements';
import DepartmentAnalytics from '../faculty/components/DepartmentAnalytics';
import Reports from '../faculty/components/Reports';
import Notifications from '../faculty/components/Notifications';
import VerifyStudentAchievement from '../faculty/components/VerifyStudentAchievement';
import StudentPortfolio from '../faculty/components/StudentPortfolio';
import FacultyProfile from '../faculty/components/FacultyProfile';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../faculty/faculty.css';

export default function FacultyLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    name: 'Loading...',
    role: 'Faculty',
    department: '...',
    avatar: '?'
  });
  const [facultyDeptId, setFacultyDeptId] = useState(null);
  
  const [toast, setToast] = useState(null);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [selectedPendingItem, setSelectedPendingItem] = useState(null);

  const [pendingList, setPendingList] = useState([]);
  const [verifiedList, setVerifiedList] = useState([]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchData = async () => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        navigate('/');
        return;
      }

      // Fetch Faculty Profile
      const { data: facultyData } = await supabase
        .from('faculty')
        .select('*, departments(name)')
        .eq('user_id', authUser.user.id)
        .single();

      if (facultyData) {
        setUser({
          name: `Dr. ${facultyData.first_name} ${facultyData.last_name}`,
          role: 'Faculty Member',
          department: facultyData.departments?.name || 'Department',
          avatar: facultyData.first_name[0] + facultyData.last_name[0],
          id: facultyData.user_id
        });
        setFacultyDeptId(facultyData.department_id);

        // Fetch achievements linked to this department
        const { data: achievements } = await supabase
          .from('achievements')
          .select(`
            id, title, description, status, created_at, student_id,
            category:achievement_categories(name, base_points),
            student:students!inner(first_name, last_name, register_number, department_id)
          `)
          .eq('student.department_id', facultyData.department_id)
          .order('created_at', { ascending: false });

        if (achievements) {
          const pending = achievements.filter(a => a.status === 'Pending').map(a => ({
            id: a.id,
            studentName: `${a.student.first_name} ${a.student.last_name}`,
            regNum: a.student.register_number,
            title: a.title,
            category: a.category?.name?.toUpperCase() || 'GENERAL',
            issuer: 'N/A',
            date: new Date(a.created_at).toISOString().split('T')[0],
            avatar: a.student.first_name[0] + (a.student.last_name?.[0] || ''),
            studentId: a.student_id,
            basePoints: a.category?.base_points || 0
          }));
          
          const verified = achievements.filter(a => a.status === 'Approved').map(a => ({
            id: a.id,
            studentName: `${a.student.first_name} ${a.student.last_name}`,
            title: a.title,
            category: a.category?.name || 'General',
            date: new Date(a.created_at).toLocaleDateString(),
            points: a.category?.base_points || 0,
            badge: 'Verified Badge',
            avatar: a.student.first_name[0] + (a.student.last_name?.[0] || '')
          }));

          setPendingList(pending);
          setVerifiedList(verified);
          setVerifiedCount(verified.length);
        }
      }
    } catch (err) {
      console.error('Error fetching faculty dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleVerificationAction = async (id, action, title, student, remarks = '') => {
    const originalItem = pendingList.find(item => item.id === id);
    if (!originalItem) return;

    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    
    // Update DB
    const { error } = await supabase
      .from('achievements')
      .update({ status: newStatus, faculty_remarks: remarks, approved_by: user.id })
      .eq('id', id);

    if (error) {
      console.error('Update error', error);
      alert('Failed to update status');
      return;
    }

    if (action === 'approve') {
      // Insert points
      await supabase.from('reward_points').insert([{
        student_id: originalItem.studentId,
        achievement_id: originalItem.id,
        points_awarded: originalItem.basePoints
      }]);
      
      // Update student's total_points
      const { data: studentData } = await supabase.from('students').select('total_points').eq('user_id', originalItem.studentId).single();
      if (studentData) {
        await supabase.from('students').update({ total_points: (studentData.total_points || 0) + originalItem.basePoints }).eq('user_id', originalItem.studentId);
      }
    }

    // Insert Notification for Student
    await supabase.from('notifications').insert([{
      user_id: originalItem.studentId,
      title: `Achievement ${newStatus}`,
      message: `Your achievement "${title}" has been ${newStatus.toLowerCase()}. ${remarks ? `Remarks: ${remarks}` : ''}`.trim()
    }]);

    // Refresh UI
    fetchData();
    setToast(`${newStatus} "${title}" by ${student}`);
  };

  let currentTab = 'dashboard';
  if (location.pathname.includes('approvals')) currentTab = 'approvals';
  if (location.pathname.includes('verified')) currentTab = 'verified';
  if (location.pathname.includes('students')) currentTab = 'students';
  if (location.pathname.includes('analytics')) currentTab = 'analytics';
  if (location.pathname.includes('reports')) currentTab = 'reports';
  if (location.pathname.includes('notifications')) currentTab = 'notifications';
  if (location.pathname.includes('profile')) currentTab = 'profile';

  const setCurrentTab = (tab) => {
    navigate(`/faculty-${tab}`);
  };

  const renderTabView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard pendingCount={pendingList.length} verifiedCount={verifiedCount} setCurrentTab={setCurrentTab} />;
      case 'approvals':
        if (selectedPendingItem) {
          return <VerifyStudentAchievement item={selectedPendingItem} onAction={handleVerificationAction} onBack={() => setSelectedPendingItem(null)} />;
        }
        return <PendingApprovals pendingList={pendingList} setPendingList={setPendingList} onAction={handleVerificationAction} onSelect={setSelectedPendingItem} user={user} />;
      case 'verified':
        return <VerifiedAchievements verifiedList={verifiedList} />;
      case 'students':
        return <StudentPortfolio />;
      case 'analytics':
        return <DepartmentAnalytics verifiedCount={verifiedCount} pendingCount={pendingList.length} />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <FacultyProfile user={user} />;
      default:
        return <Dashboard pendingCount={pendingList.length} verifiedCount={verifiedCount} setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="faculty-theme-wrapper">
      <div className="bg-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <main className="position-relative z-1">
        <div className="d-flex flex-column flex-lg-row min-vh-100">
          <div className="col-12 col-lg-3 col-xl-2 px-0">
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} user={user} onLogout={handleLogout} />
          </div>
          
          <div className="col-12 col-lg-9 col-xl-10 bg-light bg-opacity-25 px-3 px-sm-4 py-3 position-relative" style={{ minHeight: '100vh' }}>
            {toast && (
              <div className="position-fixed top-0 end-0 m-4 z-3 glass-panel p-3 d-flex align-items-center gap-2 border-start border-4 border-success fade-in-slide shadow-lg" style={{ maxWidth: '340px', background: 'rgba(255,255,255,0.98)' }}>
                <CheckCircle className="text-success flex-shrink-0" size={20} />
                <div>
                  <h6 className="mb-0 fs-7 fw-bold text-dark font-heading">Notification</h6>
                  <span className="text-muted fs-8 leading-sm d-block mt-0.5">{toast}</span>
                </div>
              </div>
            )}
            {renderTabView()}
          </div>
        </div>
      </main>
    </div>
  );
}
