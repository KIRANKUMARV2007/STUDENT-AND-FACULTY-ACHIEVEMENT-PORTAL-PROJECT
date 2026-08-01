import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { fetchAchievements, calculateAchievementStats } from '../utils/achievementUtils';
import './MyAchievements.css';

const MyAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const achievementsData = await fetchAchievements(user.id);
        if (isMounted) {
          setAchievements(achievementsData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching achievements data:', error);
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pending achievement?')) return;
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      setAchievements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting achievement:', err);
      alert('Failed to delete achievement.');
    }
  };

  const { total, approved, pending, rejected } = calculateAchievementStats(achievements);
  return (
    <div className="my-achievements-page">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold text-primary mb-2">My Achievements</h1>
          <p className="text-muted">Track, manage, and showcase your academic and extracurricular accomplishments.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 py-2 px-4 shadow-sm" style={{ borderRadius: '12px' }}>
          <i className="bi bi-plus"></i> <span className="fw-bold">Submit New Achievement</span>
        </button>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm p-4 h-100 stat-card">
            <h6 className="text-muted fw-semibold mb-3">Total Earned</h6>
            <div className="d-flex align-items-baseline gap-2">
              <h1 className="fw-bold text-primary mb-0" style={{ fontSize: '3rem' }}>{total}</h1>
              <span className="text-muted small fw-semibold">Total</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm p-4 h-100 stat-card">
            <h6 className="text-muted fw-semibold mb-3">Pending Reviews</h6>
            <div className="d-flex align-items-baseline gap-2">
              <h1 className="fw-bold text-warning mb-0" style={{ fontSize: '3rem' }}>{pending.toString().padStart(2, '0')}</h1>
              <span className="text-muted small fw-semibold">Processing</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm p-4 h-100 stat-card">
            <h6 className="text-muted fw-semibold mb-3">Success Rate</h6>
            <div className="d-flex align-items-baseline gap-2">
              <h1 className="fw-bold text-primary mb-0" style={{ fontSize: '3rem' }}>92%</h1>
              <span className="text-muted small fw-semibold">Overall</span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm p-4 h-100 stat-card">
            <h6 className="text-muted fw-semibold mb-3">Portal Rank</h6>
            <div className="d-flex align-items-baseline gap-2">
              <h1 className="fw-bold text-success mb-0" style={{ fontSize: '3rem' }}>#12</h1>
              <span className="text-muted small fw-semibold">Top 5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex gap-2 filter-tabs">
          <button className="btn btn-outline-primary active fw-bold px-4 rounded-pill">All</button>
          <button className="btn btn-light text-muted fw-semibold px-4 rounded-pill border">Academic</button>
          <button className="btn btn-light text-muted fw-semibold px-4 rounded-pill border">Extracurricular</button>
          <button className="btn btn-light text-muted fw-semibold px-4 rounded-pill border">Certifications</button>
        </div>
        <div className="d-flex gap-3">
          <select className="form-select border rounded-pill bg-light text-muted fw-semibold">
            <option>Status: All</option>
          </select>
          <select className="form-select border rounded-pill bg-light text-muted fw-semibold">
            <option>Sort: Newest</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {achievements.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">No achievements found.</div>
        ) : (
          achievements.map(ach => {
            const isApproved = ach.status === 'Approved';
            const isPending = ach.status === 'Pending';
            const isRejected = ach.status === 'Rejected';
            const borderColor = isApproved ? '#198754' : isPending ? '#ffc107' : '#dc3545';
            
            return (
              <div className="col-md-4" key={ach.id}>
                <Link to={`/achievement/${ach.id}`} className="text-decoration-none text-dark">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden achievement-card position-relative border-start border-4" style={{ borderLeftColor: `${borderColor} !important` }}>
                    <div className="position-relative bg-light d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                      <i className="bi bi-award text-muted" style={{ fontSize: '4rem', opacity: 0.2 }}></i>
                      <span className="badge bg-secondary position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill">
                        {ach.achievement_categories?.name?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="p-4 d-flex flex-column h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">{ach.title}</h5>
                        {isApproved && <span className="badge bg-success-subtle text-success rounded-pill px-2">APPROVED</span>}
                        {isPending && <span className="badge bg-warning-subtle text-warning rounded-pill px-2">PENDING</span>}
                        {isRejected && <span className="badge bg-danger-subtle text-danger rounded-pill px-2">REJECTED</span>}
                      </div>
                      <div className="text-muted small mb-4 d-flex align-items-center gap-1">
                        <i className="bi bi-calendar"></i> {new Date(ach.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      
                      <div className="mt-auto bg-light p-3 rounded text-muted small mb-2">
                        {ach.description?.length > 100 ? ach.description.substring(0, 100) + '...' : (ach.description || 'No description provided.')}
                      </div>
                      
                      {isPending && (
                        <div className="d-flex justify-content-end gap-2 mt-2" onClick={(e) => e.preventDefault()}>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(ach.id);
                            }}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyAchievements;
