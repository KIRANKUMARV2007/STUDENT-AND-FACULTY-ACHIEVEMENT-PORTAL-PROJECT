import React, { useState } from 'react';
import { 
  CheckCircle2, Star, AlertTriangle, UserPlus, FileText, 
  AlertOctagon, CheckSquare, Search, ChevronDown 
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'achievement' | 'points' | 'maintenance' | 'onboard' | 'report' | 'error';
  text: string;
  time: string;
  isUnread: boolean;
  isArchived: boolean;
  hasActions?: boolean;
}

interface NotificationsProps {
  onReviewClick: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onReviewClick }) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { 
      id: '1', 
      type: 'achievement', 
      text: 'Student Alex Johnson from Computer Science has submitted a new "National Code Hackathon" achievement for review.', 
      time: '2 mins ago', 
      isUnread: true, 
      isArchived: false,
      hasActions: true 
    },
    { 
      id: '2', 
      type: 'points', 
      text: 'System successfully processed the monthly "Academic Excellence" automated point rewards for 452 students.', 
      time: '1 hour ago', 
      isUnread: true, 
      isArchived: false 
    },
    { 
      id: '3', 
      type: 'maintenance', 
      text: 'AchievementPortal will undergo scheduled maintenance on Sunday, June 16, 02:00 AM - 04:00 AM UTC.', 
      time: '4 hours ago', 
      isUnread: false, 
      isArchived: false 
    },
    { 
      id: '4', 
      type: 'onboard', 
      text: 'Professor Elena Rodriguez has successfully completed the achievement validation training module.', 
      time: 'Yesterday', 
      isUnread: false, 
      isArchived: false 
    },
    { 
      id: '5', 
      type: 'report', 
      text: 'The comprehensive achievement report for the month of May 2024 is now available for download in the Reports section.', 
      time: '2 days ago', 
      isUnread: false, 
      isArchived: false 
    },
    { 
      id: '6', 
      type: 'error', 
      text: 'Synchronization with the "Global Merit Registry" failed due to a timeout. System will retry automatically in 24 hours.', 
      time: '3 days ago', 
      isUnread: false, 
      isArchived: false 
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isArchived: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeSubTab === 'unread') return n.isUnread && !n.isArchived;
    if (activeSubTab === 'archived') return n.isArchived;
    return !n.isArchived; // 'all' view shows active unarchived
  });

  const getIconBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return (
          <div className="p-2.5 rounded bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center">
            <CheckCircle2 size={20} />
          </div>
        );
      case 'points':
        return (
          <div className="p-2.5 rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center">
            <Star size={20} />
          </div>
        );
      case 'maintenance':
        return (
          <div className="p-2.5 rounded bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center">
            <AlertTriangle size={20} />
          </div>
        );
      case 'onboard':
        return (
          <div className="p-2.5 rounded bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
            <UserPlus size={20} className="text-success" />
          </div>
        );
      case 'report':
        return (
          <div className="p-2.5 rounded bg-light d-flex align-items-center justify-content-center">
            <FileText size={20} className="text-secondary" />
          </div>
        );
      case 'error':
        return (
          <div className="p-2.5 rounded bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center">
            <AlertOctagon size={20} />
          </div>
        );
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <div className="fade-in-up text-start">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <h4 className="fw-bold mb-1 text-primary">Notifications</h4>
          <button className="btn btn-sm border-0 bg-transparent text-secondary p-0">
            <Search size={16} />
          </button>
        </div>

        <button 
          onClick={handleMarkAllRead}
          className="btn btn-primary py-2 px-3 border-0 d-inline-flex align-items-center gap-2 fw-semibold text-white" 
          style={{ borderRadius: '10px', fontSize: '0.82rem', backgroundColor: 'var(--primary-brand)' }}
        >
          <CheckSquare size={15} />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Tabs list filter */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div className="glass-panel p-1 d-inline-flex align-items-center gap-1 bg-white bg-opacity-20" style={{ borderRadius: '12px' }}>
          <button 
            onClick={() => setActiveSubTab('all')}
            className={`btn border-0 py-1.5 px-3 rounded-2 fw-semibold transition`}
            style={{ 
              fontSize: '0.8rem',
              backgroundColor: activeSubTab === 'all' ? 'var(--primary-brand)' : 'transparent',
              color: activeSubTab === 'all' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            All
          </button>
          <button 
            onClick={() => setActiveSubTab('unread')}
            className={`btn border-0 py-1.5 px-3 rounded-2 fw-semibold transition`}
            style={{ 
              fontSize: '0.8rem',
              backgroundColor: activeSubTab === 'unread' ? 'var(--primary-brand)' : 'transparent',
              color: activeSubTab === 'unread' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Unread
          </button>
          <button 
            onClick={() => setActiveSubTab('archived')}
            className={`btn border-0 py-1.5 px-3 rounded-2 fw-semibold transition`}
            style={{ 
              fontSize: '0.8rem',
              backgroundColor: activeSubTab === 'archived' ? 'var(--primary-brand)' : 'transparent',
              color: activeSubTab === 'archived' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Archived
          </button>
        </div>
        
        <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>
          Showing {filteredNotifications.length} notifications
        </span>
      </div>

      {/* Notifications List Container */}
      <div className="d-flex flex-column gap-3 mb-4">
        {filteredNotifications.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            No notifications to display.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              className="glass-panel p-3.5 d-flex align-items-start justify-content-between gap-3 transition-all border-2"
              style={{
                borderColor: notif.isUnread ? 'rgba(37,99,235,0.18)' : 'transparent',
                background: notif.isUnread ? 'rgba(255,255,255,0.7)' : 'var(--glass-bg)'
              }}
            >
              <div className="d-flex gap-3 align-items-start flex-grow-1">
                {getIconBadge(notif.type)}
                <div className="text-start">
                  <p className="fw-semibold text-primary mb-1.5" style={{ fontSize: '0.88rem', lineHeight: '1.45' }}>
                    {notif.text}
                  </p>
                  
                  {/* Action buttons (Approve / Dismiss) */}
                  {notif.hasActions && notif.isUnread && (
                    <div className="d-flex gap-2 mb-1.5">
                      <button 
                        onClick={onReviewClick}
                        className="btn btn-primary btn-sm py-1.5 px-3 border-0 fw-semibold text-white"
                        style={{ backgroundColor: 'var(--primary-brand)', fontSize: '0.78rem', borderRadius: '8px' }}
                      >
                        Review Now
                      </button>
                      <button 
                        onClick={() => handleDismiss(notif.id)}
                        className="btn btn-sm btn-glass-outline py-1.5 px-3"
                        style={{ fontSize: '0.78rem', borderRadius: '8px' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp info */}
              <div className="text-end text-nowrap">
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{notif.time}</span>
                {notif.isUnread && (
                  <span className="d-block text-primary fw-bold text-end mt-1" style={{ fontSize: '0.75rem' }}>●</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Dropdown control */}
      <div className="text-center py-2 mb-4">
        <button 
          onClick={() => alert('Loading older notification archives...')}
          className="btn btn-link text-decoration-none text-secondary d-inline-flex align-items-center gap-1 fw-semibold"
          style={{ fontSize: '0.82rem' }}
        >
          <span>Load older notifications</span>
          <ChevronDown size={14} />
        </button>
      </div>

    </div>
  );
};
