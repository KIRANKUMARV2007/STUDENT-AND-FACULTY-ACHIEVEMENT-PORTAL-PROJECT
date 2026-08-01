import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { fetchAchievements, calculateAchievementStats, getBadgeForPoints } from '../utils/achievementUtils';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: studentData } = await supabase
          .from('students')
          .select('first_name, last_name, register_number, year, total_points, departments(name)')
          .eq('user_id', user.id)
          .single();

        const achievementsData = await fetchAchievements(user.id);
        
        if (isMounted) {
          if (studentData) setStudent(studentData);
          setAchievements(achievementsData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const { total, approved, pending, rejected } = calculateAchievementStats(achievements);
  const points = student?.total_points || 0;
  const badge = getBadgeForPoints(points);

  const getBadgeColor = (b) => {
    switch (b) {
      case 'Platinum': return 'bg-info text-dark';
      case 'Gold': return 'bg-warning text-dark';
      case 'Silver': return 'bg-secondary text-white';
      case 'Bronze': return 'bg-danger bg-opacity-75 text-white';
      default: return 'bg-light text-muted';
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner card border-0 shadow-sm text-white p-4 mb-4" style={{ background: 'linear-gradient(135deg, #104c91 0%, #1f6bc4 100%)', borderRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold mb-3">Welcome back, {student?.first_name || 'Student'}!</h3>
            <div className="d-flex gap-2 mb-3">
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">Department: {student?.departments?.name || 'N/A'}</span>
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">Year: {student?.year || 'N/A'}</span>
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">Reg: {student?.register_number || 'N/A'}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-white opacity-75 fs-6">Current Tier:</span>
              <span className={`badge ${getBadgeColor(badge)} rounded-pill px-3 py-2 fw-bold fs-6 shadow-sm border border-white border-2`}>
                <i className="bi bi-award-fill me-1"></i> {badge} Badge
              </span>
            </div>
          </div>
          
          <div className="text-center d-none d-md-block">
            <div className="position-relative d-inline-block mb-2" style={{ width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" className="circular-chart white">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="3" />
                <path className="circle" strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                <text x="18" y="20.35" className="percentage fw-bold" fill="#fff" fontSize="8" textAnchor="middle">80%</text>
              </svg>
            </div>
            <div className="small fw-semibold opacity-75">Profile Complete</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-trophy text-primary fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Total Achievements</h6>
            <h3 className="fw-bold mb-1">{total}</h3>
            <small className="text-primary fw-bold">Up to date</small>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-check-circle text-success fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Approved</h6>
            <h3 className="fw-bold mb-1">{approved}</h3>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-three-dots text-secondary fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Pending Review</h6>
            <h3 className="fw-bold mb-1">{pending}</h3>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift" style={{ borderTop: '4px solid #ffc107' }}>
            <i className="bi bi-star-fill text-warning fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Reward Points</h6>
            <h3 className="fw-bold mb-1">{points}</h3>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-award text-primary fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Leaderboard Rank</h6>
            <h3 className="fw-bold mb-1">#12</h3>
            <small className="text-success fw-bold">Top 5%</small>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="row g-4 mb-4">
        {/* Achievements by category placeholder */}
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
            <h6 className="text-muted fw-bold mb-4 text-uppercase">Achievements By Category</h6>
            <div className="d-flex align-items-end justify-content-between h-100 mt-5 pt-4 pb-2 px-2">
              {/* Fake bars */}
              <div className="d-flex flex-column align-items-center gap-2">
                <div style={{ width: '24px', height: '120px', backgroundColor: '#2156a6', borderRadius: '4px' }}></div>
                <span className="small text-muted" style={{ fontSize: '0.65rem' }}>Hackathons</span>
              </div>
              <div className="d-flex flex-column align-items-center gap-2">
                <div style={{ width: '24px', height: '60px', backgroundColor: '#60a5fa', borderRadius: '4px' }}></div>
                <span className="small text-muted" style={{ fontSize: '0.65rem' }}>Certs</span>
              </div>
              <div className="d-flex flex-column align-items-center gap-2">
                <div style={{ width: '24px', height: '90px', backgroundColor: '#34d399', borderRadius: '4px' }}></div>
                <span className="small text-muted" style={{ fontSize: '0.65rem' }}>Sports</span>
              </div>
              <div className="d-flex flex-column align-items-center gap-2">
                <div style={{ width: '24px', height: '40px', backgroundColor: '#fbbf24', borderRadius: '4px' }}></div>
                <span className="small text-muted" style={{ fontSize: '0.65rem' }}>Cultural</span>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Status Placeholder */}
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
            <h6 className="text-muted fw-bold mb-4 text-uppercase text-start">Approval Status</h6>
            
            <div className="position-relative mx-auto mb-4 mt-2" style={{ width: '160px', height: '160px' }}>
              {/* Fake Donut Chart using conic-gradient */}
              <div className="rounded-circle w-100 h-100" style={{ background: 'conic-gradient(#1f6bc4 0% 75%, #ffc107 75% 92%, #dc3545 92% 100%)' }}></div>
              <div className="position-absolute bg-white rounded-circle d-flex flex-column justify-content-center align-items-center" style={{ top: '20px', left: '20px', right: '20px', bottom: '20px' }}>
                <h3 className="fw-bold mb-0">{total}</h3>
                <small className="text-muted">Total</small>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-4 mt-auto">
              <div className="d-flex align-items-center gap-1 small text-muted"><div className="rounded-circle" style={{ width:'8px', height:'8px', backgroundColor:'#1f6bc4' }}></div> Approved</div>
              <div className="d-flex align-items-center gap-1 small text-muted"><div className="rounded-circle" style={{ width:'8px', height:'8px', backgroundColor:'#ffc107' }}></div> Pending</div>
              <div className="d-flex align-items-center gap-1 small text-muted"><div className="rounded-circle" style={{ width:'8px', height:'8px', backgroundColor:'#dc3545' }}></div> Rejected</div>
            </div>
          </div>
        </div>

        {/* Reward Points card */}
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="text-muted fw-bold text-uppercase mb-0">Reward Points</h6>
              <i className="bi bi-award text-warning fs-5"></i>
            </div>
            
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-0" style={{ fontSize: '3rem' }}>1,250</h1>
              <span className="text-muted small">Available Points</span>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2 small fw-bold">
                <span>Silver Milestone</span>
                <span className="text-muted">1,250/2,000</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: '62%' }}></div>
              </div>
            </div>

            <h6 className="text-muted small fw-bold mb-3 text-uppercase">Recent History</h6>
            
            <div className="d-flex align-items-start gap-3 mb-3">
              <div className="rounded-circle bg-warning mt-1" style={{ width: '10px', height: '10px' }}></div>
              <div>
                <div className="fw-bold small">Hackathon Win</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>2 days ago • +500 pts</div>
              </div>
            </div>
            
            <div className="d-flex align-items-start gap-3">
              <div className="rounded-circle bg-secondary mt-1" style={{ width: '10px', height: '10px', opacity: 0.5 }}></div>
              <div>
                <div className="fw-bold small">Quiz Participation</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>1 week ago • +50 pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="text-muted fw-bold text-uppercase mb-0">Recent Submissions</h6>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/my-achievements'); }} className="text-decoration-none fw-bold small">View All</a>
        </div>
        <div className="table-responsive">
          <table className="table align-middle table-borderless mb-0">
            <thead className="border-bottom">
              <tr>
                <th className="text-muted small pb-3">ACHIEVEMENT TITLE</th>
                <th className="text-muted small pb-3">CATEGORY</th>
                <th className="text-muted small pb-3">DATE</th>
                <th className="text-muted small pb-3">STATUS</th>
                <th className="text-muted small pb-3 text-end">POINTS</th>
              </tr>
            </thead>
            <tbody>
              {achievements.slice(0, 3).map(ach => (
                <tr key={ach.id}>
                  <td className="py-3">
                    <div className="fw-bold">{ach.title}</div>
                    <div className="small text-muted text-truncate" style={{maxWidth: '250px'}}>{ach.description}</div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                      {ach.achievement_categories?.name?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="text-muted">
                    {new Date(ach.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    {ach.status === 'Approved' && <span className="text-success small fw-bold"><i className="bi bi-circle-fill me-1" style={{fontSize: '6px', verticalAlign: 'middle'}}></i> Approved</span>}
                    {ach.status === 'Pending' && <span className="text-warning small fw-bold"><i className="bi bi-circle-fill me-1" style={{fontSize: '6px', verticalAlign: 'middle'}}></i> Pending</span>}
                    {ach.status === 'Rejected' && <span className="text-danger small fw-bold"><i className="bi bi-circle-fill me-1" style={{fontSize: '6px', verticalAlign: 'middle'}}></i> Rejected</span>}
                  </td>
                  <td className="text-end fw-bold text-dark">
                    {ach.status === 'Approved' ? '+Pts' : '-'}
                  </td>
                </tr>
              ))}
              {achievements.length === 0 && (
                <tr><td colSpan="5" className="text-center text-muted py-4">No achievements found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
