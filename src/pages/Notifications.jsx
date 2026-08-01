import React, { useState, useEffect } from 'react';
import './Notifications.css';
import { supabase } from '../supabaseClient';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase.from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (isMounted && data) {
          setNotifications(data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchNotifs();
    return () => { isMounted = false; };
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'Unread') return !n.is_read;
    return true;
  });

  return (
    <div className="notifications-page" style={{ maxWidth: '900px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-primary mb-0">Notifications</h2>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex gap-2">
          <button 
            className={`btn rounded-pill px-4 fw-bold shadow-sm ${activeFilter === 'All' ? 'btn-primary' : 'btn-light text-muted border'}`}
            onClick={() => setActiveFilter('All')}
          >All</button>
          <button 
            className={`btn rounded-pill px-4 fw-semibold shadow-sm ${activeFilter === 'Unread' ? 'btn-primary' : 'btn-light text-muted border'}`}
            onClick={() => setActiveFilter('Unread')}
          >Unread</button>
        </div>
        <button onClick={handleMarkAllAsRead} className="btn btn-link text-primary fw-bold text-decoration-none p-0 d-flex align-items-center gap-1">
          <i className="bi bi-check2-all fs-5"></i> Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted py-5"><div className="spinner-border spinner-border-sm text-primary"></div></div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>No notifications found.</p>
        </div>
      ) : (
        <div className="mb-5">
          {filteredNotifications.map(notif => {
            const isSuccess = notif.title.toLowerCase().includes('approve') || notif.title.toLowerCase().includes('success');
            const isDanger = notif.title.toLowerCase().includes('reject') || notif.title.toLowerCase().includes('fail');
            let color = 'primary';
            let icon = 'bi-bell-fill';
            if (isSuccess) { color = 'success'; icon = 'bi-check-circle-fill'; }
            else if (isDanger) { color = 'danger'; icon = 'bi-flag-fill'; }
            else { color = 'info'; icon = 'bi-info-circle-fill'; }

            return (
              <div key={notif.id} className={`card border-0 shadow-sm p-4 rounded-4 mb-3 border-start border-4 notification-card ${notif.is_read ? 'bg-light opacity-75' : ''}`} style={{ borderLeftColor: `var(--bs-${color}) !important` }}>
                <div className="d-flex gap-4">
                  <div className={`bg-${color}-subtle text-${color} rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 mt-1`} style={{ width: '48px', height: '48px' }}>
                    <i className={`bi ${icon} fs-4`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0">{notif.title}</h5>
                      <span className="text-muted small fw-semibold">{new Date(notif.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
