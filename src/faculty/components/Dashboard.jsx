import React from 'react';
import { 
  FileText, Clock, BarChart3, RotateCw, CheckCircle2, 
  XCircle, MessageSquare, Flag, TrendingUp, AlertCircle, Plus 
} from 'lucide-react';

export default function Dashboard({ pendingCount, verifiedCount, setCurrentTab }) {
  const currentPending = pendingCount;
  const currentApproved = verifiedCount;
  const totalSubmissions = currentPending + currentApproved; // simplified total

  const recentActivity = [
    { name: "Arjun Sharma", detail: "Research Paper Publication", status: "Approved", color: "success" },
    { name: "Sarah Jenkins", detail: "Annual Hackathon 1st Place", status: "Pending", color: "primary" },
    { name: "Michael Chen", detail: "NSS Community Service", status: "Rejected", color: "danger" }
  ];

  const departmentPerformance = [
    { name: "Computer Science", value: 92, progressColor: "progress-blue" },
    { name: "Electronics", value: 78, progressColor: "progress-blue" },
    { name: "Mechanical", value: 64, progressColor: "progress-purple" },
    { name: "Bio-Technology", value: 50, progressColor: "progress-purple" }
  ];

  return (
    <div className="container py-4">
      {/* Top Banner section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Faculty Achievement Portal</h4>
        <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
          SJ
        </div>
      </div>

      {/* Top Workflow Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4" onClick={() => setCurrentTab('approvals')}>
          <div className="workflow-banner-card workflow-card-blue">
            <div>
              <span className="fs-8 opacity-75 fw-bold text-uppercase tracking-wider">Management</span>
              <h5 className="mb-0 font-heading fw-bold">Review Pending</h5>
            </div>
            <Clock size={28} className="opacity-90" />
          </div>
        </div>

        <div className="col-12 col-md-4" onClick={() => setCurrentTab('reports')}>
          <div className="workflow-banner-card workflow-card-grey">
            <div>
              <span className="fs-8 text-muted fw-bold text-uppercase tracking-wider">Export Data</span>
              <h5 className="mb-0 font-heading fw-bold">View Reports</h5>
            </div>
            <FileText size={28} className="text-muted" />
          </div>
        </div>

        <div className="col-12 col-md-4" onClick={() => setCurrentTab('analytics')}>
          <div className="workflow-banner-card workflow-card-green">
            <div>
              <span className="fs-8 opacity-75 fw-bold text-uppercase tracking-wider">Departmental</span>
              <h5 className="mb-0 font-heading fw-bold">Dept Analytics</h5>
            </div>
            <BarChart3 size={28} className="opacity-90" />
          </div>
        </div>
      </div>

      {/* Six small stats panel row */}
      <div className="row g-3 mb-4">
        {/* Stat 1 */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="mini-stat-panel">
            <div>
              <span className="text-muted fs-8 fw-semibold d-block">TOTAL</span>
              <h5 className="mb-0 fw-bold font-heading text-dark">{totalSubmissions}</h5>
            </div>
            <div className="mini-stat-circle text-primary bg-primary-subtle">
              <RotateCw size={14} />
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="mini-stat-panel">
            <div>
              <span className="text-muted fs-8 fw-semibold d-block">PENDING</span>
              <h5 className="mb-0 fw-bold font-heading text-warning">{currentPending}</h5>
            </div>
            <div className="mini-stat-circle text-warning bg-warning-subtle">
              <Clock size={14} />
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="mini-stat-panel">
            <div>
              <span className="text-muted fs-8 fw-semibold d-block">APPROVED</span>
              <h5 className="mb-0 fw-bold font-heading text-success">{currentApproved}</h5>
            </div>
            <div className="mini-stat-circle text-success bg-success-subtle">
              <CheckCircle2 size={14} />
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="mini-stat-panel">
            <div>
              <span className="text-muted fs-8 fw-semibold d-block">REJECTED</span>
              <h5 className="mb-0 fw-bold font-heading text-danger">18</h5>
            </div>
            <div className="mini-stat-circle text-danger bg-danger-subtle">
              <XCircle size={14} />
            </div>
          </div>
        </div>

        {/* Stat 5 */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="mini-stat-panel">
            <div>
              <span className="text-muted fs-8 fw-semibold d-block">IN REVIEW</span>
              <h5 className="mb-0 fw-bold font-heading text-secondary">125</h5>
            </div>
            <div className="mini-stat-circle text-secondary bg-secondary-subtle">
              <MessageSquare size={14} />
            </div>
          </div>
        </div>

        {/* Stat 6 */}
        <div className="col-6 col-sm-4 col-md-2">
          <div className="mini-stat-panel">
            <div>
              <span className="text-muted fs-8 fw-semibold d-block">FLAGGED</span>
              <h5 className="mb-0 fw-bold font-heading text-danger">06</h5>
            </div>
            <div className="mini-stat-circle text-danger bg-danger-subtle bg-opacity-75">
              <Flag size={14} className="text-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle row: Line chart and category breakdown */}
      <div className="row g-4 mb-4">
        {/* Verification trends Wave Chart */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 text-dark font-heading fw-bold">Monthly Verification Trends</h5>
              <select className="glass-input py-1 px-2 text-muted border-0 bg-transparent fs-7 fw-medium" style={{ width: '130px' }}>
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
              </select>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="position-relative w-100" style={{ height: '220px' }}>
              <svg className="w-100 h-100" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

                {/* Shading beneath the wave */}
                <path
                  d="M 0,160 C 80,180 150,110 220,130 C 290,150 360,70 430,90 C 470,100 500,80 500,80 L 500,180 L 0,180 Z"
                  fill="url(#wave-gradient)"
                  className="svg-wave-area"
                />
                
                {/* Wave Curve */}
                <path
                  d="M 0,160 C 80,180 150,110 220,130 C 290,150 360,70 430,90 C 470,100 500,80 500,80"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="svg-wave-path"
                />

                {/* Dots on points */}
                <circle cx="220" cy="130" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="430" cy="90" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

                <defs>
                  <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="position-absolute bottom-0 w-100 d-flex justify-content-between px-1 text-muted fs-8 fw-semibold mt-2">
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span>MAY</span>
                <span>JUN</span>
                <span>JUL</span>
              </div>
            </div>
            
            <div className="text-center text-muted fs-8 mt-3">
              <TrendingUp size={12} className="me-1 text-primary" />
              <span>Line Chart Visualization: Verification Velocity</span>
            </div>
          </div>
        </div>

        {/* Category donut breakdown */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 h-100">
            <h5 className="mb-4 text-dark font-heading fw-bold">Achievement Categories</h5>
            
            {/* SVG Donut Chart */}
            <div className="d-flex align-items-center justify-content-center position-relative mb-4" style={{ height: '140px' }}>
              <svg width="130" height="130" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="rgba(0,0,0,0.03)" strokeWidth="3" />
                {/* Academic segment (45% -> dasharray 45 55, offset 25) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#2563eb" strokeWidth="3.5" strokeDasharray="45 55" strokeDashoffset="25" />
                {/* Research segment (25% -> dasharray 25 75, offset 80) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#10b981" strokeWidth="3.5" strokeDasharray="25 75" strokeDashoffset="80" />
                {/* Sports segment (20% -> dasharray 20 80, offset 5) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="5" />
                {/* Cultural segment (10% -> dasharray 10 90, offset -15) */}
                <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#6b7280" strokeWidth="3.5" strokeDasharray="10 90" strokeDashoffset="-15" />
              </svg>
              <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
                <span className="fs-4 fw-bold text-dark leading-none">12</span>
                <span className="text-muted fs-8">Types</span>
              </div>
            </div>

            {/* Legend layout */}
            <div className="row g-2">
              <div className="col-6">
                <div className="d-flex align-items-center gap-1.5 fs-8 text-muted">
                  <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                  <span>Academic</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-1.5 fs-8 text-muted">
                  <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }}></div>
                  <span>Research</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-1.5 fs-8 text-muted">
                  <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#ef4444' }}></div>
                  <span>Sports</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center gap-1.5 fs-8 text-muted">
                  <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#6b7280' }}></div>
                  <span>Cultural</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rows */}
      <div className="row g-4">
        {/* Recent Activity */}
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-dark font-heading fw-bold">Recent Activity</h5>
              <a href="#viewall" className="text-decoration-none fs-7 text-primary fw-semibold" onClick={(e) => { e.preventDefault(); setCurrentTab('approvals'); }}>
                View All
              </a>
            </div>

            <div className="d-flex flex-column gap-3.5 mt-3">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2.5">
                    <div className="bg-secondary-subtle text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                      {act.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h6 className="mb-0 fs-7 fw-bold text-dark">{act.name}</h6>
                      <span className="text-muted fs-8">{act.detail}</span>
                    </div>
                  </div>
                  <span className={`badge px-2.5 py-1.5 rounded-pill fw-semibold fs-8 bg-${act.color}-subtle text-${act.color}`}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100 position-relative">
            <h5 className="mb-4 text-dark font-heading fw-bold">Department Performance</h5>

            <div className="d-flex flex-column gap-3 mb-2">
              {departmentPerformance.map((dept, i) => (
                <div key={i}>
                  <div className="d-flex justify-content-between fs-7 text-dark fw-semibold mb-1">
                    <span>{dept.name}</span>
                    <span>{dept.value}%</span>
                  </div>
                  <div className="progress-bar-glass" style={{ height: '6px' }}>
                    <div 
                      className={`progress-bar-fill ${dept.progressColor}`} 
                      style={{ width: `${dept.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual Verification Button */}
            <div className="text-end mt-4">
              <button 
                className="btn btn-outline-primary fs-7 rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1"
                onClick={() => alert("Initializing manual override verification...")}
              >
                <Plus size={14} />
                Manual Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
