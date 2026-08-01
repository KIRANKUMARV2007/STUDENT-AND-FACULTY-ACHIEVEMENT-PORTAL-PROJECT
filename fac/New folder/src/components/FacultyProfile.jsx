import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Award, CheckSquare, 
  Clock, Gauge, Edit, Lock, ShieldCheck 
} from 'lucide-react';

export default function FacultyProfile() {
  const [activeSegment, setActiveSegment] = useState('Monthly');
  
  // Stats matching screenshot
  const stats = [
    { title: "Total Verified", value: "148", desc: "+12% vs last sem", icon: CheckSquare, color: "success" },
    { title: "Pending Reviews", value: "24", desc: "Active Queue", icon: Clock, color: "primary" },
    { title: "Avg Approval Time", value: "18.5h", desc: "-2.4h improvement", icon: Gauge, color: "secondary" },
  ];

  // Activity graph metrics
  const barMetrics = [25, 40, 32, 50, 62, 78];
  const months = ['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];

  return (
    <div className="container py-4 fade-in-slide">
      {/* Top Banner section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Faculty Profile</h4>
        <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
          SM
        </div>
      </div>

      {/* Main Profile Detail Box */}
      <div className="glass-panel p-4 mb-4">
        <div className="row g-4 align-items-center">
          {/* Circular Portrait Image */}
          <div className="col-12 col-md-4 col-lg-3 text-center">
            <div className="student-img-container mx-auto" style={{ width: '160px', height: '160px', borderRadius: '50%' }}>
              <div style={{ height: '100%', background: 'linear-gradient(135deg, #475569, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={64} className="text-white opacity-50" />
              </div>
            </div>
          </div>

          {/* Details Metadata Grid */}
          <div className="col-12 col-md-8 col-lg-9">
            <h3 className="fw-bold mb-1 text-dark font-heading text-center text-md-start">Dr. Sarah Montgomery</h3>
            <span className="text-primary fw-semibold fs-6 d-block mb-3 text-center text-md-start">Senior Professor, Computer Science</span>

            {/* Profile Grid items */}
            <div className="row g-3 fs-7.5 text-muted mb-4">
              <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                <Award size={16} className="text-primary flex-shrink-0" />
                <span>Faculty ID: <strong>F-2023-0492</strong></span>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>Email: <strong>s.montgomery@university.edu</strong></span>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                <span>Dept: <strong>Advanced Computing</strong></span>
              </div>
              <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>Phone: <strong>+1 (555) 012-3456</strong></span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
              <button 
                className="btn btn-primary text-white fs-7 py-2 px-3 d-flex align-items-center gap-1.5 rounded-3 shadow-sm"
                onClick={() => alert("Loading profile editor parameters...")}
              >
                <Edit size={14} />
                Edit Profile
              </button>

              <button 
                className="btn btn-outline-primary fs-7 py-2 px-3 d-flex align-items-center gap-1.5 rounded-3"
                onClick={() => alert("Initializing change password security flow...")}
              >
                <Lock size={14} />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats indicators row */}
      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="col-12 col-md-4">
              <div className="glass-panel p-3.5 h-100 d-flex justify-content-between align-items-start">
                <div>
                  <span className="text-muted fs-8 fw-semibold d-block text-uppercase mb-1">{stat.title}</span>
                  <h3 className="mb-0 fw-bold font-heading text-dark">{stat.value}</h3>
                  <span className="text-muted fs-8 mt-1.5 d-block">{stat.desc}</span>
                </div>
                <div className={`mini-stat-circle text-${stat.color} bg-${stat.color}-subtle`} style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <Icon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Overview card container */}
      <div className="glass-panel p-4 mb-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-0 text-dark font-heading fw-bold">Activity Overview</h5>
            <span className="text-muted fs-8">Achievements processed over the last 6 months</span>
          </div>

          {/* Segmented Picker */}
          <div className="d-flex bg-white bg-opacity-30 border p-0.5 rounded-3">
            {['Monthly', 'Weekly'].map((seg) => (
              <button
                key={seg}
                className={`btn border-0 py-1 px-3 fs-8 fw-semibold rounded-2 ${
                  activeSegment === seg ? 'bg-white text-dark shadow-sm' : 'text-muted bg-transparent'
                }`}
                onClick={() => setActiveSegment(seg)}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        {/* Processed Graph Visual Grid */}
        <div className="visual-grid-container px-3">
          {barMetrics.map((val, i) => (
            <div key={i} className="d-flex flex-column align-items-center" style={{ width: '50px' }}>
              <div className="visual-grid-bar" style={{ height: `${val * 1.5}px`, width: '16px' }}></div>
              <span className="text-muted fs-8 fw-semibold mt-2">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
