import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: studentData } = await supabase
          .from('students')
          .select('first_name, last_name, year')
          .eq('user_id', user.id)
          .single();
        
        if (studentData) {
          setStudent(studentData);
        }

        const { data: pointsData } = await supabase
          .from('reward_points')
          .select('points_awarded')
          .eq('student_id', user.id);
        
        if (pointsData) {
          const total = pointsData.reduce((sum, p) => sum + p.points_awarded, 0);
          setPoints(total);
        }
      } catch (err) {
        console.error('Error loading topbar profile:', err);
      }
    };
    
    loadProfile();
  }, []);

  const fullName = student ? `${student.first_name} ${student.last_name}` : 'Student';
  const role = student ? `Year ${student.year} Student` : 'Student';

  return (
    <div className="topbar d-flex align-items-center justify-content-between px-4">
      <div className="search-bar position-relative">
        <i className="bi bi-search position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
        <input type="text" className="form-control bg-light border-0" placeholder="Search achievements, students..." style={{ paddingLeft: '35px', borderRadius: '20px', width: '300px' }} />
      </div>

      <div className="topbar-actions d-flex align-items-center gap-4">
        <div className="reward-badge d-flex align-items-center gap-2">
          <i className="bi bi-star-fill text-warning"></i>
          <span className="fw-bold" style={{ color: '#856404' }}>Reward Points: {points.toLocaleString()}</span>
        </div>
        
        <div className="notification-icon position-relative cursor-pointer" onClick={() => navigate('/notifications')}>
          <i className="bi bi-bell fs-5 text-muted"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </div>

        <div className="user-profile d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigate('/settings')}>
          <div className="text-end d-none d-md-block">
            <div className="fw-bold" style={{ fontSize: '0.9rem', color: '#1e293b' }}>{fullName}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{role}</div>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=0D8ABC&color=fff&rounded=true`} alt="Profile" width="40" height="40" className="rounded-circle shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
