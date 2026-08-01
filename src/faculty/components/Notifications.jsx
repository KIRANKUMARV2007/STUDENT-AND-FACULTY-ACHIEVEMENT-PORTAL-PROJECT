import React, { useState } from 'react';
import { 
  Bell, Search, Check, AlertCircle, X, ShieldAlert, 
  Calendar, FileText, Settings, Sparkles 
} from 'lucide-react';

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('Today');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Achievement Approval Required",
      message: "Professor Adams has submitted a new International Research Grant achievement for your review and verification.",
      time: "12:45 PM",
      category: "Today",
      color: "blue",
      actions: true,
      icon: FileText
    },
    {
      id: 2,
      title: "Annual Report Verified",
      message: "The Department of Engineering annual achievement report has been successfully verified by the Central Committee.",
      time: "09:15 AM",
      category: "Today",
      color: "green",
      actions: false,
      icon: Check
    },
    {
      id: 3,
      title: "Deadline Reminder: Accreditation",
      message: "The submission window for the NAAC Accreditation Portfolio closes in 48 hours. Multiple student portfolios are still pending.",
      time: "Yesterday",
      category: "Today",
      color: "red",
      actions: false,
      icon: ShieldAlert
    },
    {
      id: 4,
      title: "Weekly Analytics Available",
      message: "Your weekly department productivity report has been generated. Faculty engagement is up 12% from last week.",
      time: "Tuesday",
      category: "This Week",
      color: "orange",
      actions: false,
      icon: Settings
    },
    {
      id: 5,
      title: "Portal Maintenance Notice",
      message: "The Achievement Portal will be offline for scheduled maintenance this Sunday from 2:00 AM to 4:00 AM GMT.",
      time: "Monday",
      category: "This Week",
      color: "blue",
      actions: false,
      icon: Calendar
    }
  ]);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    alert("All notifications marked as read.");
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'Today') return n.category === 'Today';
    if (activeFilter === 'This Week') return n.category === 'Today' || n.category === 'This Week';
    return true; // This Month
  });

  return (
    <div className="container py-4">
      {/* Top Banner Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Notifications</h4>
        
        <div className="d-flex align-items-center gap-3">
          <div className="glass-input-group d-none d-md-block" style={{ width: '220px' }}>
            <span className="glass-input-icon"><Search size={16} /></span>
            <input type="text" className="glass-input py-1.5" placeholder="Search alerts..." style={{ fontSize: '0.8rem' }} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="text-end d-none d-sm-block">
              <h6 className="mb-0 fs-7 fw-bold text-dark font-heading">Dr. Sarah Jenkins</h6>
              <span className="text-muted fs-8">DEAN OF RESEARCH</span>
            </div>
            <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
              SJ
            </div>
          </div>
        </div>
      </div>

      {/* Main title */}
      <div className="mb-4">
        <h3 className="mb-1 fw-bold text-dark font-heading">System Alerts</h3>
        <p className="text-muted small">Stay up to date with student submissions, audits, and deadlines.</p>
      </div>

      {/* Filters Sub-header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2 bg-white bg-opacity-30 border p-1 rounded-3">
          {['Today', 'This Week', 'This Month'].map((f) => (
            <button
              key={f}
              className={`btn border-0 py-1.5 px-3 fs-7 fw-semibold rounded-2 transition-all ${
                activeFilter === f ? 'bg-white text-dark shadow-sm' : 'text-muted bg-transparent'
              }`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        
        <button 
          className="btn border-0 text-primary fw-semibold fs-7 d-flex align-items-center gap-1 hover-dark"
          onClick={handleMarkAllRead}
        >
          <Check size={16} />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notification Lists and Grid */}
      <div className="row g-4">
        {/* Main Notifications Flow */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4">
            <h6 className="fw-bold text-muted text-uppercase fs-8 mb-3 tracking-wider">Recent</h6>

            <div className="d-flex flex-column gap-1">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <Bell size={32} className="mx-auto opacity-35 mb-2" />
                  <p className="mb-0 fs-7">No notifications found.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div 
                      key={notif.id} 
                      className={`notification-card notif-${notif.color} d-flex justify-content-between gap-3`}
                    >
                      <div className="d-flex gap-3">
                        {/* Custom status indicator border-left applied in css */}
                        <div className="bg-white border rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                          <Icon size={18} className={`text-${notif.color}`} />
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <h6 className="mb-0 text-dark fw-bold fs-7">{notif.title}</h6>
                            <span className="text-muted fs-8">• {notif.time}</span>
                          </div>
                          <p className="mb-0 fs-7 text-muted mt-1.5 lh-sm">{notif.message}</p>
                          
                          {/* Inline Action Buttons */}
                          {notif.actions && (
                            <div className="d-flex gap-2 mt-3">
                              <button 
                                className="btn btn-primary px-3 py-1.5 fs-8 fw-semibold rounded-2 text-white shadow-sm"
                                onClick={() => alert("Review requested submission...")}
                              >
                                Review Now
                              </button>
                              <button 
                                className="btn bg-white border border-light-subtle px-3 py-1.5 fs-8 fw-semibold rounded-2 text-muted shadow-sm hover-dark"
                                onClick={() => handleDismiss(notif.id)}
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Close cross */}
                      {!notif.actions && (
                        <button 
                          className="btn border-0 text-muted p-1 hover-dark mt-n1 flex-shrink-0 align-self-start"
                          onClick={() => handleDismiss(notif.id)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Preferences */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Preferences box */}
            <div className="glass-panel p-4 bg-primary text-white text-opacity-95" style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="p-2.5 rounded bg-white bg-opacity-10 text-white">
                  <Settings size={20} />
                </div>
                <span className="badge bg-white bg-opacity-20 text-white border border-white-25 fs-8">Preferences</span>
              </div>
              <h5 className="font-heading fw-bold mb-2">Set Alert Preferences</h5>
              <p className="fs-7 text-white text-opacity-80 mb-4 lh-sm">
                Customize how and when you receive critical updates and reminders from the student achievement review board.
              </p>
              <button 
                className="btn btn-light w-100 py-2.5 fw-semibold fs-7 text-primary rounded-3 shadow"
                onClick={() => alert("Loading alert configurations...")}
              >
                Configure
              </button>
            </div>

            {/* General Bell Indicator */}
            <div className="glass-panel p-4 text-center d-flex flex-column align-items-center justify-content-center flex-grow-1">
              <div className="logo-container bg-white shadow-sm border border-light-subtle d-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px' }}>
                <Bell size={26} className="text-primary animate-pulse" />
              </div>
              <h6 className="fw-bold text-dark font-heading mb-1">Staying Informed</h6>
              <p className="text-muted fs-8 mb-0 px-2 leading-sm">
                Important portal maintenance warnings, NAAC accreditation audits, and verified department milestones aggregate here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
