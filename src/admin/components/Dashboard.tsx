import React, { useState, useEffect } from 'react';
import { 
  Award, LogOut, CheckCircle, XCircle, Search, Filter, Plus, 
  Grid, Users, FileText, Settings, Moon, Sun, Bell, ChevronRight, Eye, Trash2
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  role: 'Faculty' | 'Student';
  category: 'Research' | 'Academic' | 'Sports' | 'Extra-curricular' | 'Patents';
  title: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  description: string;
}

interface DashboardProps {
  adminId: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ adminId, onLogout }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'faculty' | 'students' | 'settings'>('overview');
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ACH-001',
      name: 'Dr. Aris Thorne',
      role: 'Faculty',
      category: 'Research',
      title: 'Quantum Computing Algorithms for Optimization',
      date: '2026-07-28',
      status: 'Pending',
      description: 'Published a high-impact paper in the International Journal of Quantum Computing detailing a 15% speedup in optimization problems using hybrid quantum-classical algorithms.'
    },
    {
      id: 'ACH-002',
      name: 'Sarah Jenkins',
      role: 'Student',
      category: 'Sports',
      title: 'Gold Medal in Inter-University Swimming',
      date: '2026-07-25',
      status: 'Approved',
      description: 'Secured first place and broke the university record in the 200m individual medley at the Annual State Inter-University Aquatics Meet.'
    },
    {
      id: 'ACH-003',
      name: 'David Kim',
      role: 'Student',
      category: 'Academic',
      title: 'First Place in National Mathematics Olympiad',
      date: '2026-07-22',
      status: 'Pending',
      description: 'Competed against 400 top students nationwide to win the gold trophy and a research grant of $5,000 in the college-level category.'
    },
    {
      id: 'ACH-004',
      name: 'Prof. Clara Oswald',
      role: 'Faculty',
      category: 'Patents',
      title: 'AI-Powered Smart Grid Energy Distribution System',
      date: '2026-07-15',
      status: 'Approved',
      description: 'Successfully filed and registered a utility patent for a decentralized hardware sensor mesh that balances grid load dynamically using machine learning.'
    },
    {
      id: 'ACH-005',
      name: 'Emma Watson',
      role: 'Student',
      category: 'Extra-curricular',
      title: 'Best Delegate Award at Harvard MUN',
      date: '2026-07-10',
      status: 'Rejected',
      description: 'Represented France in the UN Security Council simulation and secured the top delegate citation, but the activity falls outside standard academic tracking parameters.'
    },
    {
      id: 'ACH-006',
      name: 'Dr. James Moriarty',
      role: 'Faculty',
      category: 'Research',
      title: 'Autonomous Navigation in Uncharted Terrain',
      date: '2026-07-30',
      status: 'Pending',
      description: 'Completed field tests for lidar-based path planning algorithms in dense forest settings. Draft submitted to IEEE Robotics and Automation Letters.'
    }
  ]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Faculty' | 'Student'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Research' | 'Academic' | 'Sports' | 'Extra-curricular' | 'Patents'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Modal / Detailed View state
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Add Achievement Modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAchName, setNewAchName] = useState('');
  const [newAchRole, setNewAchRole] = useState<'Faculty' | 'Student'>('Student');
  const [newAchCategory, setNewAchCategory] = useState<'Research' | 'Academic' | 'Sports' | 'Extra-curricular' | 'Patents'>('Academic');
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');

  // Toggle Theme helper
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Compute stat counters
  const totalSubmissions = achievements.length;
  const pendingCount = achievements.filter(a => a.status === 'Pending').length;
  const approvedCount = achievements.filter(a => a.status === 'Approved').length;
  const rejectedCount = achievements.filter(a => a.status === 'Rejected').length;

  // Filter achievements
  const filteredAchievements = achievements.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || a.role === roleFilter;
    const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesRole && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (selectedAchievement && selectedAchievement.id === id) {
      setSelectedAchievement(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchName || !newAchTitle) {
      alert('Please fill out the name and title.');
      return;
    }
    const newId = `ACH-0${achievements.length + 1}`;
    const newAch: Achievement = {
      id: newId,
      name: newAchName,
      role: newAchRole,
      category: newAchCategory,
      title: newAchTitle,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: newAchDesc || 'No detailed description provided.'
    };
    setAchievements([newAch, ...achievements]);
    setShowAddForm(false);
    // Reset Form
    setNewAchName('');
    setNewAchTitle('');
    setNewAchDesc('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setAchievements(prev => prev.filter(a => a.id !== id));
      if (selectedAchievement?.id === id) setSelectedAchievement(null);
    }
  };

  return (
    <div className="d-flex min-vh-100 position-relative">
      
      {/* Light/Dark Toggle */}
      <button className="theme-switch-btn" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Floating Blobs (Background) */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Sidebar Navigation */}
      <div 
        className="glass-panel d-none d-lg-flex flex-column justify-content-between p-4 m-3 position-sticky"
        style={{
          width: '280px',
          height: 'calc(100vh - 2rem)',
          top: '1rem',
          zIndex: 100,
          background: theme === 'light' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.55)'
        }}
      >
        <div>
          {/* Logo */}
          <div className="d-flex align-items-center gap-3 mb-5 px-2">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center">
              <Award size={24} />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-primary">AdminPortal</h5>
              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Achievement Suite</span>
            </div>
          </div>

          {/* Nav list */}
          <nav className="d-flex flex-column gap-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`btn border-0 text-start w-100 py-3 px-3 rounded-3 d-flex align-items-center gap-3 transition ${activeTab === 'overview' ? 'btn-glass-primary' : 'text-secondary hover-bg-light'}`}
              style={activeTab !== 'overview' ? { background: 'transparent' } : {}}
            >
              <Grid size={18} />
              <span className="fw-semibold">Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab('achievements')}
              className={`btn border-0 text-start w-100 py-3 px-3 rounded-3 d-flex align-items-center gap-3 transition ${activeTab === 'achievements' ? 'btn-glass-primary' : 'text-secondary hover-bg-light'}`}
              style={activeTab !== 'achievements' ? { background: 'transparent' } : {}}
            >
              <FileText size={18} />
              <span className="fw-semibold">Verifications</span>
            </button>
            <button 
              onClick={() => setActiveTab('faculty')}
              className={`btn border-0 text-start w-100 py-3 px-3 rounded-3 d-flex align-items-center gap-3 transition ${activeTab === 'faculty' ? 'btn-glass-primary' : 'text-secondary hover-bg-light'}`}
              style={activeTab !== 'faculty' ? { background: 'transparent' } : {}}
            >
              <Users size={18} />
              <span className="fw-semibold">Faculty Logs</span>
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`btn border-0 text-start w-100 py-3 px-3 rounded-3 d-flex align-items-center gap-3 transition ${activeTab === 'students' ? 'btn-glass-primary' : 'text-secondary hover-bg-light'}`}
              style={activeTab !== 'students' ? { background: 'transparent' } : {}}
            >
              <Users size={18} />
              <span className="fw-semibold">Student Logs</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`btn border-0 text-start w-100 py-3 px-3 rounded-3 d-flex align-items-center gap-3 transition ${activeTab === 'settings' ? 'btn-glass-primary' : 'text-secondary hover-bg-light'}`}
              style={activeTab !== 'settings' ? { background: 'transparent' } : {}}
            >
              <Settings size={18} />
              <span className="fw-semibold">Settings</span>
            </button>
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="pt-4 border-top border-light-subtle">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
              {adminId ? adminId.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{adminId || 'System Admin'}</p>
              <p className="text-secondary mb-0 text-truncate" style={{ fontSize: '0.75rem' }}>admin@achievement.edu</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 border-opacity-25"
            style={{ padding: '10px' }}
          >
            <LogOut size={16} />
            <span>Logout Portal</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <main className="flex-grow-1 p-3 p-md-4 overflow-auto" style={{ maxHeight: '100vh' }}>
        
        {/* Header */}
        <header className="glass-panel p-3 mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="d-lg-none bg-primary text-white p-2 rounded-3 d-flex align-items-center me-2">
              <Award size={20} />
            </span>
            <div>
              <h5 className="fw-bold mb-0">Faculty & Student Achievements</h5>
              <span className="text-secondary d-none d-sm-inline" style={{ fontSize: '0.8rem' }}>Institutional Verification Dashboard</span>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            {/* Search Input on Header */}
            <div className="position-relative d-none d-md-block" style={{ width: '240px' }}>
              <input 
                type="text" 
                className="form-control bg-light border-0" 
                placeholder="Search portal records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px', borderRadius: '10px', fontSize: '0.85rem' }}
              />
              <Search size={14} className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {/* Quick Notify Bell */}
            <button className="btn btn-light position-relative p-2 rounded-3 border-0">
              <Bell size={18} />
              {pendingCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Mobile Logout trigger */}
            <button onClick={onLogout} className="btn btn-outline-danger d-lg-none p-2 rounded-3 border-0">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Tabs Switcher */}
        
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="fade-in-up">
            
            {/* Metric Blocks Grid */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="glass-panel glass-panel-hover p-4 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Total Applications</span>
                    <h3 className="fw-bold mb-0">{totalSubmissions}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3">
                    <FileText size={24} />
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="glass-panel glass-panel-hover p-4 d-flex align-items-center justify-content-between" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <div>
                    <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Pending Review</span>
                    <h3 className="fw-bold mb-0 text-warning">{pendingCount}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3">
                    <Award size={24} />
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="glass-panel glass-panel-hover p-4 d-flex align-items-center justify-content-between" style={{ borderLeft: '4px solid #10b981' }}>
                  <div>
                    <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Approved Submissions</span>
                    <h3 className="fw-bold mb-0 text-success">{approvedCount}</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 text-success p-3 rounded-3">
                    <CheckCircle size={24} />
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="glass-panel glass-panel-hover p-4 d-flex align-items-center justify-content-between" style={{ borderLeft: '4px solid #ef4444' }}>
                  <div>
                    <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '0.85rem' }}>Rejected Requests</span>
                    <h3 className="fw-bold mb-0 text-danger">{rejectedCount}</h3>
                  </div>
                  <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-3">
                    <XCircle size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Split Panel: Analytics chart + Recent submissions */}
            <div className="row g-4 mb-4">
              {/* Analytics Graph */}
              <div className="col-12 col-xl-7">
                <div className="glass-panel p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h6 className="fw-bold mb-0">Submission Analytics</h6>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Volume trends over last 6 months</span>
                    </div>
                    <div className="glass-badge">
                      <span className="fw-bold">Active Year: 2026</span>
                    </div>
                  </div>
                  
                  {/* custom SVG chart */}
                  <div className="d-flex align-items-end justify-content-between w-100 pt-3" style={{ height: '220px' }}>
                    <div className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                      <div className="w-50 rounded-top" style={{ height: '35%', background: 'linear-gradient(180deg, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.1) 100%)', boxShadow: '0 -2px 10px rgba(37,99,235,0.1)' }}></div>
                      <span className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>Feb</span>
                    </div>
                    <div className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                      <div className="w-50 rounded-top" style={{ height: '50%', background: 'linear-gradient(180deg, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.1) 100%)' }}></div>
                      <span className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>Mar</span>
                    </div>
                    <div className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                      <div className="w-50 rounded-top" style={{ height: '42%', background: 'linear-gradient(180deg, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.1) 100%)' }}></div>
                      <span className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>Apr</span>
                    </div>
                    <div className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                      <div className="w-50 rounded-top" style={{ height: '70%', background: 'linear-gradient(180deg, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.1) 100%)' }}></div>
                      <span className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>May</span>
                    </div>
                    <div className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                      <div className="w-50 rounded-top" style={{ height: '85%', background: 'linear-gradient(180deg, rgba(37,99,235,0.7) 0%, rgba(37,99,235,0.1) 100%)' }}></div>
                      <span className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>Jun</span>
                    </div>
                    <div className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                      <div className="w-50 rounded-top" style={{ height: '95%', background: 'linear-gradient(180deg, rgba(37,99,235,0.85) 0%, rgba(37,99,235,0.15) 100%)', border: '1px solid rgba(255, 255, 255, 0.4)' }}></div>
                      <span className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>Jul</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions / Mini Log */}
              <div className="col-12 col-xl-5">
                <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-bold mb-3">Quick Controls</h6>
                    <div className="d-grid gap-2 mb-3">
                      <button 
                        onClick={() => setShowAddForm(true)}
                        className="btn-glass-primary w-100 py-3"
                      >
                        <Plus size={16} />
                        <span>Log Achievement</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('achievements')} 
                        className="btn-glass-outline w-100 py-3"
                      >
                        <span>Review Queue ({pendingCount})</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="fw-bold mb-2" style={{ fontSize: '0.85rem' }}>Pending System Checklists</h6>
                    <ul className="list-unstyled mb-0" style={{ fontSize: '0.8rem' }}>
                      <li className="d-flex align-items-start gap-2 mb-2 text-secondary">
                        <span className="text-warning">●</span>
                        <span>Verify Dr. Thorne's IEEE research publishing credentials.</span>
                      </li>
                      <li className="d-flex align-items-start gap-2 mb-2 text-secondary">
                        <span className="text-warning">●</span>
                        <span>Validate Olympiad certificate matching criteria for David Kim.</span>
                      </li>
                      <li className="d-flex align-items-start gap-2 text-secondary">
                        <span className="text-success">✔</span>
                        <span>Archived Q2 achievements reporting logs.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Queue Section (Embedded) */}
            <div className="glass-panel p-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <div>
                  <h6 className="fw-bold mb-0">Awaiting Portal Review</h6>
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Action required on submissions</span>
                </div>
                <button onClick={() => setActiveTab('achievements')} className="btn btn-sm btn-glass-outline">
                  <span>View All Queue</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {achievements.filter(a => a.status === 'Pending').length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-secondary mb-0">No pending achievements left to verify! Excellent work.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Applicant</th>
                        <th>Role</th>
                        <th>Category</th>
                        <th>Title</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achievements.filter(a => a.status === 'Pending').map((a) => (
                        <tr key={a.id}>
                          <td className="fw-bold" style={{ color: 'var(--primary-brand)' }}>{a.id}</td>
                          <td>
                            <div className="fw-semibold">{a.name}</div>
                          </td>
                          <td>
                            <span className={`badge ${a.role === 'Faculty' ? 'bg-primary' : 'bg-info'} bg-opacity-10 text-primary border-0`} style={{ fontSize: '0.75rem' }}>{a.role}</span>
                          </td>
                          <td>{a.category}</td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>{a.title}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button 
                                onClick={() => setSelectedAchievement(a)}
                                className="btn btn-sm btn-glass-outline p-2 d-flex align-items-center"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(a.id, 'Approved')}
                                className="btn btn-sm btn-success p-2 d-flex align-items-center text-white border-0"
                                title="Approve"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(a.id, 'Rejected')}
                                className="btn btn-sm btn-danger p-2 d-flex align-items-center text-white border-0"
                                title="Reject"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verifications Tab Content */}
        {activeTab === 'achievements' && (
          <div className="glass-panel p-4 fade-in-up">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1">Achievement Verification Center</h5>
                <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Verify and manage faculty and student records</span>
              </div>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-glass-primary"
              >
                <Plus size={16} />
                <span>Log New Achievement</span>
              </button>
            </div>

            {/* Filter Tool Bar */}
            <div className="glass-panel p-3 mb-4" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
              <div className="row g-3 align-items-center">
                <div className="col-12 col-md-4">
                  <div className="position-relative">
                    <input 
                      type="text" 
                      className="glass-input" 
                      placeholder="Search name, title, code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '32px' }}
                    />
                    <Search size={14} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="col-6 col-md-2">
                  <div className="d-flex align-items-center gap-2">
                    <Filter size={14} className="text-secondary" />
                    <select 
                      className="form-select bg-light border-0"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as any)}
                      style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                    >
                      <option value="All">All Roles</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                <div className="col-6 col-md-2">
                  <select 
                    className="form-select bg-light border-0"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Research">Research</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Extra-curricular">Extra-curricular</option>
                    <option value="Patents">Patents</option>
                  </select>
                </div>

                <div className="col-12 col-md-2">
                  <select 
                    className="form-select bg-light border-0"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="col-12 col-md-2 text-md-end">
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('All');
                      setCategoryFilter('All');
                      setStatusFilter('All');
                    }}
                    className="btn btn-link text-decoration-none text-muted p-0"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAchievements.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-secondary">
                        No achievement records matching criteria found.
                      </td>
                    </tr>
                  ) : (
                    filteredAchievements.map(a => (
                      <tr key={a.id}>
                        <td className="fw-bold" style={{ color: 'var(--primary-brand)' }}>{a.id}</td>
                        <td>{a.name}</td>
                        <td>
                          <span className={`badge ${a.role === 'Faculty' ? 'bg-primary' : 'bg-info'} bg-opacity-10 text-primary border-0`} style={{ fontSize: '0.75rem' }}>{a.role}</span>
                        </td>
                        <td>{a.category}</td>
                        <td className="text-truncate" style={{ maxWidth: '240px' }} title={a.title}>{a.title}</td>
                        <td>
                          <span className={`glass-badge ${a.status === 'Approved' ? 'glass-badge-success' : a.status === 'Rejected' ? 'glass-badge-danger' : 'glass-badge-warning'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              onClick={() => setSelectedAchievement(a)}
                              className="btn btn-sm btn-glass-outline p-2"
                              title="Details"
                            >
                              <Eye size={12} />
                            </button>
                            {a.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(a.id, 'Approved')}
                                  className="btn btn-sm btn-success p-2 text-white border-0"
                                  title="Approve"
                                >
                                  <CheckCircle size={12} />
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(a.id, 'Rejected')}
                                  className="btn btn-sm btn-danger p-2 text-white border-0"
                                  title="Reject"
                                >
                                  <XCircle size={12} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDelete(a.id)}
                              className="btn btn-sm btn-outline-danger p-2 border-0"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Faculty Logs Tab Content */}
        {activeTab === 'faculty' && (
          <div className="glass-panel p-4 fade-in-up">
            <h5 className="fw-bold mb-1">Faculty Achievement Logs</h5>
            <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Academic publications, patents, and government grants ledger</p>
            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Faculty Member</th>
                    <th>Category</th>
                    <th>Research / Project Title</th>
                    <th>Date Logged</th>
                    <th>Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.filter(a => a.role === 'Faculty').map(a => (
                    <tr key={a.id}>
                      <td className="fw-bold" style={{ color: 'var(--primary-brand)' }}>{a.id}</td>
                      <td className="fw-semibold">{a.name}</td>
                      <td>{a.category}</td>
                      <td>{a.title}</td>
                      <td>{a.date}</td>
                      <td>
                        <span className={`glass-badge ${a.status === 'Approved' ? 'glass-badge-success' : a.status === 'Rejected' ? 'glass-badge-danger' : 'glass-badge-warning'}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Logs Tab Content */}
        {activeTab === 'students' && (
          <div className="glass-panel p-4 fade-in-up">
            <h5 className="fw-bold mb-1">Student Achievement Logs</h5>
            <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Sports championships, Olympiads, and hackathons ledger</p>
            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Category</th>
                    <th>Competition / Trophy Title</th>
                    <th>Date Logged</th>
                    <th>Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.filter(a => a.role === 'Student').map(a => (
                    <tr key={a.id}>
                      <td className="fw-bold" style={{ color: 'var(--primary-brand)' }}>{a.id}</td>
                      <td className="fw-semibold">{a.name}</td>
                      <td>{a.category}</td>
                      <td>{a.title}</td>
                      <td>{a.date}</td>
                      <td>
                        <span className={`glass-badge ${a.status === 'Approved' ? 'glass-badge-success' : a.status === 'Rejected' ? 'glass-badge-danger' : 'glass-badge-warning'}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-4 fade-in-up">
            <h5 className="fw-bold mb-4">Portal System Settings</h5>
            <div className="row g-4" style={{ maxWidth: '600px' }}>
              <div className="col-12 text-start">
                <label className="form-label fw-semibold text-secondary">Verification Threshold</label>
                <select className="form-select bg-light border-0 py-2" style={{ borderRadius: '10px' }}>
                  <option>Require Single Admin Approval (Standard)</option>
                  <option>Require Dual Admin Verification</option>
                  <option>Academic Board Oversight</option>
                </select>
              </div>
              <div className="col-12 text-start">
                <label className="form-label fw-semibold text-secondary">Accepted Upload Document Format</label>
                <div className="d-flex flex-wrap gap-2 pt-1">
                  <span className="badge bg-secondary p-2">PDF (Strict)</span>
                  <span className="badge bg-secondary p-2">PNG / JPG</span>
                  <span className="badge bg-secondary p-2">DOCX</span>
                </div>
              </div>
              <div className="col-12 text-start">
                <div className="form-check form-switch pt-2">
                  <input className="form-check-input" type="checkbox" role="switch" id="notifyEmail" defaultChecked />
                  <label className="form-check-label fw-semibold text-secondary ms-2" htmlFor="notifyEmail">Email digest notification to Dean upon verification completion</label>
                </div>
              </div>
              <div className="col-12 pt-3">
                <button className="btn-glass-primary" onClick={() => alert('Settings simulation saved successfully.')}>
                  <span>Save Portal Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Details View Glass Modal */}
      {selectedAchievement && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ 
            zIndex: 1000, 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="glass-panel p-4 p-md-5 w-100 fade-in-up" style={{ maxWidth: '600px', background: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.9)' }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <span className="glass-badge mb-2">{selectedAchievement.id}</span>
                <h4 className="fw-bold mb-1 text-primary">{selectedAchievement.title}</h4>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Submitted on {selectedAchievement.date}</p>
              </div>
              <button 
                onClick={() => setSelectedAchievement(null)}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>

            <div className="mb-4 text-start">
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>APPLICANT NAME</span>
                  <strong className="text-primary">{selectedAchievement.name}</strong>
                </div>
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>ROLE TYPE</span>
                  <span className={`badge ${selectedAchievement.role === 'Faculty' ? 'bg-primary' : 'bg-info'} bg-opacity-10 text-primary border-0`}>
                    {selectedAchievement.role}
                  </span>
                </div>
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>CATEGORY</span>
                  <strong>{selectedAchievement.category}</strong>
                </div>
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>CURRENT STATUS</span>
                  <span className={`glass-badge ${selectedAchievement.status === 'Approved' ? 'glass-badge-success' : selectedAchievement.status === 'Rejected' ? 'glass-badge-danger' : 'glass-badge-warning'}`}>
                    {selectedAchievement.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mb-3" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <span className="text-secondary d-block fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>DESCRIPTION</span>
                {selectedAchievement.description}
              </div>

              {/* Mock Certificate Upload Display */}
              <div className="border border-secondary border-opacity-25 rounded-3 p-3 text-center bg-white bg-opacity-25">
                <Award size={36} className="text-primary mb-2" />
                <p className="mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Verification Document Attachment</p>
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>document_stamp_{selectedAchievement.id.toLowerCase()}.pdf (2.4 MB)</span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="d-flex justify-content-end gap-2 pt-2 border-top border-light-subtle">
              <button 
                onClick={() => setSelectedAchievement(null)}
                className="btn-glass-outline py-2 px-4"
              >
                <span>Dismiss</span>
              </button>
              {selectedAchievement.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => {
                      handleStatusChange(selectedAchievement.id, 'Rejected');
                      setSelectedAchievement(null);
                    }}
                    className="btn btn-danger text-white border-0 py-2 px-4 rounded-3 fw-semibold"
                  >
                    <span>Reject Submission</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleStatusChange(selectedAchievement.id, 'Approved');
                      setSelectedAchievement(null);
                    }}
                    className="btn btn-success text-white border-0 py-2 px-4 rounded-3 fw-semibold"
                  >
                    <span>Approve & Verify</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Achievement Form Glass Modal */}
      {showAddForm && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ 
            zIndex: 1000, 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="glass-panel p-4 p-md-5 w-100 fade-in-up" style={{ maxWidth: '550px', background: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.9)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Log Achievement Entry</h5>
              <button 
                onClick={() => setShowAddForm(false)}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={handleAddAchievement} className="text-start">
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>APPLICANT NAME</label>
                <input 
                  type="text"
                  className="glass-input"
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Dr. Jane Foster or John Doe"
                  value={newAchName}
                  onChange={(e) => setNewAchName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>APPLICANT ROLE</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newAchRole}
                    onChange={(e) => setNewAchRole(e.target.value as any)}
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>CATEGORY</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newAchCategory}
                    onChange={(e) => setNewAchCategory(e.target.value as any)}
                  >
                    <option value="Research">Research</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Extra-curricular">Extra-curricular</option>
                    <option value="Patents">Patents</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>ACHIEVEMENT TITLE</label>
                <input 
                  type="text"
                  className="glass-input"
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Published Deep Learning review in Nature Journal"
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DESCRIPTION / PROOF CITATION</label>
                <textarea 
                  className="glass-input"
                  style={{ paddingLeft: '16px', minHeight: '80px', borderRadius: '12px' }}
                  placeholder="Summarize details, links, or certificates links..."
                  value={newAchDesc}
                  onChange={(e) => setNewAchDesc(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 border-top border-light-subtle pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="btn-glass-outline py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-glass-primary py-2 px-4"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
