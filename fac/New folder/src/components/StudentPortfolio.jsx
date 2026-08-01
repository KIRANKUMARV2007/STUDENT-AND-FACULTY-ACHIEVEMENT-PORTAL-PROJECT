import React, { useState } from 'react';
import { 
  Award, GraduationCap, Share2, ShieldCheck, Check, 
  BookOpen, Calendar, HelpCircle, Activity, Search, Bell 
} from 'lucide-react';

export default function StudentPortfolio() {
  const [points, setPoints] = useState(2450);
  const [endorsed, setEndorsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEndorse = () => {
    if (endorsed) {
      alert("You have already endorsed this student for this semester.");
      return;
    }
    setPoints(points + 150);
    setEndorsed(true);
  };

  const skills = [
    { name: 'Full-Stack Development', color: '#2563eb' },
    { name: 'Machine Learning', color: '#10b981' },
    { name: 'UI/UX Design', color: '#ef4444' },
    { name: 'Cloud Architecture', color: '#2563eb' },
    { name: 'Technical Writing', color: '#6b7280' }
  ];

  return (
    <div className="container py-4 fade-in-slide">
      {/* Top Banner Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2 mb-0 text-muted fs-8">
          <span>Portal</span>
          <span>&gt;</span>
          <span>Students</span>
          <span>&gt;</span>
          <span className="text-dark fw-medium">Profile Viewer</span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="glass-input-group d-none d-md-block" style={{ width: '260px' }}>
            <span className="glass-input-icon"><Search size={16} /></span>
            <input 
              type="text" 
              className="glass-input py-1.5" 
              placeholder="Search students by name, reg number..." 
              style={{ fontSize: '0.8rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn border-0 p-1.5 text-muted hover-dark position-relative">
            <Bell size={18} />
            <span className="position-absolute top-1 start-3 px-1 bg-danger rounded-circle" style={{ width: '6px', height: '6px' }}></span>
          </button>
          <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
            SJ
          </div>
        </div>
      </div>

      {/* Main Student Card Box */}
      <div className="glass-panel p-4 mb-4">
        <div className="row g-4 align-items-center">
          {/* Left Column: Portrait */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="student-img-container">
              <span className="verified-profile-tag d-flex align-items-center gap-1">
                <ShieldCheck size={12} />
                Verified Profile
              </span>
              {/* CSS layout overlay representing student picture */}
              <div style={{ height: '220px', background: 'linear-gradient(180deg, #cbd5e1, #94a3b8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={72} className="text-white opacity-60" />
              </div>
            </div>
          </div>

          {/* Middle Column: Details */}
          <div className="col-12 col-md-8 col-lg-5">
            <div className="d-flex align-items-start justify-content-between mb-2">
              <div>
                <h4 className="fw-bold mb-1 text-dark font-heading">Arjun K. Varma</h4>
                <span className="text-muted fs-8 d-block mb-1">Registration No: 2021BCS0842</span>
                <span className="text-dark-emphasis fs-7 fw-semibold">Computer Science & Engineering</span>
              </div>
              
              {/* Rewards Points box */}
              <div className="bg-primary-subtle p-2 px-3 rounded-4 text-center border border-primary-subtle shadow-sm" style={{ minWidth: '100px' }}>
                <span className="text-muted d-block" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>TOTAL REWARDS</span>
                <span className="fs-5 fw-bold text-primary">{points.toLocaleString()}</span>
              </div>
            </div>

            {/* Badge */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <Award className="text-success" size={20} />
              <span className="fs-7 fw-bold text-dark">
                Current Badge: <span className="text-success">Gold Innovator</span>
              </span>
            </div>

            {/* Actions row */}
            <div className="d-flex align-items-center gap-2">
              <button 
                className={`btn ${endorsed ? 'btn-success' : 'btn-primary'} text-white fs-7 py-2 px-3 d-flex align-items-center gap-1.5 rounded-3 shadow-sm`}
                onClick={handleEndorse}
              >
                {endorsed ? <Check size={14} /> : <BookOpen size={14} />}
                <span>{endorsed ? 'Student Endorsed' : 'Endorse Student'}</span>
              </button>

              <button 
                className="btn btn-glass-secondary fs-7 py-2 px-3 d-flex align-items-center gap-1.5"
                onClick={() => alert("Downloading student academic dossier CV...")}
              >
                <Share2 size={14} />
                <span>Export CV</span>
              </button>
            </div>
          </div>

          {/* Right Column: Academic Health */}
          <div className="col-12 col-lg-4 border-start border-light d-none d-lg-block">
            <h6 className="fw-bold text-muted text-uppercase fs-8 mb-3 tracking-wider">Academic Health</h6>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between fs-7 text-dark fw-semibold mb-1">
                <span>CGPA Progress</span>
                <span>9.2 / 10</span>
              </div>
              <div className="progress-bar-glass" style={{ height: '6px' }}>
                <div className="progress-bar-fill progress-blue" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between fs-7 text-dark fw-semibold mb-1">
                <span>Attendance</span>
                <span>88%</span>
              </div>
              <div className="progress-bar-glass" style={{ height: '6px' }}>
                <div className="progress-bar-fill progress-blue" style={{ width: '88%', background: '#10b981' }}></div>
              </div>
            </div>

            <div className="p-2.5 rounded-3 mt-3 fs-8 text-primary bg-primary-subtle bg-opacity-25 border border-primary-subtle border-opacity-40 lh-sm font-normal">
              <em>"Arjun consistently demonstrates exceptional problem-solving skills in Algorithm Design labs."</em>
              <strong className="d-block text-end mt-1.5">— Dr. Sarah Chen</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Competencies Panel */}
      <div className="glass-panel p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-dark font-heading fw-bold">Skills & Competencies</h5>
          <a href="#taxonomy" className="text-decoration-none fs-7 text-primary fw-semibold" onClick={e=>e.preventDefault()}>View Taxonomy</a>
        </div>
        <div className="d-flex flex-wrap gap-2.5">
          {skills.map((skill, idx) => (
            <span key={idx} className="badge bg-white border text-dark-emphasis px-3 py-2 rounded-pill fs-7 fw-medium d-inline-flex align-items-center gap-1.5 shadow-sm">
              <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: skill.color }}></span>
              {skill.name}
            </span>
          ))}
          <span className="badge bg-light text-muted border px-3 py-2 rounded-pill fs-7 fw-semibold">+4 More</span>
        </div>
      </div>

      {/* Lower Details Timeline and Activities */}
      <div className="row g-4">
        
        {/* Achievements Timeline */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 h-100">
            <h5 className="mb-4 text-dark font-heading fw-bold">Achievement Timeline</h5>
            
            <div className="timeline-flow">
              {/* Item 1 */}
              <div className="timeline-item-row">
                <span className="timeline-bullet timeline-bullet-active"></span>
                <span className="text-muted fs-8 fw-semibold d-block">October 24, 2023</span>
                <h6 className="fw-bold text-dark font-heading fs-7 mt-0.5 mb-1.5">First Prize - Inter-University Hackathon</h6>
                <p className="fs-7 text-muted lh-sm mb-2">
                  Led a team of 4 to develop an AI-powered student wellness tracker using React and Node.js. Successfully deployed and demonstrated live API structures.
                </p>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-8 px-2 py-1 rounded">
                  +500 Points
                </span>
              </div>

              {/* Item 2 */}
              <div className="timeline-item-row mb-0">
                <span className="timeline-bullet"></span>
                <span className="text-muted fs-8 fw-semibold d-block">August 12, 2023</span>
                <h6 className="fw-bold text-dark font-heading fs-7 mt-0.5 mb-1.5">Research Paper Publication</h6>
                <p className="fs-7 text-muted lh-sm mb-2">
                  Published 'Adaptive Convolutional Architectures' in IEEE conference journals, modeling depth layers for edge devices.
                </p>
                <span className="badge bg-success-subtle text-success border border-success-subtle fs-8 px-2 py-1 rounded">
                  +400 Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 text-dark font-heading fw-bold">Recent Activity</h5>
              <a href="#activities" className="text-decoration-none fs-7 text-muted hover-dark fw-semibold" onClick={e=>e.preventDefault()}>View All</a>
            </div>

            <div className="d-flex flex-column gap-3.5">
              {/* Act 1 */}
              <div className="d-flex align-items-start gap-2.5">
                <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center p-2">
                  <Award size={18} />
                </div>
                <div>
                  <h6 className="mb-0 fs-7 fw-bold text-dark leading-sm">Dean's List Placement</h6>
                  <span className="text-muted fs-8 d-block mb-1">Academic Year 2022-23 Semester II</span>
                  <span className="text-success fs-8 fw-bold">+150 POINTS</span>
                </div>
              </div>

              {/* Act 2 */}
              <div className="d-flex align-items-start gap-2.5">
                <div className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center p-2">
                  <Activity size={18} />
                </div>
                <div>
                  <h6 className="mb-0 fs-7 fw-bold text-dark leading-sm">AWS Certified Practitioner</h6>
                  <span className="text-muted fs-8 d-block mb-1">External Certification Verified</span>
                  <span className="text-success fs-8 fw-bold">+200 POINTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
