import React, { useState } from 'react';
import { 
  Star, Clock, ShieldAlert, Edit2, Search, Filter, 
  HelpCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface Rule {
  id: string;
  category: string;
  points: number;
  badge: 'GOLD BADGE' | 'SILVER BADGE' | 'BRONZE BADGE';
}

export const RewardRules: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', category: 'Hackathon Winner', points: 100, badge: 'GOLD BADGE' },
    { id: '2', category: 'Internship', points: 70, badge: 'SILVER BADGE' },
    { id: '3', category: 'Paper Publication', points: 85, badge: 'GOLD BADGE' },
    { id: '4', category: 'Social Service', points: 40, badge: 'BRONZE BADGE' },
    { id: '5', category: 'Patent Filed', points: 120, badge: 'GOLD BADGE' },
    { id: '6', category: 'Debate Winner', points: 50, badge: 'BRONZE BADGE' },
    { id: '7', category: 'Sports Captaincy', points: 60, badge: 'SILVER BADGE' },
    { id: '8', category: 'GPA Achievement 3.9+', points: 90, badge: 'GOLD BADGE' }
  ]);

  const [editingId, setEditingId] = useState<string | null>('2'); // Pre-select "Internship" to show the inline edit state from image 1!
  const [editPoints, setEditPoints] = useState<number>(70);
  const [editBadge, setEditBadge] = useState<'GOLD BADGE' | 'SILVER BADGE' | 'BRONZE BADGE'>('SILVER BADGE');
  const [editCategory, setEditCategory] = useState<string>('Internship');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showContactModal, setShowContactModal] = useState(false);

  // Edit action triggers
  const handleEditClick = (rule: Rule) => {
    setEditingId(rule.id);
    setEditPoints(rule.points);
    setEditBadge(rule.badge);
    setEditCategory(rule.category);
  };

  const handleSaveClick = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, category: editCategory, points: editPoints, badge: editBadge } : r));
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Filter rules
  const filteredRules = rules.filter(r => 
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simple mock pagination (4 per page)
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);
  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="fade-in-up">
      {/* Header Banner */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1 text-primary">Reward Point Rules</h4>
        <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Configure rules, points weights, and active tier designations</span>
      </div>

      {/* Stats Summary cards (Image 1 layout) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
              <Star size={22} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.78rem' }}>Total Rules</span>
              <h4 className="fw-bold mb-0 text-primary">24</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.78rem' }}>Last Modified</span>
              <h5 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.1rem' }}>Today, 09:45</h5>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-panel p-3.5 d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
              <ShieldAlert size={22} />
            </div>
            <div>
              <span className="text-secondary d-block" style={{ fontSize: '0.78rem' }}>Active Badges</span>
              <h5 className="fw-bold mb-0 text-primary" style={{ fontSize: '1.1rem' }}>4 Tiers</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Ruleset Table Card */}
      <div className="glass-panel p-4 mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h6 className="fw-bold mb-0 text-primary">Institutional Ruleset</h6>
            <span className="text-secondary" style={{ fontSize: '0.72rem' }}>Define automatic merit allocation values</span>
          </div>
          
          <div className="d-flex gap-2 w-100 w-sm-auto">
            {/* Search */}
            <div className="position-relative" style={{ minWidth: '220px' }}>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '8px 12px 8px 36px', fontSize: '0.82rem' }}
              />
              <Search size={13} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button className="btn btn-light p-2 rounded-3 border-0 d-flex align-items-center">
              <Filter size={15} />
            </button>
          </div>
        </div>

        {/* Rules Table */}
        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Reward Points</th>
                <th>Badge Tier</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRules.map((rule) => {
                const isEditing = editingId === rule.id;
                return (
                  <tr key={rule.id}>
                    <td>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="glass-input py-1.5 px-3"
                          style={{ maxWidth: '200px', fontSize: '0.85rem' }}
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        />
                      ) : (
                        <div className="fw-semibold text-primary">{rule.category}</div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="d-flex align-items-center gap-2">
                          <input 
                            type="number" 
                            className="glass-input py-1.5 px-2 text-center"
                            style={{ width: '70px', paddingLeft: '10px', fontSize: '0.85rem' }}
                            value={editPoints}
                            onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                          />
                          <span className="text-secondary" style={{ fontSize: '0.8rem' }}>pts</span>
                        </div>
                      ) : (
                        <span className="badge bg-primary bg-opacity-10 text-primary border-0 fw-semibold px-3 py-2" style={{ fontSize: '0.8rem' }}>
                          {rule.points} pts
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select 
                          className="form-select bg-light border-0 py-1.5 px-2"
                          style={{ borderRadius: '8px', fontSize: '0.85rem', maxWidth: '160px' }}
                          value={editBadge}
                          onChange={(e) => setEditBadge(e.target.value as any)}
                        >
                          <option value="GOLD BADGE">Gold Badge</option>
                          <option value="SILVER BADGE">Silver Badge</option>
                          <option value="BRONZE BADGE">Bronze Badge</option>
                        </select>
                      ) : (
                        <span 
                          className={`glass-badge ${
                            rule.badge === 'GOLD BADGE' 
                              ? 'glass-badge-success' 
                              : rule.badge === 'SILVER BADGE' 
                                ? '' 
                                : 'glass-badge-warning'
                          }`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {rule.badge}
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      {isEditing ? (
                        <div className="d-inline-flex align-items-center gap-3">
                          <button 
                            onClick={handleCancelClick}
                            className="btn btn-link text-secondary text-decoration-none p-0 fw-semibold"
                            style={{ fontSize: '0.82rem' }}
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveClick(rule.id)}
                            className="btn btn-primary py-1.5 px-3 border-0 rounded-3 text-white fw-semibold"
                            style={{ fontSize: '0.82rem', backgroundColor: 'var(--primary-brand)' }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEditClick(rule)}
                          className="btn btn-link text-decoration-none text-primary p-0 d-inline-flex align-items-center gap-1.5"
                          style={{ fontSize: '0.82rem', fontWeight: 500 }}
                        >
                          <Edit2 size={12} />
                          <span>Edit Rule</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light-subtle">
          <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
            Showing {paginatedRules.length} of {filteredRules.length} categories
          </span>
          
          <div className="d-flex align-items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-light p-1.5 rounded-2 border-0"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-secondary fw-semibold mx-1" style={{ fontSize: '0.8rem' }}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="btn btn-sm btn-light p-1.5 rounded-2 border-0"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Info Logic & Contact row */}
      <div className="row g-4">
        {/* Point Distribution Logic */}
        <div className="col-12 col-md-7">
          <div className="glass-panel p-4 h-100 text-start">
            <div className="d-flex align-items-center gap-2.5 mb-3 text-primary">
              <HelpCircle size={18} />
              <h6 className="fw-bold mb-0">Point Distribution Logic</h6>
            </div>
            <ul className="ps-3 text-secondary" style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
              <li className="mb-2">Points are automatically calculated upon verification of achievement documents by the department head.</li>
              <li className="mb-2">Badge tiers are dynamic; if a student loses points due to disciplinary action, the badge tier may drop.</li>
              <li>Rules modified here take immediate effect for all past and future verified achievements.</li>
            </ul>
          </div>
        </div>

        {/* Need a Custom Rule Card */}
        <div className="col-12 col-md-5">
          <div 
            className="glass-panel p-4 h-100 text-start text-white position-relative overflow-hidden" 
            style={{ 
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
              boxShadow: '0 8px 32px rgba(30, 58, 138, 0.2)' 
            }}
          >
            {/* Background design accents */}
            <div className="position-absolute end-0 bottom-0 opacity-10" style={{ transform: 'translate(10%, 10%)' }}>
              <Star size={160} />
            </div>

            <h6 className="fw-bold mb-2">Need a Custom Rule?</h6>
            <p className="mb-4 text-white text-opacity-80" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
              If standard categories don't cover your department's specific academic achievements, you can request a custom rule template from the system administrator.
            </p>
            <button 
              onClick={() => setShowContactModal(true)}
              className="btn btn-light text-primary fw-bold py-2 px-3 border-0" 
              style={{ fontSize: '0.82rem', borderRadius: '10px' }}
            >
              Contact Admin
            </button>
          </div>
        </div>
      </div>

      {/* Contact Admin Modal */}
      {showContactModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ 
            zIndex: 1000, 
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="glass-panel p-4 p-md-5 w-100 text-start" style={{ maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Contact System Admin</h5>
              <button 
                onClick={() => setShowContactModal(false)}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Request submitted. An administrator will review your template proposal.');
              setShowContactModal(false);
            }}>
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>YOUR INSTITUTIONAL EMAIL</label>
                <input type="email" className="glass-input" style={{ paddingLeft: '16px' }} placeholder="departmenthead@institution.edu" required />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>PROPOSED RULE NAME</label>
                <input type="text" className="glass-input" style={{ paddingLeft: '16px' }} placeholder="e.g. Research Fellowship Grant Award" required />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>RATIONALE & CRITERIA</label>
                <textarea className="glass-input" style={{ paddingLeft: '16px', minHeight: '80px', borderRadius: '12px' }} placeholder="Describe the validation metrics..." required />
              </div>
              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" onClick={() => setShowContactModal(false)} className="btn-glass-outline">Cancel</button>
                <button type="submit" className="btn-glass-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
