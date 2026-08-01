import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { fetchAchievements, calculateAchievementStats, getBadgeForPoints } from '../utils/achievementUtils';
import './PublicProfile.css';

const PublicProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        let targetId = id;
        if (!targetId) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) targetId = user.id;
        }
        if (!targetId) return;

        // Fetch Student
        const { data: studentData } = await supabase
          .from('students')
          .select('first_name, last_name, year, bio, departments(name)')
          .eq('user_id', targetId)
          .single();
        
        if (isMounted && studentData) {
          setStudent(studentData);
        }

        // Fetch Achievements
        const achievementsData = await fetchAchievements(targetId);
        if (isMounted) {
          setAchievements(achievementsData);
        }

        // Fetch Points
        const { data: pointsData } = await supabase
          .from('reward_points')
          .select('points_awarded')
          .eq('student_id', targetId);
        
        if (isMounted && pointsData) {
          setPoints(pointsData.reduce((sum, p) => sum + p.points_awarded, 0));
        }

      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  const { total, approved, pending, rejected } = calculateAchievementStats(achievements);
  
  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  const fullName = student ? `${student.first_name} ${student.last_name}`.trim() : 'Student';
  const deptName = student?.departments?.name || 'Department';
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
    <div className="public-profile-page pb-5">
      
      {/* Hero Section */}
      <div className="profile-hero bg-primary text-white p-5 rounded-4 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #104c91 0%, #1f6bc4 100%)' }}>
        <div className="position-relative z-index-1 d-flex flex-column flex-md-row gap-5 align-items-center align-items-md-end">
          
          <div className="position-relative">
            <img src={`https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=0D8ABC&color=fff&size=200`} alt={fullName} className="rounded-circle border border-4 border-white shadow" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            <span className={`position-absolute bottom-0 end-0 ${getBadgeColor(badge)} rounded-circle d-flex justify-content-center align-items-center border border-3 border-white shadow-sm`} style={{ width: '40px', height: '40px', transform: 'translate(-10%, -10%)' }}>
              <i className="bi bi-award-fill"></i>
            </span>
          </div>

          <div className="flex-grow-1 text-center text-md-start">
            <h1 className="fw-bold mb-2 display-5">{fullName}</h1>
            <p className="fs-5 mb-3 opacity-75">{deptName} • Year {student?.year || '1'}</p>
            <div className="d-flex gap-2 justify-content-center justify-content-md-start flex-wrap">
              <span className={`badge ${getBadgeColor(badge)} rounded-pill px-3 py-2 fw-bold fs-6 shadow-sm border border-white border-2`}>
                <i className="bi bi-award-fill me-1"></i> {badge} Tier
              </span>
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">Dean's List</span>
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold opacity-75">Hackathon Winner</span>
            </div>
          </div>
          
          <div className="d-flex gap-3 mt-4 mt-md-0">
            <button className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm">Connect</button>
            <button className="btn btn-outline-light fw-bold px-4 py-2 rounded-pill">Message</button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="position-absolute rounded-circle bg-white opacity-10" style={{ width: '300px', height: '300px', top: '-100px', right: '-50px' }}></div>
      </div>

      <div className="row g-4">
        
        {/* Left Sidebar */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-4">
            
            {/* Stats Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-dark text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
              <div className="mb-4">
                <div className="text-white-50 small fw-bold">Reward Points</div>
                <h1 className="fw-bold mb-0 text-warning" style={{ fontSize: '3.5rem' }}>{points.toLocaleString()}</h1>
              </div>
              <div className="mb-4">
                <div className="text-white-50 small fw-bold">Total Achievements</div>
                <h1 className="fw-bold mb-0" style={{ fontSize: '3.5rem' }}>{total}</h1>
              </div>

              <div className="mt-auto">
                <Link to="/leaderboard" className="btn btn-outline-light w-100 rounded-pill fw-bold">View Leaderboard</Link>
              </div>
            </div>

            {/* About Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold text-primary mb-3"><i className="bi bi-person-lines-fill me-2"></i> About</h5>
              <p className="text-muted small lh-lg mb-4">
                {student?.bio || 'Passionate student pursuing excellence in academics and extracurricular activities. Always eager to learn, collaborate, and contribute to the university community.'}
              </p>
              
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="small fw-semibold text-muted">University Campus</div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '36px', height: '36px' }}>
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="small fw-semibold text-muted">Contact Student</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-8">
          
          {/* Public Achievements */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2"><i className="bi bi-trophy"></i> Public Achievements</h4>
            </div>
            
            <div className="row g-3">
              {achievements.filter(a => a.status === 'Approved').slice(0, 4).map(ach => (
                <div className="col-md-6" key={ach.id}>
                  <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                    <div className="position-relative bg-light d-flex justify-content-center align-items-center" style={{ height: '180px' }}>
                      <i className="bi bi-award text-muted" style={{ fontSize: '4rem', opacity: 0.2 }}></i>
                      <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill">
                        {ach.achievement_categories?.name?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="fw-bold mb-0 lh-base">{ach.title}</h6>
                        <span className="text-muted small fw-semibold ms-2">
                          {new Date(ach.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-muted small mb-4">
                        {ach.description.length > 100 ? ach.description.substring(0, 100) + '...' : ach.description}
                      </p>
                      <div className="mt-auto">
                        <span className="text-success fw-bold small"><i className="bi bi-check-circle-fill me-1"></i> Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {achievements.filter(a => a.status === 'Approved').length === 0 && (
                <div className="col-12 text-muted small py-3">No approved achievements yet.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
