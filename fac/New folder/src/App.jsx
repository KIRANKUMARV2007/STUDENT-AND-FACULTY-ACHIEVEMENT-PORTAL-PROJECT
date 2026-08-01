import React, { useState, useEffect } from 'react';
import FacultyLogin from './components/FacultyLogin';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PendingApprovals from './components/PendingApprovals';
import VerifiedAchievements from './components/VerifiedAchievements';
import DepartmentAnalytics from './components/DepartmentAnalytics';
import Reports from './components/Reports';
import Notifications from './components/Notifications';
import VerifyStudentAchievement from './components/VerifyStudentAchievement';
import StudentPortfolio from './components/StudentPortfolio';
import FacultyProfile from './components/FacultyProfile';
import { CheckCircle } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Stats
  const [verifiedCount, setVerifiedCount] = useState(156);

  // Selected student item for verification details screen
  const [selectedPendingItem, setSelectedPendingItem] = useState(null);

  // Student Submissions in queue state
  const [pendingList, setPendingList] = useState([
    {
      id: 1,
      studentName: 'Alex Thompson',
      regNum: '2023CS0142',
      title: 'Advanced Neural Networks & Deep Learning',
      category: 'TECHNICAL CERTIFICATION',
      issuer: 'Coursera / DeepLearning.AI',
      date: '2026-07-28',
      avatar: 'AT'
    },
    {
      id: 2,
      studentName: 'Priya Sharma',
      regNum: '2022IT0089',
      title: 'First Runner Up: Smart City Hackathon',
      category: 'COMPETITION',
      issuer: 'IIT Delhi Innovate India',
      date: '2026-07-25',
      avatar: 'PS'
    },
    {
      id: 3,
      studentName: 'James Wilson',
      regNum: '2021EV0551',
      title: 'Paper Publication: Urban Ecology Vol 24',
      category: 'RESEARCH PUBLICATION',
      issuer: 'International Journal of Urban Planning',
      date: '2026-07-20',
      avatar: 'JW'
    }
  ]);

  // Verified Achievements State
  const [verifiedList, setVerifiedList] = useState([
    {
      id: 101,
      studentName: 'Elena Rodriguez',
      title: 'Advanced Algorithmic Research Presentation',
      category: 'Academic Research',
      date: 'Oct 24, 2023',
      points: 450,
      badge: 'Gold Scholar Badge',
      avatar: 'ER'
    },
    {
      id: 102,
      studentName: 'Jameson Wu',
      title: 'Community Outreach Coordinator Excellence',
      category: 'Leadership',
      date: 'Oct 21, 2023',
      points: 300,
      badge: 'Service Leader Badge',
      avatar: 'JW'
    },
    {
      id: 103,
      studentName: 'Sarah Chen',
      title: 'National Mathematics Olympiad Finalist',
      category: 'Competition',
      date: 'Oct 19, 2023',
      points: 750,
      badge: 'Elite Achiever Badge',
      avatar: 'SC'
    },
    {
      id: 104,
      studentName: 'Marcus Thorne',
      title: 'Software Engineering Internship - Microsoft',
      category: 'Professional',
      date: 'Oct 15, 2023',
      points: 500,
      badge: 'Career Ready Badge',
      avatar: 'MT'
    }
  ]);

  // Handle Toast popup timeouts
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLoginSuccess = (userData) => {
    setUser({
      ...userData,
      name: 'Dr. Sarah Montgomery',
      role: 'Senior Professor',
      department: 'Computer Science & Engineering',
      avatar: 'SM'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Student verification approval action
  const handleVerificationAction = (id, action, title, student) => {
    // Find item to carry over details
    const originalItem = pendingList.find(item => item.id === id);

    // Remove from queue
    setPendingList(pendingList.filter(item => item.id !== id));
    
    if (action === 'approve') {
      setVerifiedCount(verifiedCount + 1);

      // Determine appropriate points and tags
      let pts = 120;
      let badgeTag = 'Scholar Badge';
      if (originalItem?.category === 'COMPETITION') {
        pts = 250;
        badgeTag = 'Competition Badge';
      } else if (originalItem?.category === 'RESEARCH PUBLICATION') {
        pts = 400;
        badgeTag = 'Research Scholar';
      }

      // Add to verifiedList
      const newVerified = {
        id: Date.now(),
        studentName: student,
        title: title,
        category: originalItem?.category === 'TECHNICAL CERTIFICATION' ? 'Technical Certification' : originalItem?.category === 'COMPETITION' ? 'Competition' : 'Research Publication',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        points: pts,
        badge: badgeTag,
        avatar: student.split(' ').map(n => n[0]).join('')
      };

      setVerifiedList([newVerified, ...verifiedList]);
      setToast(`Approved "${title}" by ${student}`);
    } else {
      setToast(`Rejected "${title}" by ${student}`);
    }
  };

  // Render content based on sidebar selection
  const renderTabView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            pendingCount={pendingList.length} 
            verifiedCount={verifiedCount}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'approvals':
        if (selectedPendingItem) {
          return (
            <VerifyStudentAchievement 
              item={selectedPendingItem} 
              onAction={handleVerificationAction} 
              onBack={() => setSelectedPendingItem(null)} 
            />
          );
        }
        return (
          <PendingApprovals 
            pendingList={pendingList} 
            setPendingList={setPendingList}
            onAction={handleVerificationAction} 
            onSelect={setSelectedPendingItem}
          />
        );
      case 'verified':
        return (
          <VerifiedAchievements 
            verifiedList={verifiedList} 
          />
        );
      case 'students':
        return <StudentPortfolio />;
      case 'analytics':
        return (
          <DepartmentAnalytics 
            verifiedCount={verifiedCount} 
            pendingCount={pendingList.length} 
          />
        );
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <FacultyProfile />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Background blobs */}
      <div className="bg-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <main className="position-relative z-1">
        {!user ? (
          <FacultyLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="d-flex flex-column flex-lg-row min-vh-100">
            {/* Sidebar Navigation */}
            <div className="col-12 col-lg-3 col-xl-2 px-0">
              <Sidebar 
                currentTab={currentTab} 
                setCurrentTab={setCurrentTab} 
                user={user} 
                onLogout={handleLogout} 
              />
            </div>
            
            {/* Active Content view */}
            <div className="col-12 col-lg-9 col-xl-10 bg-light bg-opacity-25 px-3 px-sm-4 py-3 position-relative" style={{ minHeight: '100vh' }}>
              
              {/* Clean Toast Popups */}
              {toast && (
                <div 
                  className="position-fixed top-0 end-0 m-4 z-3 glass-panel p-3 d-flex align-items-center gap-2 border-start border-4 border-success fade-in-slide shadow-lg"
                  style={{ maxWidth: '340px', background: 'rgba(255,255,255,0.98)' }}
                >
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
        )}
      </main>
    </>
  );
}

export default App;
