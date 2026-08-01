import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Leaderboard.css';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState('All Departments');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all required data
        const { data: studentsData } = await supabase.from('students').select('user_id, first_name, last_name, year, departments(name)');
        const { data: pointsData } = await supabase.from('reward_points').select('student_id, points_awarded');
        const { data: achievementsData } = await supabase.from('achievements').select('student_id, status');

        if (!studentsData) return;

        // Extract unique departments for the dropdown
        const depts = new Set();

        const processedStudents = studentsData.map(student => {
          const deptName = student.departments?.name || 'Unknown';
          depts.add(deptName);
          
          const studentPoints = pointsData 
            ? pointsData.filter(p => p.student_id === student.user_id).reduce((sum, p) => sum + p.points_awarded, 0)
            : 0;
            
          const studentAchvs = achievementsData 
            ? achievementsData.filter(a => a.student_id === student.user_id && a.status === 'Approved').length 
            : 0;

          return {
            id: student.user_id,
            name: `${student.first_name} ${student.last_name}`,
            dept: deptName,
            year: student.year,
            points: studentPoints,
            achievements: studentAchvs
          };
        });

        // Sort by points descending
        processedStudents.sort((a, b) => b.points - a.points);
        
        // Assign ranks (handling ties properly if needed, but for now simple index based rank)
        processedStudents.forEach((student, index) => {
          student.rank = index + 1;
        });

        setDepartments(['All Departments', ...Array.from(depts)]);
        setStudents(processedStudents);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredStudents = students.filter(s => activeDepartment === 'All Departments' || s.dept === activeDepartment);
  
  // Need to re-rank filtered students for accurate display
  const displayStudents = filteredStudents.map((s, index) => ({...s, displayRank: index + 1}));

  const top3 = displayStudents.slice(0, 3);
  const rest = displayStudents.slice(3);

  return (
    <div className="leaderboard-page pb-5">
      <div className="d-flex justify-content-between align-items-start mb-5 flex-wrap gap-4">
        <div style={{ maxWidth: '600px' }}>
          <h1 className="fw-bold text-primary mb-3">Student Leaderboard</h1>
          <p className="text-muted">Celebrating our top performers and their academic milestones. Rankings are updated in real-time based on verified achievements.</p>
        </div>
        
        <div className="d-flex align-items-end gap-3 flex-wrap">
          <div>
            <label className="form-label small text-muted mb-1">Department</label>
            <select className="form-select bg-white" value={activeDepartment} onChange={e => setActiveDepartment(e.target.value)}>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm mt-auto" style={{ height: '38px' }}>
            <i className="bi bi-funnel-fill"></i> Apply Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          {/* Podium Section */}
          {top3.length > 0 && (
            <div className="row justify-content-center mb-5 gx-4 gy-4 podium-section">
              {/* Rank 2 */}
              {top3[1] && (
                <div className="col-md-4 col-sm-12 d-flex flex-column justify-content-end">
                  <div className="podium-card rank-2 card border-0 shadow-sm text-center p-4">
                    <div className="avatar-wrapper mx-auto mb-3 position-relative">
                      <img src={`https://ui-avatars.com/api/?name=${top3[1].name.replace(' ', '+')}&background=random`} className="rounded-circle avatar-img" alt="Rank 2" />
                      <span className="rank-badge badge bg-secondary position-absolute bottom-0 end-0 rounded-circle d-flex justify-content-center align-items-center fs-6">2</span>
                    </div>
                    <i className="bi bi-award-fill fs-3 text-secondary mb-2"></i>
                    <h4 className="fw-bold mb-1">{top3[1].name}</h4>
                    <p className="text-muted small fw-semibold mb-3">{top3[1].dept}</p>
                    <div className="points-pill bg-light text-primary fw-bold py-1 px-3 rounded-pill mx-auto mb-2 d-inline-block">{top3[1].points.toLocaleString()} Points</div>
                    <p className="text-muted small mb-0">{top3[1].achievements} Achievements</p>
                  </div>
                </div>
              )}

              {/* Rank 1 */}
              {top3[0] && (
                <div className="col-md-4 col-sm-12 d-flex flex-column justify-content-end">
                  <div className="podium-card rank-1 card border-0 shadow text-center p-4" style={{ zIndex: 2, transform: 'scale(1.05)' }}>
                    <div className="avatar-wrapper mx-auto mb-3 position-relative">
                      <img src={`https://ui-avatars.com/api/?name=${top3[0].name.replace(' ', '+')}&background=random`} className="rounded-circle avatar-img rank-1-img border border-3 border-warning" alt="Rank 1" />
                      <span className="rank-badge badge bg-warning text-dark position-absolute bottom-0 end-0 rounded-circle d-flex justify-content-center align-items-center fs-5 border border-white">1</span>
                    </div>
                    <i className="bi bi-trophy-fill fs-1 text-warning mb-2"></i>
                    <h3 className="fw-bold mb-1">{top3[0].name}</h3>
                    <p className="text-muted small fw-semibold mb-3">{top3[0].dept}</p>
                    <div className="points-pill bg-warning text-dark fw-bold py-2 px-4 rounded-pill mx-auto mb-3 d-inline-block" style={{ fontSize: '1.1rem' }}>{top3[0].points.toLocaleString()} Points</div>
                    <p className="fw-bold small mb-0" style={{ color: '#856404' }}>{top3[0].achievements} Achievements</p>
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {top3[2] && (
                <div className="col-md-4 col-sm-12 d-flex flex-column justify-content-end">
                  <div className="podium-card rank-3 card border-0 shadow-sm text-center p-4">
                    <div className="avatar-wrapper mx-auto mb-3 position-relative">
                      <img src={`https://ui-avatars.com/api/?name=${top3[2].name.replace(' ', '+')}&background=random`} className="rounded-circle avatar-img border border-3 border-danger" alt="Rank 3" />
                      <span className="rank-badge badge bg-danger position-absolute bottom-0 end-0 rounded-circle d-flex justify-content-center align-items-center fs-6 border border-white">3</span>
                    </div>
                    <i className="bi bi-star-fill fs-3 text-danger mb-2"></i>
                    <h4 className="fw-bold mb-1">{top3[2].name}</h4>
                    <p className="text-muted small fw-semibold mb-3">{top3[2].dept}</p>
                    <div className="points-pill bg-light text-primary fw-bold py-1 px-3 rounded-pill mx-auto mb-2 d-inline-block">{top3[2].points.toLocaleString()} Points</div>
                    <p className="text-muted small mb-0">{top3[2].achievements} Achievements</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Table Section */}
          <div className="card border-0 shadow-sm mb-5">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-muted small py-3 ps-4 border-0">RANK</th>
                    <th className="text-muted small py-3 border-0">STUDENT</th>
                    <th className="text-muted small py-3 border-0">DEPARTMENT</th>
                    <th className="text-muted small py-3 text-center border-0">POINTS</th>
                    <th className="text-muted small py-3 text-center border-0">ACHIEVEMENTS</th>
                    <th className="text-muted small py-3 text-center border-0 pe-4">TREND</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.length === 0 && (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">No students found.</td></tr>
                  )}
                  {rest.map((row) => (
                    <tr key={row.id} className="bg-white border-bottom">
                      <td className="ps-4 fw-bold text-muted">{row.displayRank}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3 py-2">
                          <img src={`https://ui-avatars.com/api/?name=${row.name.replace(' ', '+')}&background=random`} width="40" height="40" className="rounded-circle" alt={row.name} />
                          <div>
                            <div className="fw-bold">{row.name}</div>
                            <div className="small text-muted">Year {row.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted">{row.dept}</td>
                      <td className="text-center fw-bold text-primary">{row.points.toLocaleString()}</td>
                      <td className="text-center">
                        <span className="badge bg-light text-primary rounded-pill px-3 py-2">{row.achievements}</span>
                      </td>
                      <td className="text-center pe-4">
                        <i className="bi bi-dash text-muted"></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-light border-0 py-3 d-flex justify-content-between align-items-center">
              <small className="text-muted">Showing {rest.length} of {displayStudents.length} students</small>
            </div>
          </div>
        </>
      )}

      {/* Bottom Cards */}
      <div className="row gx-4 gy-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm text-white p-4 h-100" style={{ background: 'linear-gradient(135deg, #2156a6 0%, #1a4585 100%)' }}>
            <h4 className="fw-bold mb-3">How to climb the ranks?</h4>
            <p className="mb-4 text-white-50">Participate in research projects, maintain a GPA above 3.8, or lead student organizations to earn high-tier reward points.</p>
            <div>
              <button className="btn btn-light rounded-pill px-4 fw-bold text-primary">View Point Guide</button>
            </div>
            <i className="bi bi-rocket-takeoff position-absolute text-white" style={{ opacity: 0.1, fontSize: '8rem', bottom: '-20px', right: '-10px' }}></i>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h4 className="fw-bold text-primary mb-3">Weekly Spotlight</h4>
            <p className="text-muted mb-4">Every week, we feature a student who has shown exceptional growth in their achievement portfolio.</p>
            {top3.length > 0 && (
              <div className="d-flex align-items-center bg-light rounded-3 p-3 cursor-pointer hover-highlight">
                <img src={`https://ui-avatars.com/api/?name=${top3[0].name.replace(' ', '+')}&background=random`} width="60" height="60" className="rounded-3 me-3" alt="Spotlight" />
                <div className="flex-grow-1">
                  <div className="small fw-bold" style={{ color: '#856404' }}>TOP PERFORMER</div>
                  <div className="fw-bold">{top3[0].name} (Rank #1)</div>
                </div>
                <div className="bg-white rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-arrow-right text-dark"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
