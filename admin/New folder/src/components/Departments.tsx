import React, { useState } from 'react';
import { 
  Building2, Users, Monitor, Network, Cpu, Microchip, Zap, 
  Settings, PenTool, Plus, PlusCircle 
} from 'lucide-react';

interface DeptItem {
  id: string;
  name: string;
  desc: string;
  students: number;
  faculty: number;
  awards: number;
  status: 'ACTIVE' | 'INACTIVE';
  icon: React.ReactNode;
}

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<DeptItem[]>([
    { id: '1', name: 'Computer Science', desc: 'Software engineering & systems development...', students: 1240, faculty: 48, awards: 156, status: 'ACTIVE', icon: <Monitor size={20} /> },
    { id: '2', name: 'IT', desc: 'Network infrastructure & cloud computing...', students: 820, faculty: 32, awards: 92, status: 'ACTIVE', icon: <Network size={20} /> },
    { id: '3', name: 'AI & DS', desc: 'Machine learning & predictive models...', students: 450, faculty: 18, awards: 64, status: 'ACTIVE', icon: <Cpu size={20} /> },
    { id: '4', name: 'ECE', desc: 'Circuits & communications engineering...', students: 740, faculty: 40, awards: 112, status: 'ACTIVE', icon: <Microchip size={20} /> },
    { id: '5', name: 'EEE', desc: 'Power systems & electricity grids...', students: 680, faculty: 35, awards: 88, status: 'ACTIVE', icon: <Zap size={20} /> },
    { id: '6', name: 'Mechanical', desc: 'Thermodynamics & fluid mechanics...', students: 520, faculty: 28, awards: 45, status: 'ACTIVE', icon: <Settings size={20} /> },
    { id: '7', name: 'Civil', desc: 'Structural engineering & layouts...', students: 370, faculty: 22, awards: 31, status: 'ACTIVE', icon: <PenTool size={20} /> }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [newStudents, setNewStudents] = useState(0);
  const [newFaculty, setNewFaculty] = useState(0);

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) {
      alert('Department Name is required.');
      return;
    }
    const newDept: DeptItem = {
      id: `${departments.length + 1}`,
      name: newDeptName,
      desc: newDeptDesc || 'Academic division monitoring log.',
      students: newStudents,
      faculty: newFaculty,
      awards: 0,
      status: 'ACTIVE',
      icon: <Building2 size={20} />
    };
    setDepartments([...departments, newDept]);
    setShowAddModal(false);
    // Reset Form
    setNewDeptName('');
    setNewDeptDesc('');
    setNewStudents(0);
    setNewFaculty(0);
  };

  const totalStudents = departments.reduce((acc, d) => acc + d.students, 0);

  return (
    <div className="fade-in-up text-start">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">Departments</h4>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Manage and monitor institutional academic divisions.</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-glass-primary px-4 py-2.5 d-inline-flex align-items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      {/* Top Stat Counters Row (Image 5 layout) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
              <Building2 size={22} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.78rem' }}>Total Departments</span>
              <h4 className="fw-bold mb-0 text-primary">{departments.length}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
              <Users size={22} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.78rem' }}>Total Students</span>
              <h4 className="fw-bold mb-0 text-primary">{totalStudents.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Cards Grid */}
      <div className="row g-4 mb-4">
        {departments.map((dept) => (
          <div key={dept.id} className="col-12 col-md-6 col-xl-4 col-xxl-3">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between border-2">
              <div>
                {/* Header Icon & Active badge */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="p-2.5 rounded bg-primary bg-opacity-10 text-primary">
                    {dept.icon}
                  </div>
                  <span className="badge border-0 rounded-pill bg-success bg-opacity-10 text-success px-2.5 py-1 fw-bold" style={{ fontSize: '0.65rem' }}>
                    {dept.status}
                  </span>
                </div>

                <h6 className="fw-bold text-primary mb-1">{dept.name}</h6>
                <p className="text-secondary mb-4" style={{ fontSize: '0.78rem', lineHeight: '1.45', minHeight: '38px' }}>
                  {dept.desc}
                </p>
              </div>

              {/* Department Statistics Counters Grid */}
              <div className="d-flex justify-content-between border-top border-light-subtle pt-3 text-center" style={{ fontSize: '0.78rem' }}>
                <div>
                  <span className="text-secondary d-block" style={{ fontSize: '0.65rem' }}>STUDENTS</span>
                  <strong className="text-primary">{dept.students}</strong>
                </div>
                <div>
                  <span className="text-secondary d-block" style={{ fontSize: '0.65rem' }}>FACULTY</span>
                  <strong className="text-primary">{dept.faculty}</strong>
                </div>
                <div>
                  <span className="text-secondary d-block" style={{ fontSize: '0.65rem' }}>AWARDS</span>
                  <strong className="text-primary">{dept.awards}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder "+ New Department" Card */}
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3">
          <div 
            onClick={() => setShowAddModal(true)}
            className="glass-panel p-4 h-100 d-flex flex-column align-items-center justify-content-center border-dashed cursor-pointer"
            style={{ borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer', minHeight: '180px' }}
          >
            <PlusCircle size={32} className="text-muted mb-2.5" />
            <h6 className="fw-bold text-secondary mb-1">New Department</h6>
            <span className="text-secondary text-center" style={{ fontSize: '0.75rem' }}>Initialize a new academic unit</span>
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-panel p-4 p-md-5 w-100" style={{ maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Initialize Department</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close" aria-label="Close"></button>
            </div>

            <form onSubmit={handleAddDept} className="text-start">
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DEPARTMENT NAME</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Chemical Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>SHORT DESCRIPTION</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Process engineering & fluid systems..."
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>STUDENTS ENROLLED</label>
                  <input 
                    type="number" 
                    className="glass-input" 
                    style={{ paddingLeft: '16px' }}
                    value={newStudents}
                    onChange={(e) => setNewStudents(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>FACULTY MEMBERS</label>
                  <input 
                    type="number" 
                    className="glass-input" 
                    style={{ paddingLeft: '16px' }}
                    value={newFaculty}
                    onChange={(e) => setNewFaculty(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-glass-outline">Cancel</button>
                <button type="submit" className="btn-glass-primary">Create Division</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
