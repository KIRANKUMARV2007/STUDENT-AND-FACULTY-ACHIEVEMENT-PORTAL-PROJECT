import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  GraduationCap, Lightbulb, Trophy, Calendar, CheckCircle2, 
  XCircle, Star, Building2, MoreVertical, Eye, Check, X, Bell 
} from 'lucide-react';

interface ActivityItem {
  id: string;
  name: string;
  avatar: string;
  title: string;
  category: string;
  status: string;
}

export const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalAchievements: 0,
    pendingApprovals: 0,
    totalApproved: 0,
    totalRejected: 0,
    pointsAwarded: 0,
    activeDepts: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      const { count: facultyCount } = await supabase.from('faculty').select('*', { count: 'exact', head: true });
      const { count: deptCount } = await supabase.from('departments').select('*', { count: 'exact', head: true });
      
      const { data: achievements } = await supabase
        .from('achievements')
        .select(`
          id, title, status, created_at,
          category:achievement_categories(name, base_points),
          student:students!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (achievements) {
        let pending = 0, approved = 0, rejected = 0, points = 0;
        
        achievements.forEach(a => {
          if (a.status === 'Pending') pending++;
          if (a.status === 'Approved') {
            approved++;
            points += a.category?.base_points || 0;
          }
          if (a.status === 'Rejected') rejected++;
        });

        const recentActivities = achievements.slice(0, 8).map(a => ({
          id: a.id,
          name: `${a.student.first_name} ${a.student.last_name}`,
          avatar: a.student.first_name[0],
          title: a.title,
          category: a.category?.name?.toUpperCase() || 'GENERAL',
          status: a.status.toUpperCase()
        }));

        setStats({
          totalStudents: studentCount || 0,
          totalFaculty: facultyCount || 0,
          totalAchievements: achievements.length,
          pendingApprovals: pending,
          totalApproved: approved,
          totalRejected: rejected,
          pointsAwarded: points,
          activeDepts: deptCount || 0
        });
        setActivities(recentActivities);
      }
    };
    fetchData();

    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const primaryStats = [
    { label: 'Total Students', value: stats.totalStudents, change: 'Active', isPositive: true, icon: <GraduationCap size={24} />, color: '#2563eb' },
    { label: 'Total Faculty', value: stats.totalFaculty, change: 'Active', isPositive: null, icon: <Lightbulb size={24} />, color: '#0ea5e9' },
    { label: 'Total Achievements', value: stats.totalAchievements, change: 'All time', isPositive: true, icon: <Trophy size={24} />, color: '#eab308' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, change: 'Needs Review', isPositive: false, icon: <Calendar size={24} />, color: '#ef4444' }
  ];

  const subStats = [
    { label: 'Total Approved', value: stats.totalApproved, icon: <CheckCircle2 size={16} className="text-success" /> },
    { label: 'Total Rejected', value: stats.totalRejected, icon: <XCircle size={16} className="text-danger" /> },
    { label: 'Points Awarded', value: stats.pointsAwarded, icon: <Star size={16} className="text-warning" /> },
    { label: 'Active Depts', value: stats.activeDepts, icon: <Building2 size={16} className="text-primary" /> }
  ];

  const handleStatusChange = (id: string, newStatus: string) => {
    // Note: status changes should happen through the verification module ideally, but this mocks the UI reaction
    setActivities(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="fade-in-up">
      {/* Header Overview Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">Dashboard Overview</h4>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Overview metrics, analytics growth, and recent activity logs</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="glass-badge">
            <span className="fw-semibold text-primary">Last synced: 2m ago</span>
          </div>
          <button className="btn btn-light position-relative p-2 rounded-3 border-0">
            <Bell size={18} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ padding: '4px', fontSize: '0.6rem' }}>●</span>
          </button>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="row g-3 mb-4">
        {primaryStats.map((stat, i) => (
          <div key={i} className="col-12 col-sm-6 col-xl-3">
            <div className="glass-panel glass-panel-hover p-4 d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>{stat.label}</span>
                  {stat.change && (
                    <span 
                      className={`badge border-0 bg-opacity-10 px-2 py-1`}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: stat.isPositive === true ? 'rgba(16, 185, 129, 0.1)' : stat.isPositive === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: stat.isPositive === true ? '#10b981' : stat.isPositive === false ? '#ef4444' : '#64748b'
                      }}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
                <h2 className="fw-bold mb-0 text-primary">{stat.value}</h2>
              </div>
              <div 
                className="p-3 rounded-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Statistics Row */}
      <div className="row g-3 mb-4">
        {subStats.map((stat, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="glass-panel p-3 d-flex align-items-center gap-3">
              <div className="p-2 rounded-2 bg-light d-flex align-items-center justify-content-center">
                {stat.icon}
              </div>
              <div>
                <span className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>{stat.label}</span>
                <strong className="text-primary" style={{ fontSize: '1rem' }}>{stat.value}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Monthly Achievement Growth Bar Chart */}
        <div className="col-12 col-xl-7">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h6 className="fw-bold mb-0 text-primary">Monthly Achievement Growth</h6>
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Performance benchmark by categories</span>
              </div>
              <select className="form-select bg-light border-0 py-1 px-3" style={{ width: '135px', borderRadius: '10px', fontSize: '0.8rem' }}>
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
              </select>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="d-flex align-items-end justify-content-between w-100 px-2" style={{ height: '220px' }}>
              {[
                { label: 'JAN', val: 70, color: 'rgba(37,99,235,0.4)', active: false },
                { label: 'FEB', val: 95, color: 'rgba(37,99,235,0.4)', active: false },
                { label: 'MAR', val: 85, color: 'rgba(37,99,235,0.4)', active: false },
                { label: 'APR', val: 145, color: 'rgba(37,99,235,0.4)', active: false },
                { label: 'MAY', val: 125, color: 'rgba(37,99,235,0.4)', active: false },
                { label: 'JUN', val: 195, color: 'var(--primary-brand)', active: true }
              ].map((bar, i) => (
                <div key={i} className="d-flex flex-column align-items-center w-100 position-relative h-100 justify-content-end">
                  <div 
                    className="w-50 rounded-top transition-all duration-300"
                    style={{ 
                      height: `${(bar.val / 220) * 100}%`, 
                      background: bar.active 
                        ? 'linear-gradient(180deg, var(--primary-brand) 0%, rgba(37,99,235,0.4) 100%)' 
                        : 'linear-gradient(180deg, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0.1) 100%)',
                      border: bar.active ? '1px solid rgba(255,255,255,0.5)' : 'none',
                      boxShadow: bar.active ? '0 0 15px rgba(37,99,235,0.3)' : 'none',
                      cursor: 'pointer'
                    }}
                    title={`${bar.label}: ${bar.val} submissions`}
                  ></div>
                  <span className="text-secondary mt-2 fw-semibold" style={{ fontSize: '0.72rem' }}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Distribution Doughnut Chart */}
        <div className="col-12 col-xl-5">
          <div className="glass-panel p-4 h-100">
            <h6 className="fw-bold mb-4 text-primary">Department Distribution</h6>
            <div className="d-flex align-items-center justify-content-center gap-4 py-2">
              
              {/* SVG Doughnut Chart */}
              <div className="position-relative" style={{ width: '130px', height: '130px' }}>
                <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                  <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
                  <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(0,0,0,0.05)" strokeWidth="4.5"></circle>
                  
                  {/* Computer Science (45%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--primary-brand)" strokeWidth="4.5" strokeDasharray="45 55" strokeDashoffset="25"></circle>
                  
                  {/* Engineering (30%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0ea5e9" strokeWidth="4.5" strokeDasharray="30 70" strokeDashoffset="80"></circle>
                  
                  {/* Management (15%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#eab308" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="50"></circle>
                  
                  {/* Others (10%) */}
                  <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="10 90" strokeDashoffset="35"></circle>
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <span className="fw-bold d-block text-primary" style={{ fontSize: '1.2rem' }}>7</span>
                  <span className="text-secondary" style={{ fontSize: '0.65rem' }}>Depts</span>
                </div>
              </div>

              {/* Legend */}
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary-brand)' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Comp Sci (45%)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#0ea5e9' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Engineering (30%)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#eab308' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Business (15%)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#10b981' }}></span>
                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Others (10%)</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Point accumulation spline trend & top categories */}
      <div className="row g-4 mb-4">
        {/* Trend Area spline chart */}
        <div className="col-12 col-xl-7">
          <div className="glass-panel p-4 h-100">
            <h6 className="fw-bold mb-3 text-primary">Point Accumulation Trend</h6>
            <div className="w-100 pt-3 position-relative" style={{ height: '140px' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(37,99,235,0.25)"></stop>
                    <stop offset="100%" stopColor="rgba(37,99,235,0.0)"></stop>
                  </linearGradient>
                </defs>
                {/* Spline Path */}
                <path 
                  d="M0,80 Q50,95 100,60 T200,85 T300,30" 
                  fill="url(#chartGlow)" 
                />
                <path 
                  d="M0,80 Q50,95 100,60 T200,85 T300,30" 
                  fill="none" 
                  stroke="var(--primary-brand)" 
                  strokeWidth="2.5" 
                />
                {/* Highlight dot */}
                <circle cx="300" cy="30" r="4" fill="var(--primary-brand)" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Top Categories block */}
        <div className="col-12 col-xl-5">
          <div className="glass-panel p-4 h-100">
            <h6 className="fw-bold mb-3 text-primary">Top Categories</h6>
            <div className="d-flex flex-column gap-2.5">
              {[
                { label: 'Academic Achievements', val: '482 pts', color: 'rgba(37,99,235,0.1)', text: 'var(--primary-brand)' },
                { label: 'Sports & Games', val: '312 pts', color: 'rgba(14,165,233,0.1)', text: '#0ea5e9' },
                { label: 'Cultural & Arts', val: '256 pts', color: 'rgba(234,179,8,0.1)', text: '#d97706' },
                { label: 'Community Service', val: '188 pts', color: 'rgba(16,185,129,0.1)', text: '#10b981' }
              ].map((cat, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-2.5 rounded-3" style={{ backgroundColor: cat.color }}>
                  <span className="fw-semibold text-secondary" style={{ fontSize: '0.8rem' }}>{cat.label}</span>
                  <span className="badge border-0 rounded-pill fw-bold" style={{ backgroundColor: '#ffffff', color: cat.text, fontSize: '0.75rem', padding: '6px 12px' }}>
                    {cat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="glass-panel p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h6 className="fw-bold mb-0 text-primary">Recent Activity</h6>
            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Latest student and faculty submissions verified by portal</span>
          </div>
          <button className="btn btn-sm btn-glass-outline">
            <span>View All Records</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Achievement</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={act.avatar} 
                        alt={act.name} 
                        className="rounded-circle object-cover"
                        style={{ width: '32px', height: '32px' }}
                      />
                      <span className="fw-semibold text-primary">{act.name}</span>
                    </div>
                  </td>
                  <td>{act.title}</td>
                  <td>
                    <span 
                      className="badge border-0 rounded-pill fw-bold" 
                      style={{ 
                        fontSize: '0.7rem',
                        padding: '4px 10px',
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {act.category}
                    </span>
                  </td>
                  <td>
                    <span className={`glass-badge ${act.status === 'APPROVED' ? 'glass-badge-success' : act.status === 'REJECTED' ? 'glass-badge-danger' : 'glass-badge-warning'}`}>
                      {act.status}
                    </span>
                  </td>
                  <td className="text-end position-relative">
                    <button 
                      onClick={(e) => handleDropdownToggle(act.id, e)}
                      className="btn btn-sm border-0 p-1 bg-transparent text-secondary"
                      aria-label="Actions"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdown === act.id && (
                      <div 
                        className="position-absolute end-0 bg-white glass-panel py-2 shadow" 
                        style={{ 
                          width: '150px', 
                          zIndex: 1000, 
                          borderRadius: '12px',
                          border: '1px solid var(--glass-border)',
                          transform: 'translateY(4px)'
                        }}
                      >
                        <button 
                          onClick={() => handleStatusChange(act.id, 'APPROVED')}
                          className="dropdown-item px-3 py-2 text-start w-100 border-0 bg-transparent text-success fw-semibold"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <Check size={14} className="me-2" /> Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(act.id, 'REJECTED')}
                          className="dropdown-item px-3 py-2 text-start w-100 border-0 bg-transparent text-danger fw-semibold"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <X size={14} className="me-2" /> Reject
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm(`View details for ${act.name}?`)) {}
                            setActiveDropdown(null);
                          }}
                          className="dropdown-item px-3 py-2 text-start w-100 border-0 bg-transparent text-primary fw-semibold"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <Eye size={14} className="me-2" /> Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
