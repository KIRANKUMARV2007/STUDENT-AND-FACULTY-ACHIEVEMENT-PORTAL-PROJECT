import React, { useState } from 'react';
import { 
  Award, FileText, CheckCircle, Clock, Plus, BarChart2, 
  LogOut, User, BookOpen, MessageSquare, ChevronRight, Zap
} from 'lucide-react';

export default function FacultyDashboardPreview({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('achievements');
  const [achievements, setAchievements] = useState([
    { id: 1, title: "Deep Learning Architectures in Edge Devices", type: "Research Paper", journal: "IEEE Transactions on Computers", points: 150, status: "Verified", date: "2026-06-15" },
    { id: 2, title: "Autonomous Campus Smart Navigation System", type: "Patent Filed", journal: "Indian Patent Office", points: 300, status: "Pending Verification", date: "2026-07-10" },
    { id: 3, title: "Industry 4.0 IoT Workshop & Hands-on Lab", type: "FDP organized", journal: "AICTE Sponsored", points: 80, status: "Verified", date: "2026-05-22" },
    { id: 4, title: "Optimizing Transformer Models for Embedded Platforms", type: "Book Chapter", journal: "Springer Nature", points: 100, status: "Draft", date: "2026-07-28" }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Research Paper');
  const [newJournal, setNewJournal] = useState('');
  const [newPoints, setNewPoints] = useState(100);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!newTitle || !newJournal) {
      alert("Please fill out all fields");
      return;
    }
    const newAchievement = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      journal: newJournal,
      points: Number(newPoints),
      status: "Pending Verification",
      date: new Date().toISOString().split('T')[0]
    };
    setAchievements([newAchievement, ...achievements]);
    setNewTitle('');
    setNewJournal('');
    setNewPoints(100);
    setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold">Verified</span>;
      case 'Pending Verification':
        return <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill fw-semibold">Pending</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill fw-semibold">Draft</span>;
    }
  };

  // Aggregated values
  const totalVerifiedPoints = achievements
    .filter(a => a.status === 'Verified')
    .reduce((sum, a) => sum + a.points, 0);

  const pendingCount = achievements.filter(a => a.status === 'Pending Verification').length;

  return (
    <div className="container py-4 fade-in-slide">
      {/* Premium Dashboard Header */}
      <header className="glass-panel p-4 mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="logo-container m-0 d-flex align-items-center justify-content-center bg-primary text-white" style={{ width: '50px', height: '50px', borderRadius: '12px' }}>
            <span className="fs-4 fw-bold">{user.avatar}</span>
          </div>
          <div>
            <h4 className="mb-0 text-dark font-heading">{user.name}</h4>
            <p className="text-muted small mb-0">{user.role} • {user.department}</p>
          </div>
        </div>
        <button className="btn-glass-secondary text-danger d-flex align-items-center" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </header>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        {/* Card 1: Total Points */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 h-100">
            <div className="dashboard-stat-card border-0">
              <div className="stat-icon blue">
                <Award size={20} />
              </div>
              <p className="text-muted small mb-1 fw-medium">Verified Reward Points</p>
              <h3 className="mb-2 text-dark font-heading fw-bold">{totalVerifiedPoints} pts</h3>
              <div className="mt-auto">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Progress to Tier 1</span>
                  <span>{Math.min(100, Math.floor((totalVerifiedPoints / 500) * 100))}%</span>
                </div>
                <div className="progress-bar-glass">
                  <div className="progress-bar-fill progress-blue" style={{ width: `${Math.min(100, (totalVerifiedPoints / 500) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Submissions */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 h-100">
            <div className="dashboard-stat-card border-0">
              <div className="stat-icon purple">
                <BookOpen size={20} />
              </div>
              <p className="text-muted small mb-1 fw-medium">Total Submissions</p>
              <h3 className="mb-2 text-dark font-heading fw-bold">{achievements.length}</h3>
              <div className="mt-auto fs-7 text-muted">
                <Clock size={12} className="me-1" />
                <span>Last submitted on {achievements[0]?.date || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Pending verification */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 h-100">
            <div className="dashboard-stat-card border-0">
              <div className="stat-icon amber">
                <Clock size={20} />
              </div>
              <p className="text-muted small mb-1 fw-medium">Pending Approvals</p>
              <h3 className="mb-2 text-dark font-heading fw-bold">{pendingCount}</h3>
              <div className="mt-auto fs-7 text-warning fw-medium">
                <Zap size={12} className="me-1" />
                <span>Awaiting department audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Rank */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 h-100">
            <div className="dashboard-stat-card border-0">
              <div className="stat-icon green">
                <BarChart2 size={20} />
              </div>
              <p className="text-muted small mb-1 fw-medium">Department Rank</p>
              <h3 className="mb-2 text-dark font-heading fw-bold">#4 <span className="fs-6 text-muted font-normal">/ 28</span></h3>
              <div className="mt-auto">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Performance Index</span>
                  <span>88%</span>
                </div>
                <div className="progress-bar-glass">
                  <div className="progress-bar-fill progress-purple" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        {/* Achievements list */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-0 text-dark font-heading">Academic Achievements</h5>
                <p className="text-muted small mb-0">Manage and upload your research paper publications, patents, and workshops.</p>
              </div>
              <button 
                className="btn-glass-primary w-auto py-2 px-3 d-flex align-items-center text-white"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus size={16} />
                <span>{showAddForm ? 'Close Portal Form' : 'Add Achievement'}</span>
              </button>
            </div>

            {/* Slide-down Add Achievement Form */}
            {showAddForm && (
              <form onSubmit={handleAddAchievement} className="p-3 mb-4 rounded-4 bg-white bg-opacity-25 border border-white-50 fade-in-slide">
                <h6 className="mb-3 text-dark fw-bold">New Achievement Details</h6>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-medium">Achievement Title</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      placeholder="e.g. Adaptive AI Scheduling Algorithms" 
                      style={{ paddingLeft: '1rem' }}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-medium">Journal/Publisher/Platform</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      placeholder="e.g. ACM Digital Library" 
                      style={{ paddingLeft: '1rem' }}
                      value={newJournal}
                      onChange={(e) => setNewJournal(e.target.value)}
                    />
                  </div>
                  <div className="col-6 col-md-4">
                    <label className="form-label text-muted small fw-medium">Category Type</label>
                    <select 
                      className="glass-input" 
                      style={{ paddingLeft: '1rem' }}
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option>Research Paper</option>
                      <option>Patent Filed</option>
                      <option>FDP organized</option>
                      <option>Book Chapter</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-4">
                    <label className="form-label text-muted small fw-medium">Requested Points</label>
                    <input 
                      type="number" 
                      className="glass-input" 
                      style={{ paddingLeft: '1rem' }}
                      value={newPoints}
                      onChange={(e) => setNewPoints(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-4 d-flex align-items-end">
                    <button type="submit" className="btn-glass-primary w-100 py-2">
                      Submit Achievement
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Achievements Table */}
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted border-0 small text-uppercase">
                    <th scope="col" className="border-0">Title & Detail</th>
                    <th scope="col" className="border-0 text-center">Category</th>
                    <th scope="col" className="border-0 text-center">Points</th>
                    <th scope="col" className="border-0 text-center">Status</th>
                    <th scope="col" className="border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((item) => (
                    <tr key={item.id} className="border-bottom" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                      <td className="py-3">
                        <div className="fw-semibold text-dark mb-1">{item.title}</div>
                        <div className="text-muted fs-7">{item.journal} • {item.date}</div>
                      </td>
                      <td className="text-center py-3">
                        <span className="badge bg-white bg-opacity-50 text-dark border px-2 py-1 rounded-pill small fw-medium">{item.type}</span>
                      </td>
                      <td className="text-center py-3 text-primary fw-semibold">{item.points}</td>
                      <td className="text-center py-3">{getStatusBadge(item.status)}</td>
                      <td className="text-end py-3">
                        <button className="btn border-0 text-muted p-1 hover-dark">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar analytics / notices */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 h-100 d-flex flex-column">
            <h5 className="mb-3 text-dark font-heading">Department Analytics</h5>
            <p className="text-muted small mb-4">Live analytics and verification status summaries within the Computer Science department.</p>

            {/* Quick Chart Simulation */}
            <div className="mb-4 bg-white bg-opacity-20 border border-white-50 p-3 rounded-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold text-dark fs-6">Achievement Breakdown</span>
              </div>
              <div className="d-flex flex-column gap-3 mt-3">
                <div>
                  <div className="d-flex justify-content-between fs-7 text-muted mb-1">
                    <span>Research Papers</span>
                    <span>45%</span>
                  </div>
                  <div className="progress-bar-glass" style={{ height: '6px' }}>
                    <div className="progress-bar-fill progress-blue" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between fs-7 text-muted mb-1">
                    <span>Patents</span>
                    <span>20%</span>
                  </div>
                  <div className="progress-bar-glass" style={{ height: '6px' }}>
                    <div className="progress-bar-fill progress-purple" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between fs-7 text-muted mb-1">
                    <span>Workshops/FDPs</span>
                    <span>35%</span>
                  </div>
                  <div className="progress-bar-glass" style={{ height: '6px' }}>
                    <div className="progress-bar-fill progress-blue" style={{ width: '35%', background: '#14b8a6' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stream */}
            <div className="mt-auto">
              <h6 className="fw-bold text-dark mb-3">Verification History Log</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-2">
                  <CheckCircle size={16} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <p className="mb-0 fs-7 text-dark fw-medium">"Deep Learning Architectures" approved</p>
                    <span className="text-muted fs-8">Approved by Dean Office • 2 days ago</span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Clock size={16} className="text-warning mt-1 flex-shrink-0" />
                  <div>
                    <p className="mb-0 fs-7 text-dark fw-medium">"Smart Navigation" pending review</p>
                    <span className="text-muted fs-8">Sent to HOD for endorsement • 4 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
