import React from 'react';
import { 
  Users, Award, Clock, Percent, ThumbsUp, Search, 
  TrendingUp, Activity, CheckCircle, Eye, ArrowUpRight, ChevronRight 
} from 'lucide-react';

export default function DepartmentAnalytics({ verifiedCount, pendingCount }) {
  // Stat values matching reference image
  // Note: We can make some values reactive to actions performed in the queue
  const totalStudents = 1284;
  const initialAchievements = 4821;
  const currentAchievements = initialAchievements + (3 - pendingCount); 

  const performanceMajors = [
    { name: 'Computer Science', engagement: 92 },
    { name: 'Electrical Engineering', engagement: 78 },
    { name: 'Mechanical Engineering', engagement: 64 },
    { name: 'Civil Engineering', engagement: 45 }
  ];

  const topPerformers = [
    { rank: 1, name: 'Chen Wei', major: 'CS Senior', points: 42, avatar: 'CW' },
    { rank: 2, name: 'Amira Zahra', major: 'EE Junior', points: 38, avatar: 'AZ' },
    { rank: 3, name: 'Marcus Johnson', major: 'ME Soph', points: 35, avatar: 'MJ' },
    { rank: 4, name: 'Sarah Connor', major: 'CS Soph', points: 31, avatar: 'SC' }
  ];

  const facultyActivity = [
    { name: 'Dr. Sarah Jenkins', dept: 'CS Dept', verified: 156, time: '0.8 days', status: 'Active' },
    { name: 'Prof. Robert Pires', dept: 'EE Dept', verified: 132, time: '1.2 days', status: 'Active' },
    { name: 'Dr. Elena Martinez', dept: 'ME Dept', verified: 94, time: '2.5 days', status: 'On Leave' }
  ];

  // custom bar values for "Monthly Achievement Trend"
  const monthlyData = [
    { month: 'Feb', value: 35, count: 142 },
    { month: 'Mar', value: 48, count: 198 },
    { month: 'Apr', value: 62, count: 254 },
    { month: 'May', value: 74, count: 310 },
    { month: 'Jun', value: 85, count: 355 },
    { month: 'Jul', value: 98, count: 421 }
  ];

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (90 / 100) * circumference;

  return (
    <div className="container py-4">
      {/* Top Banner section matching headers */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Department Analytics</h4>
        
        <div className="d-flex align-items-center gap-3">
          <div className="glass-input-group d-none d-md-block" style={{ width: '220px' }}>
            <span className="glass-input-icon"><Search size={16} /></span>
            <input type="text" className="glass-input py-1.5" placeholder="Search analytics..." style={{ fontSize: '0.8rem' }} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="text-end d-none d-sm-block">
              <h6 className="mb-0 fs-7 fw-bold text-dark font-heading">Dr. Sarah Jenkins</h6>
              <span className="text-muted fs-8">HEAD OF DEPARTMENT</span>
            </div>
            <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
              SJ
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Stat Row */}
      <div className="row g-3 mb-4">
        {/* Metric 1 */}
        <div className="col-6 col-md-4 col-lg">
          <div className="glass-panel p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="p-2 rounded bg-primary-subtle text-primary">
                <Users size={18} />
              </div>
              <span className="badge bg-success-subtle text-success fs-8">+12%</span>
            </div>
            <span className="text-muted fs-7 fw-medium d-block">Total Students</span>
            <h4 className="mb-0 fw-bold text-dark font-heading mt-1">{totalStudents.toLocaleString()}</h4>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-6 col-md-4 col-lg">
          <div className="glass-panel p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="p-2 rounded bg-success-subtle text-success">
                <Award size={18} />
              </div>
              <span className="badge bg-success-subtle text-success fs-8">+8.4%</span>
            </div>
            <span className="text-muted fs-7 fw-medium d-block">Total Achievements</span>
            <h4 className="mb-0 fw-bold text-dark font-heading mt-1">{currentAchievements.toLocaleString()}</h4>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-6 col-md-4 col-lg">
          <div className="glass-panel p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="p-2 rounded bg-warning-subtle text-warning">
                <Clock size={18} />
              </div>
              <span className="badge bg-danger-subtle text-danger fs-8">-2.1%</span>
            </div>
            <span className="text-muted fs-7 fw-medium d-block">Pending Approval</span>
            <h4 className="mb-0 fw-bold text-dark font-heading mt-1">{pendingCount}</h4>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-6 col-md-4 col-lg">
          <div className="glass-panel p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="p-2 rounded bg-info-subtle text-info">
                <Percent size={18} />
              </div>
              <span className="badge bg-primary-subtle text-primary fs-8">98.2%</span>
            </div>
            <span className="text-muted fs-7 fw-medium d-block">Approval Rate</span>
            <h4 className="mb-0 fw-bold text-dark font-heading mt-1">94.5%</h4>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="col-6 col-md-4 col-lg">
          <div className="glass-panel p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="p-2 rounded bg-danger-subtle text-danger">
                <ThumbsUp size={18} />
              </div>
              <span className="badge bg-success-subtle text-success fs-8">Elite</span>
            </div>
            <span className="text-muted fs-7 fw-medium d-block">Avg Score</span>
            <h4 className="mb-0 fw-bold text-dark font-heading mt-1">4.8/5</h4>
          </div>
        </div>
      </div>

      {/* Middle Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Trend Bar Chart */}
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-dark font-heading fw-bold">Monthly Achievement Trend</h5>
              <select className="glass-input py-1 px-2 text-muted border-0 bg-transparent fs-7 fw-medium" style={{ width: '130px' }}>
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
              </select>
            </div>

            {/* Custom Bar Graph */}
            <div className="custom-bar-chart">
              <div className="chart-axis-line"></div>
              {monthlyData.map((d, index) => (
                <div key={d.month} className="custom-bar-col">
                  <div 
                    className="chart-bar-fill w-100" 
                    style={{ height: `${d.value}%` }}
                  >
                    <div className="chart-tooltip">{d.count} items</div>
                  </div>
                  <div className="chart-bar-label">{d.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Circular gauge */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-4 h-100 text-center">
            <h5 className="mb-4 text-start text-dark font-heading fw-bold">Approval Rate</h5>
            
            {/* SVG Circle Ring */}
            <div className="custom-gauge-container mb-3">
              <svg width="120" height="120" className="custom-gauge-circle">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="url(#blue-gradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="gauge-center-text">
                <span className="fs-3 fw-bold text-dark font-heading leading-none">90%</span>
                <span className="text-muted fs-8">Verified</span>
              </div>
            </div>

            <span className="text-muted fs-7 d-block">
              Average processing speed: <strong className="text-dark">1.4 days</strong>
            </span>
          </div>
        </div>

        {/* Breakdown category list */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-4 h-100">
            <h5 className="mb-4 text-dark font-heading fw-bold">Achievement Types</h5>
            
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-primary" style={{ width: '10px', height: '10px' }}></div>
                  <span className="fs-7 text-muted fw-medium">Academic</span>
                </div>
                <span className="fs-7 fw-bold text-dark">45%</span>
              </div>
              
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#10b981' }}></div>
                  <span className="fs-7 text-muted fw-medium">Sports</span>
                </div>
                <span className="fs-7 fw-bold text-dark">25%</span>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#6b7280' }}></div>
                  <span className="fs-7 text-muted fw-medium">Community</span>
                </div>
                <span className="fs-7 fw-bold text-dark">20%</span>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b' }}></div>
                  <span className="fs-7 text-muted fw-medium">Arts</span>
                </div>
                <span className="fs-7 fw-bold text-dark">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Leaderboard and Major Engagements */}
      <div className="row g-4 mb-4">
        {/* Performance by Major */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 text-dark font-heading fw-bold">Performance by Major</h5>
              <button className="btn border-0 text-muted p-1"><Activity size={18} /></button>
            </div>

            <div className="d-flex flex-column gap-3.5">
              {performanceMajors.map((major) => (
                <div key={major.name}>
                  <div className="d-flex justify-content-between fs-7 text-dark fw-semibold mb-1.5">
                    <span>{major.name}</span>
                    <span>{major.engagement}% Engagement</span>
                  </div>
                  <div className="progress-bar-glass" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar-fill progress-blue" 
                      style={{ width: `${major.engagement}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers Leaderboard */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 h-100">
            <h5 className="mb-4 text-dark font-heading fw-bold">Top Performers</h5>
            
            <div className="d-flex flex-column gap-3">
              {topPerformers.map((student) => (
                <div key={student.rank} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2.5">
                    <span className={`fs-7 fw-bold text-center rounded-circle d-flex align-items-center justify-content-center`} style={{ 
                      width: '24px', 
                      height: '24px', 
                      backgroundColor: student.rank === 1 ? '#fef3c7' : student.rank === 2 ? '#f1f5f9' : student.rank === 3 ? '#ffedd5' : 'transparent',
                      color: student.rank === 1 ? '#b45309' : student.rank === 2 ? '#475569' : student.rank === 3 ? '#c2410c' : '#64748b'
                    }}>
                      {student.rank}
                    </span>
                    <div className="bg-secondary-subtle text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                      {student.avatar}
                    </div>
                    <div>
                      <h6 className="mb-0 fs-7 fw-bold text-dark">{student.name}</h6>
                      <span className="text-muted fs-8">{student.major}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="fs-7 fw-bold text-primary">{student.points}</span>
                    <span className="text-muted fs-8 d-block leading-none">Points</span>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-3 opacity-10" />
            <a href="#students" className="text-decoration-none text-primary fw-semibold fs-7 d-flex align-items-center justify-content-center gap-1">
              <span>View All Students</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Faculty Activity Report Table */}
      <div className="row">
        <div className="col-12">
          <div className="glass-panel p-4">
            <h5 className="mb-4 text-dark font-heading fw-bold">Faculty Activity Report</h5>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted border-0 small text-uppercase">
                    <th scope="col" className="border-0">Faculty Member</th>
                    <th scope="col" className="border-0 text-center">Achievements Verified</th>
                    <th scope="col" className="border-0 text-center">Avg. Response Time</th>
                    <th scope="col" className="border-0 text-center">Department Status</th>
                    <th scope="col" className="border-0 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyActivity.map((faculty, idx) => (
                    <tr key={idx} className="border-bottom" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                            {faculty.name.split(' ').filter((_, i) => i > 0).map(n => n[0]).join('') || 'F'}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark fs-7">{faculty.name}</div>
                            <div className="text-muted fs-8">{faculty.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 text-dark fw-medium fs-7">{faculty.verified}</td>
                      <td className="text-center py-3 text-muted fs-7">{faculty.time}</td>
                      <td className="text-center py-3">
                        <span className={`badge px-2.5 py-1.5 rounded-pill fw-semibold fs-8 ${
                          faculty.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                        }`}>
                          {faculty.status}
                        </span>
                      </td>
                      <td className="text-end py-3">
                        <button className="btn border-0 text-muted p-1 hover-dark"><Eye size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr className="my-3.5 opacity-10" />
            <a href="#faculty" className="text-decoration-none text-muted hover-dark fw-semibold fs-7 d-flex align-items-center justify-content-center gap-1">
              <span>View Full Faculty Directory</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
