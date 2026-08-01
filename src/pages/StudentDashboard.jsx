import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { fetchAchievements, calculateAchievementStats } from '../utils/achievementUtils';
import './Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log('[StudentDashboard] Dashboard mounted');
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        // 1. Get logged-in user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
            console.error('[StudentDashboard] No authenticated user found, redirecting to login.');
            if (isMounted) navigate('/');
            return;
        }
        
        const userId = user.id;
        console.log(`[StudentDashboard] Auth user: ${userId}`);

        // 2. Fetch student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select(`
            first_name,
            last_name,
            register_number,
            year,
            departments (name)
          `)
          .eq('user_id', userId)
          .single();
        
        if (studentError) throw studentError;
        console.log('[StudentDashboard] Profile fetched', studentData);

        // 3. Fetch achievements using utility
        const achievementsData = await fetchAchievements(userId);

        // 4. Fetch reward points
        const { data: pointsData, error: pointsError } = await supabase
          .from('reward_points')
          .select('points_awarded')
          .eq('student_id', userId);

        if (pointsError) throw pointsError;
        const totalPoints = pointsData.reduce((sum, record) => sum + record.points_awarded, 0);
        console.log('[StudentDashboard] Reward points fetched', totalPoints);

        // 5. Fetch notifications
        const { data: notifData, error: notifError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (notifError) throw notifError;
        console.log('[StudentDashboard] Notifications fetched', notifData);
        
        if (!isMounted) return;

        // Update state sequentially
        setStudent(studentData);
        setAchievements(achievementsData);
        setRewardPoints(totalPoints);
        setNotifications(notifData);
        
        console.log('[StudentDashboard] Final dashboard state:', {
            student: studentData,
            achievements: achievementsData,
            rewardPoints: totalPoints,
            notifications: notifData
        });

      } catch (err) {
        if (!isMounted) return;
        console.error('[StudentDashboard] Error fetching dashboard data:', err.message);
        setError(err.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchData();
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) navigate('/');
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
      return (
          <div className="d-flex justify-content-center align-items-center" style={{height: '60vh'}}>
              <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          </div>
      );
  }
  
  if (error) {
      return (
          <div className="alert alert-danger m-4 text-center" role="alert">
              Error loading dashboard: {error}
          </div>
      );
  }
  
  if (!student) {
      return <div className="p-5 text-center text-danger">Student profile not found.</div>;
  }

  const { total: totalAchievements, approved: approvedCount, pending: pendingCount, rejected: rejectedCount } = calculateAchievementStats(achievements);

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner card border-0 shadow-sm text-white p-4 mb-4" style={{ background: 'linear-gradient(135deg, #104c91 0%, #1f6bc4 100%)', borderRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-3">Welcome back, {student.first_name} {student.last_name}!</h3>
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">
                  Department: {student.departments?.name || 'N/A'}
              </span>
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">
                  Year: {student.year}
              </span>
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">
                  Reg: {student.register_number}
              </span>
            </div>
          </div>
          <div className="text-center">
             <button onClick={() => navigate('/add-achievement')} className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm">
               <i className="bi bi-plus-lg me-2"></i> Submit Achievement
             </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-trophy text-primary fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Total Achievements</h6>
            <h3 className="fw-bold mb-1">{totalAchievements}</h3>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-check-circle text-success fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Approved</h6>
            <h3 className="fw-bold mb-1">{approvedCount}</h3>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift">
            <i className="bi bi-three-dots text-secondary fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Pending Review</h6>
            <h3 className="fw-bold mb-1">{pendingCount}</h3>
          </div>
        </div>
        <div className="col-md">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-lift" style={{ borderTop: '4px solid #ffc107' }}>
            <i className="bi bi-star-fill text-warning fs-4 mb-2"></i>
            <h6 className="text-muted mb-3">Reward Points</h6>
            <h3 className="fw-bold mb-1">{rewardPoints}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
          <div className="col-lg-8">
              {/* Recent Submissions */}
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="text-muted fw-bold text-uppercase mb-0">Recent Submissions</h6>
                  <button onClick={() => navigate('/my-achievements')} className="btn btn-link text-decoration-none fw-bold small p-0">View All</button>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle table-borderless mb-0">
                    <thead className="border-bottom">
                      <tr>
                        <th className="text-muted small pb-3">ACHIEVEMENT TITLE</th>
                        <th className="text-muted small pb-3">CATEGORY</th>
                        <th className="text-muted small pb-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achievements.slice(0, 5).map(ach => (
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
                          <td>
                            {ach.status === 'Approved' && <span className="text-success small fw-bold"><i className="bi bi-circle-fill me-1" style={{fontSize: '6px', verticalAlign: 'middle'}}></i> Approved</span>}
                            {ach.status === 'Pending' && <span className="text-warning small fw-bold"><i className="bi bi-circle-fill me-1" style={{fontSize: '6px', verticalAlign: 'middle'}}></i> Pending</span>}
                            {ach.status === 'Rejected' && <span className="text-danger small fw-bold"><i className="bi bi-circle-fill me-1" style={{fontSize: '6px', verticalAlign: 'middle'}}></i> Rejected</span>}
                          </td>
                        </tr>
                      ))}
                      {achievements.length === 0 && (
                          <tr><td colSpan="3" className="text-center text-muted py-4">No achievements submitted yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
          <div className="col-lg-4">
              {/* Notifications */}
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="text-muted fw-bold text-uppercase mb-4">Notifications</h6>
                {notifications.length === 0 ? (
                    <div className="text-center text-muted small py-3">No recent notifications</div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                          <div className={`rounded-circle mt-1 bg-${notif.type === 'success' ? 'success' : notif.type === 'info' ? 'primary' : 'warning'}`} style={{ width: '10px', height: '10px' }}></div>
                          <div>
                            <div className="fw-bold small">{notif.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{notif.message}</div>
                          </div>
                        </div>
                    ))
                )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
