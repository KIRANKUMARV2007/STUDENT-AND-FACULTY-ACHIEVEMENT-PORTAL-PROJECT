import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';

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

export const Verifications: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ACH-001',
      name: 'Dr. Aris Thorne',
      role: 'Faculty',
      category: 'Research',
      title: 'Quantum Computing Algorithms for Optimization',
      date: '2026-07-28',
      status: 'Pending',
      description: 'Published a high-impact paper detailing a 15% speedup in optimization problems using hybrid quantum-classical algorithms.'
    },
    {
      id: 'ACH-002',
      name: 'Sarah Jenkins',
      role: 'Student',
      category: 'Sports',
      title: 'Gold Medal in Inter-University Swimming',
      date: '2026-07-25',
      status: 'Approved',
      description: 'Secured first place and broke the university record in the 200m individual medley.'
    },
    {
      id: 'ACH-003',
      name: 'David Kim',
      role: 'Student',
      category: 'Academic',
      title: 'First Place in National Mathematics Olympiad',
      date: '2026-07-22',
      status: 'Pending',
      description: 'Competed against 400 top students nationwide to win the gold trophy and a research grant of $5,000.'
    },
    {
      id: 'ACH-004',
      name: 'Prof. Clara Oswald',
      role: 'Faculty',
      category: 'Patents',
      title: 'AI-Powered Smart Grid Energy Distribution System',
      date: '2026-07-15',
      status: 'Approved',
      description: 'Successfully filed and registered a utility patent for a decentralized hardware sensor mesh.'
    },
    {
      id: 'ACH-005',
      name: 'Emma Watson',
      role: 'Student',
      category: 'Extra-curricular',
      title: 'Best Delegate Award at Harvard MUN',
      date: '2026-07-10',
      status: 'Rejected',
      description: 'Represented France in the UN Security Council simulation and secured the top delegate citation.'
    },
    {
      id: 'ACH-006',
      name: 'Dr. James Moriarty',
      role: 'Faculty',
      category: 'Research',
      title: 'Autonomous Navigation in Uncharted Terrain',
      date: '2026-07-30',
      status: 'Pending',
      description: 'Completed field tests for lidar-based path planning algorithms in dense forest settings.'
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
    <div className="glass-panel p-4 fade-in-up text-start">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1 text-primary">Achievement Verification Center</h5>
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

      {/* Details Modal */}
      {selectedAchievement && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ 
            zIndex: 1000, 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="glass-panel p-4 p-md-5 w-100 fade-in-up" style={{ maxWidth: '600px', background: 'var(--glass-bg)' }}>
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
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
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
                    <span>Reject</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleStatusChange(selectedAchievement.id, 'Approved');
                      setSelectedAchievement(null);
                    }}
                    className="btn btn-success text-white border-0 py-2 px-4 rounded-3 fw-semibold"
                  >
                    <span>Approve</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Achievement Form Modal */}
      {showAddForm && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ 
            zIndex: 1000, 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="glass-panel p-4 p-md-5 w-100 fade-in-up" style={{ maxWidth: '550px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Log Achievement Entry</h5>
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
                  placeholder="e.g. Dr. Jane Foster"
                  value={newAchName}
                  onChange={(e) => setNewAchName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>ROLE</label>
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
                  placeholder="e.g. Published Deep Learning review"
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DESCRIPTION</label>
                <textarea 
                  className="glass-input"
                  style={{ paddingLeft: '16px', minHeight: '80px', borderRadius: '12px' }}
                  placeholder="Summarize details..."
                  value={newAchDesc}
                  onChange={(e) => setNewAchDesc(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-glass-outline">Cancel</button>
                <button type="submit" className="btn-glass-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
