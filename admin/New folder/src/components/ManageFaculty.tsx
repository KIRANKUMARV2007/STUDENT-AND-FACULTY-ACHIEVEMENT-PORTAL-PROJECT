import React, { useState } from 'react';
import { 
  Users, Trophy, Star, Clock, Search, Filter, Download, 
  Eye, Edit, Trash2, Plus, Info 
} from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  designation: string;
}

export const ManageFaculty: React.FC = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([
    { id: '#FAC-2024-001', name: 'Dr. Sarah Mitchell', email: 'sarah.m@portal.edu', avatar: 'SM', department: 'Computer Science', designation: 'HOD' },
    { id: '#FAC-2024-042', name: 'Prof. James Anderson', email: 'j.anderson@portal.edu', avatar: 'JA', department: 'Mechanical Eng.', designation: 'Professor' },
    { id: '#FAC-2024-089', name: 'Elena Vasilyev', email: 'e.vasilyev@portal.edu', avatar: 'EV', department: 'Data Analytics', designation: 'Asst. Professor' },
    { id: '#FAC-2024-112', name: 'Robert Wilson', email: 'r.wilson@portal.edu', avatar: 'RW', department: 'Physics', designation: 'Professor' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<FacultyMember | null>(null);

  // Form states for new faculty
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newDesig, setNewDesig] = useState('Professor');
  const [newEmail, setNewEmail] = useState('');

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newId || !newEmail) {
      alert('Please fill in all required fields.');
      return;
    }
    const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newMember: FacultyMember = {
      id: newId.startsWith('#') ? newId : `#${newId}`,
      name: newName,
      email: newEmail,
      avatar: initials,
      department: newDept,
      designation: newDesig
    };
    setFaculty([...faculty, newMember]);
    setShowAddModal(false);
    // Reset form
    setNewName('');
    setNewId('');
    setNewEmail('');
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to remove faculty record ${id}?`)) {
      setFaculty(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="fade-in-up text-start">
      {/* Header and Add Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">Faculty Directory</h4>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Oversee and manage institutional staff members, their roles, and departments.</span>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-glass-primary px-4 py-2.5 d-inline-flex align-items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Stat counter row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-primary bg-opacity-10 text-primary">
              <Users size={20} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>Total Faculty</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>142</strong>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-success bg-opacity-10 text-success">
              <Trophy size={20} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>Total Achievements</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>865</strong>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-warning bg-opacity-10 text-warning">
              <Star size={20} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>Active Awards</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>24</strong>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3" style={{ borderLeft: '3px solid #ef4444' }}>
            <div className="p-2.5 rounded bg-danger bg-opacity-10 text-danger">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>Pending Reviews</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>12</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty list Table Card */}
      <div className="glass-panel p-4 mb-4">
        {/* Table Search & Toolbar */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div className="position-relative w-100 w-sm-auto" style={{ minWidth: '260px' }}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
            />
            <Search size={14} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div className="d-flex gap-2 w-100 w-sm-auto">
            <button className="btn btn-light py-2 px-3 border-0 d-inline-flex align-items-center gap-2 fw-semibold text-secondary" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
              <Filter size={15} />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => alert('CSV template downloading...')}
              className="btn btn-light py-2 px-3 border-0 d-inline-flex align-items-center gap-2 fw-semibold text-secondary" 
              style={{ borderRadius: '10px', fontSize: '0.85rem' }}
            >
              <Download size={15} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>FACULTY ID</th>
                <th>NAME</th>
                <th>DEPARTMENT</th>
                <th>DESIGNATION</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-secondary">
                    No faculty records found matching search queries.
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((member) => (
                  <tr key={member.id}>
                    <td className="fw-semibold text-secondary">{member.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '32px', height: '32px', fontSize: '0.78rem' }}
                        >
                          {member.avatar}
                        </div>
                        <div>
                          <div className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem' }}>{member.name}</div>
                          <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="badge border-0 rounded-2 fw-semibold" 
                        style={{ 
                          fontSize: '0.78rem',
                          padding: '6px 12px',
                          backgroundColor: 'rgba(37, 99, 235, 0.08)',
                          color: 'var(--primary-brand)'
                        }}
                      >
                        {member.department}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="badge border-0 rounded-pill fw-bold" 
                        style={{ 
                          fontSize: '0.75rem',
                          padding: '5px 12px',
                          backgroundColor: member.designation === 'HOD' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0,0,0,0.03)',
                          color: member.designation === 'HOD' ? 'var(--primary-brand)' : 'var(--text-secondary)'
                        }}
                      >
                        {member.designation}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button 
                          onClick={() => setShowDetailsModal(member)}
                          className="btn btn-sm btn-glass-outline p-2 border-0 bg-transparent text-secondary"
                          title="View Info"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          onClick={() => {
                            setNewName(member.name);
                            setNewId(member.id);
                            setNewEmail(member.email);
                            setNewDept(member.department);
                            setNewDesig(member.designation);
                            setFaculty(prev => prev.filter(f => f.id !== member.id));
                            setShowAddModal(true);
                          }}
                          className="btn btn-sm btn-glass-outline p-2 border-0 bg-transparent text-secondary"
                          title="Edit Info"
                        >
                          <Edit size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="btn btn-sm btn-outline-danger p-2 border-0 bg-transparent"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light-subtle">
          <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
            Showing 1-{filteredFaculty.length} of 142 faculty members
          </span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-primary rounded-2 text-white border-0 px-3.5 py-1.5" style={{ backgroundColor: 'var(--primary-brand)', fontSize: '0.8rem' }}>1</button>
            <button className="btn btn-sm btn-light rounded-2 border-0 px-3 py-1.5" style={{ fontSize: '0.8rem' }}>2</button>
            <button className="btn btn-sm btn-light rounded-2 border-0 px-3 py-1.5" style={{ fontSize: '0.8rem' }}>3</button>
            <span className="text-secondary align-self-end mx-1" style={{ fontSize: '0.8rem' }}>...</span>
            <button className="btn btn-sm btn-light rounded-2 border-0 px-3 py-1.5" style={{ fontSize: '0.8rem' }}>36</button>
          </div>
        </div>
      </div>

      {/* Pro-Tip Box (Image 1 layout) */}
      <div 
        className="glass-panel p-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4"
        style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.15)' }}
      >
        <div className="d-flex align-items-start gap-3">
          <div 
            className="p-3.5 rounded-circle text-white d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'var(--primary-brand)' }}
          >
            <Info size={20} />
          </div>
          <div className="text-start">
            <h6 className="fw-bold mb-1 text-primary">Administrative Pro-Tip</h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
              You can batch-upload faculty records using a CSV file. Go to Settings &gt; Data Management to import large datasets efficiently and assign department heads in one go.
            </p>
          </div>
        </div>
        <button 
          onClick={() => alert('Data Management routing stub.')}
          className="btn btn-primary px-4 py-2.5 border-0 rounded-3 text-white fw-bold text-nowrap"
          style={{ backgroundColor: 'var(--primary-brand)', fontSize: '0.82rem' }}
        >
          Learn More
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-panel p-4 p-md-5 w-100" style={{ maxWidth: '520px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Add Faculty Record</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close" aria-label="Close"></button>
            </div>

            <form onSubmit={handleAddFaculty}>
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>FACULTY FULL NAME</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Dr. Sarah Mitchell"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>FACULTY ID</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    style={{ paddingLeft: '16px' }}
                    placeholder="e.g. FAC-2024-001"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DESIGNATION</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                  >
                    <option value="HOD">HOD</option>
                    <option value="Professor">Professor</option>
                    <option value="Asst. Professor">Asst. Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DEPARTMENT</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical Eng.">Mechanical Eng.</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>INSTITUTIONAL EMAIL</label>
                  <input 
                    type="email" 
                    className="glass-input" 
                    style={{ paddingLeft: '16px' }}
                    placeholder="email@portal.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-glass-outline">Cancel</button>
                <button type="submit" className="btn-glass-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {showDetailsModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-panel p-4 p-md-5 w-100" style={{ maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <span className="glass-badge mb-2">{showDetailsModal.id}</span>
                <h4 className="fw-bold mb-1 text-primary">{showDetailsModal.name}</h4>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>{showDetailsModal.email}</p>
              </div>
              <button onClick={() => setShowDetailsModal(null)} className="btn-close" aria-label="Close"></button>
            </div>

            <div className="mb-4 text-start">
              <div className="row g-3">
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>DEPARTMENT</span>
                  <strong>{showDetailsModal.department}</strong>
                </div>
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>DESIGNATION</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary border-0 fw-bold">{showDetailsModal.designation}</span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
              <button onClick={() => setShowDetailsModal(null)} className="btn-glass-outline px-4">Dismiss</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
