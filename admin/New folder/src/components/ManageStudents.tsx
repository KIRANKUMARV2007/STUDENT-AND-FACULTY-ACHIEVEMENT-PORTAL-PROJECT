import React, { useState } from 'react';
import { 
  GraduationCap, Activity, Award, Calendar, Search, Filter, 
  Eye, Edit, Trash2, Plus 
} from 'lucide-react';

interface Student {
  regNumber: string;
  name: string;
  avatar: string;
  department: string;
  year: string;
  points: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    { regNumber: '21CSE001', name: 'Aditi Rajesh', avatar: 'AR', department: 'Computer Science & Eng.', year: 'III Year', points: 850, status: 'ACTIVE' },
    { regNumber: '22IT104', name: 'Balamurugan K.', avatar: 'BK', department: 'Information Technology', year: 'II Year', points: 420, status: 'ACTIVE' },
    { regNumber: '23AI015', name: 'Catherine Rose', avatar: 'CR', department: 'AI & Data Science', year: 'I Year', points: 1200, status: 'ACTIVE' },
    { regNumber: '20ECE210', name: 'Deepak J.', avatar: 'DJ', department: 'Electronics & Comm.', year: 'IV Year', points: 670, status: 'INACTIVE' },
    { regNumber: '21EEE044', name: 'Ezhil Vendan', avatar: 'EV', department: 'Electrical & Electronics', year: 'III Year', points: 310, status: 'ACTIVE' },
    { regNumber: '21ME092', name: 'Farhan Sait', avatar: 'FS', department: 'Mechanical Engineering', year: 'III Year', points: 280, status: 'ACTIVE' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<Student | null>(null);

  // Add form states
  const [newReg, setNewReg] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Computer Science & Eng.');
  const [newYear, setNewYear] = useState('I Year');
  const [newPoints, setNewPoints] = useState(0);
  const [newStatus, setNewStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.regNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg || !newName) {
      alert('Please fill in Register Number and Name.');
      return;
    }
    const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newStudent: Student = {
      regNumber: newReg,
      name: newName,
      avatar: initials,
      department: newDept,
      year: newYear,
      points: newPoints,
      status: newStatus
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
    // Reset Form
    setNewReg('');
    setNewName('');
    setNewPoints(0);
  };

  const handleDelete = (reg: string) => {
    if (confirm(`Are you sure you want to delete student ${reg}?`)) {
      setStudents(prev => prev.filter(s => s.regNumber !== reg));
    }
  };

  return (
    <div className="fade-in-up text-start">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">Manage Students</h4>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>View, track, and manage student registration records, point metrics, and active states.</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-glass-primary px-4 py-2.5 d-inline-flex align-items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Stats Counter Cards (Image 2 layout) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-primary bg-opacity-10 text-primary">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-0.5">
                <span className="text-secondary" style={{ fontSize: '0.72rem' }}>TOTAL STUDENTS</span>
                <span className="badge bg-success bg-opacity-10 text-success px-1.5 py-0.5 border-0" style={{ fontSize: '0.62rem' }}>+12%</span>
              </div>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>1,284</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-info bg-opacity-10 text-info">
              <Activity size={20} />
            </div>
            <div>
              <span className="text-secondary d-block mb-0.5" style={{ fontSize: '0.72rem' }}>ACTIVE TODAY</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>942 <span className="fw-normal text-secondary" style={{ fontSize: '0.75rem' }}> (73%)</span></strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-warning bg-opacity-10 text-warning">
              <Award size={20} />
            </div>
            <div>
              <span className="text-secondary d-block mb-0.5" style={{ fontSize: '0.72rem' }}>AVG REWARD POINTS</span>
              <strong className="text-primary" style={{ fontSize: '1.1rem' }}>450 <span className="fw-normal text-secondary font-normal" style={{ fontSize: '0.72rem' }}>AI&DS</span></strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3" style={{ borderLeft: '3px solid #ef4444' }}>
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-2.5 rounded bg-danger bg-opacity-10 text-danger">
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-secondary d-block mb-0.5" style={{ fontSize: '0.72rem' }}>PENDING APPROVALS</span>
              <strong className="text-danger" style={{ fontSize: '1.1rem' }}>12</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Student list card */}
      <div className="glass-panel p-4 mb-4">
        {/* Table Toolbar */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div className="position-relative w-100 w-sm-auto" style={{ minWidth: '260px' }}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Search by name, register number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
            />
            <Search size={14} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div className="d-flex gap-2 w-100 w-sm-auto">
            <select 
              className="form-select bg-light border-0 py-2 px-3" 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{ borderRadius: '10px', fontSize: '0.85rem', minWidth: '150px' }}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Eng.">Computer Science</option>
              <option value="Information Technology">Information Tech</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Electronics & Comm.">Electronics</option>
            </select>
            <button className="btn btn-light py-2 px-3 border-0 d-inline-flex align-items-center gap-2 fw-semibold text-secondary" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
              <Filter size={15} />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>REG. NUMBER</th>
                <th>STUDENT NAME</th>
                <th>DEPARTMENT</th>
                <th>YEAR</th>
                <th>REWARD POINTS</th>
                <th>STATUS</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-secondary">
                    No student records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.regNumber}>
                    <td className="fw-semibold text-secondary">{student.regNumber}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '32px', height: '32px', fontSize: '0.78rem' }}
                        >
                          {student.avatar}
                        </div>
                        <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.department}</td>
                    <td>{student.year}</td>
                    <td>
                      <span className="fw-semibold text-primary" style={{ color: 'var(--primary-brand)' }}>
                        {student.points}
                      </span>
                    </td>
                    <td>
                      <span className={`badge border-0 rounded-pill px-2.5 py-1 fw-bold ${student.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '0.72rem' }}>
                        {student.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button 
                          onClick={() => setShowDetailsModal(student)}
                          className="btn btn-sm btn-glass-outline p-2 border-0 bg-transparent text-secondary"
                          title="View Info"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setNewReg(student.regNumber);
                            setNewName(student.name);
                            setNewDept(student.department);
                            setNewYear(student.year);
                            setNewPoints(student.points);
                            setNewStatus(student.status);
                            setStudents(prev => prev.filter(s => s.regNumber !== student.regNumber));
                            setShowAddModal(true);
                          }}
                          className="btn btn-sm btn-glass-outline p-2 border-0 bg-transparent text-secondary"
                          title="Edit Info"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.regNumber)}
                          className="btn btn-sm btn-outline-danger p-2 border-0 bg-transparent"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light-subtle">
          <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
            Showing 1-{filteredStudents.length} of 1,284 students
          </span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-primary rounded-2 text-white border-0 px-3.5 py-1.5" style={{ backgroundColor: 'var(--primary-brand)', fontSize: '0.8rem' }}>1</button>
            <button className="btn btn-sm btn-light rounded-2 border-0 px-3 py-1.5" style={{ fontSize: '0.8rem' }}>2</button>
            <button className="btn btn-sm btn-light rounded-2 border-0 px-3 py-1.5" style={{ fontSize: '0.8rem' }}>3</button>
            <span className="text-secondary align-self-end mx-1" style={{ fontSize: '0.8rem' }}>...</span>
            <button className="btn btn-sm btn-light rounded-2 border-0 px-3 py-1.5" style={{ fontSize: '0.8rem' }}>214</button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-panel p-4 p-md-5 w-100" style={{ maxWidth: '520px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Add Student Record</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close" aria-label="Close"></button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>REGISTER NUMBER</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. 21CSE001"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>STUDENT NAME</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Aditi Rajesh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DEPARTMENT</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  >
                    <option value="Computer Science & Eng.">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Electronics & Comm.">Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>ACADEMIC YEAR</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                  >
                    <option value="I Year">I Year</option>
                    <option value="II Year">II Year</option>
                    <option value="III Year">III Year</option>
                    <option value="IV Year">IV Year</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>REWARD POINTS</label>
                  <input 
                    type="number" 
                    className="glass-input" 
                    style={{ paddingLeft: '16px' }}
                    value={newPoints}
                    onChange={(e) => setNewPoints(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>REGISTRATION STATUS</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-glass-outline">Cancel</button>
                <button type="submit" className="btn-glass-primary">Add Student</button>
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
                <span className="glass-badge mb-2">{showDetailsModal.regNumber}</span>
                <h4 className="fw-bold mb-1 text-primary">{showDetailsModal.name}</h4>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>{showDetailsModal.department}</p>
              </div>
              <button onClick={() => setShowDetailsModal(null)} className="btn-close" aria-label="Close"></button>
            </div>

            <div className="mb-4 text-start">
              <div className="row g-3">
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>ACADEMIC YEAR</span>
                  <strong>{showDetailsModal.year}</strong>
                </div>
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>REWARD POINTS</span>
                  <strong className="text-primary" style={{ color: 'var(--primary-brand)' }}>{showDetailsModal.points} pts</strong>
                </div>
                <div className="col-6">
                  <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>STATUS</span>
                  <span className={`badge border-0 rounded-pill px-2.5 py-1 fw-bold ${showDetailsModal.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                    {showDetailsModal.status}
                  </span>
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
