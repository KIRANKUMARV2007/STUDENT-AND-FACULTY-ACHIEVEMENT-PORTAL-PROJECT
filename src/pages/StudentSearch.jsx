import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './StudentSearch.css';

const StudentSearch = () => {
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data: studentsData, error: studentError } = await supabase
          .from('students')
          .select(`
            user_id,
            first_name,
            last_name,
            register_number,
            department_id,
            departments!students_department_id_fkey(name)
          `);
        
        if (studentError) throw studentError;
        
        if (studentsData && studentsData.length > 0) {
          console.log(JSON.stringify(studentsData[0], null, 2));
        }

        // Dynamically derive departments from the studentsData
        const uniqueDepts = [];
        const deptMap = new Map();
        
        (studentsData || []).forEach(s => {
          if (s.department_id) {
            const deptObj = Array.isArray(s.departments) ? s.departments[0] : s.departments;
            const deptName = deptObj?.name || 'Unknown Department';
            if (!deptMap.has(s.department_id)) {
              deptMap.set(s.department_id, true);
              uniqueDepts.push({ id: s.department_id, name: deptName });
            }
          }
        });
        
        setDepartments(uniqueDepts);
        console.log('Departments derived from students:', uniqueDepts);
        
        if (uniqueDepts.length === 0 && studentsData?.length > 0) {
          console.warn('WARNING: No departments found in studentsData. Check RLS policies on the departments table to ensure relationships can be read.');
        }

        const { data: achievementsData } = await supabase.from('achievements').select('student_id');
        const { data: pointsData } = await supabase.from('reward_points').select('student_id, points_awarded');

        const studentsWithStats = (studentsData || []).map(student => {
          const studentAchvs = achievementsData ? achievementsData.filter(a => a.student_id === student.user_id).length : 0;
          const studentPoints = pointsData ? pointsData.filter(p => p.student_id === student.user_id).reduce((sum, p) => sum + p.points_awarded, 0) : 0;
          
          let badges = [];
          if (studentPoints > 1000) badges.push("Top Earner");
          if (studentAchvs > 5) badges.push("Overachiever");
          if (badges.length === 0) badges.push("Active Member");

          // Handle Supabase returning either an array or an object for the relationship
          const deptObj = Array.isArray(student.departments) ? student.departments[0] : student.departments;
          const deptName = deptObj?.name || 'Unknown Department';

          return {
            user_id: student.user_id,
            name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
            register_number: student.register_number,
            department_id: student.department_id,
            dept: deptName,
            points: studentPoints.toLocaleString(),
            achievements: studentAchvs,
            badges
          };
        });

        setStudents(studentsWithStats);
      } catch (error) {
        console.error('Error fetching student directory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    // 1. Apply Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = student.name.toLowerCase().includes(query) || 
                          (student.register_number && student.register_number.toLowerCase().includes(query));
    
    if (!matchesSearch) return false;

    // 2. Apply Department Filter
    if (activeDepartment === 'All') return true;
    
    console.log(`Filtering: Selected Dept ID=${activeDepartment}, Student Dept ID=${student.department_id}`);
    if (activeDepartment === student.department_id) return true;
    
    return false;
  });

  return (
    <div className="student-search-page">
      <div className="mb-4">
        <h1 className="fw-bold text-primary mb-2">Student Directory</h1>
        <p className="text-muted">Discover and connect with high-achieving peers across departments.</p>
      </div>

      <div className="search-filter-box bg-white p-3 rounded-3 shadow-sm border mb-4 d-flex gap-3">
        <div className="flex-grow-1 position-relative">
          <i className="bi bi-search position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input 
            type="text" 
            className="form-control bg-light border-0" 
            placeholder="Search by name, register number..." 
            style={{ paddingLeft: '45px', height: '48px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2">
          <i className="bi bi-funnel-fill"></i> Advanced Filters
        </button>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button 
          className={`btn rounded-pill px-4 btn-sm ${activeDepartment === 'All' ? 'btn-primary' : 'btn-light text-muted fw-semibold'}`}
          onClick={() => setActiveDepartment('All')}
        >All Students</button>
        
        {departments.map(dept => (
          <button 
            key={dept.id}
            className={`btn rounded-pill px-4 btn-sm ${activeDepartment === dept.id ? 'btn-primary' : 'btn-light text-muted fw-semibold'}`}
            onClick={() => setActiveDepartment(dept.id)}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {filteredStudents.length === 0 && (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No students found matching your criteria.</p>
            </div>
          )}
          {filteredStudents.map((student, i) => (
            <div className="col" key={student.user_id || i}>
              <Link to={`/profile/${student.user_id}`} className="text-decoration-none text-dark">
                <div className="card h-100 border-0 shadow-sm student-card text-center pt-4 pb-4 px-3 position-relative overflow-hidden">
                  <div className="card-top-border position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: '#2156a6' }}></div>
                  <div className="avatar-container mx-auto mb-3 position-relative" style={{ width: '90px', height: '90px' }}>
                    <img src={`https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`} className="rounded-circle w-100 h-100 object-fit-cover border border-3 border-white shadow-sm" alt={student.name} />
                    <span className="position-absolute bottom-0 end-0 bg-warning text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '24px', height: '24px', border: '2px solid white' }}>
                      <i className="bi bi-star-fill" style={{ fontSize: '10px' }}></i>
                    </span>
                  </div>
                  <h5 className="fw-bold mb-1">{student.name}</h5>
                  <p className="text-primary fw-bold mb-4" style={{ fontSize: '0.75rem' }}>{student.dept}</p>

                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <div className="bg-light rounded p-2 text-center" style={{ width: '80px' }}>
                      <div className="fw-bold fs-5 text-dark">{student.points}</div>
                      <div className="text-muted" style={{ fontSize: '0.65rem' }}>TOTAL<br/>POINTS</div>
                    </div>
                    <div className="bg-light rounded p-2 text-center" style={{ width: '80px' }}>
                      <div className="fw-bold fs-5 text-dark">{student.achievements}</div>
                      <div className="text-muted" style={{ fontSize: '0.65rem' }}>ACHIEVEMENTS</div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                    {student.badges.map((badge, idx) => (
                      <span key={idx} className={`badge rounded-pill fw-semibold ${idx % 2 === 0 ? 'bg-warning-subtle text-warning' : 'bg-primary-subtle text-primary'}`}>
                        {badge}
                      </span>
                    ))}
                  </div>

                  <button className="btn btn-outline-primary btn-sm rounded-pill fw-bold px-3">View Profile</button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
