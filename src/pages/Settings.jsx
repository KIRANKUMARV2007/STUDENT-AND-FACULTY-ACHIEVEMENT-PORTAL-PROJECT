import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [student, setStudent] = useState({
    first_name: '',
    last_name: '',
    bio: '' // Note: bio may not exist in DB yet, but we handle it in state
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data } = await supabase
          .from('students')
          .select('first_name, last_name, departments(name), year')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          setStudent({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            bio: data.bio || '',
            deptName: data.departments?.name || 'Department',
            year: data.year || '1'
          });
        }
      } catch (err) {
        console.error('Error fetching settings profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updates = {
        first_name: student.first_name,
        last_name: student.last_name,
        // bio: student.bio // If you have a bio column in students table, uncomment this
      };

      const { error } = await supabase.from('students').update(updates).eq('user_id', user.id);
      if (error) throw error;
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${student.first_name} ${student.last_name}`.trim() || 'Student';

  const renderContent = () => {
    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    switch(activeTab) {
      case 'profile':
        return (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white settings-form-card" style={{ minHeight: '500px' }}>
            <div className="d-flex gap-4 align-items-center mb-5">
              <div className="position-relative">
                <img src={`https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=0D8ABC&color=fff&size=150`} alt={fullName} className="rounded-4 object-fit-cover shadow-sm border border-3 border-white" style={{ width: '100px', height: '100px' }} />
                <button className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 p-1 shadow-sm d-flex justify-content-center align-items-center border border-2 border-white" style={{ width: '32px', height: '32px', transform: 'translate(25%, 25%)' }}>
                  <i className="bi bi-camera-fill small"></i>
                </button>
              </div>
              <div className="flex-grow-1">
                <h4 className="fw-bold mb-1">{fullName}</h4>
                <p className="text-secondary small mb-2">{student.deptName} • Year {student.year}</p>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-1">Active</span>
                </div>
              </div>
            </div>

            {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} py-2`}>{message}</div>}

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold small mb-2">First Name</label>
                <input type="text" className="form-control form-control-lg bg-white" value={student.first_name} onChange={e => setStudent({...student, first_name: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted fw-semibold small mb-2">Last Name</label>
                <input type="text" className="form-control form-control-lg bg-white" value={student.last_name} onChange={e => setStudent({...student, last_name: e.target.value})} />
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label text-muted fw-semibold small mb-2">Academic Bio</label>
              <textarea className="form-control bg-white" rows="4" value={student.bio} onChange={e => setStudent({...student, bio: e.target.value})} placeholder="Tell us about your academic journey..."></textarea>
            </div>

            <div className="d-flex justify-content-end mt-auto">
              <button onClick={handleSaveProfile} disabled={saving} className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm">
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white settings-form-card" style={{ minHeight: '500px' }}>
            <h4 className="fw-bold mb-4">Security Settings</h4>
            <div className="mb-4">
              <label className="form-label text-muted fw-semibold small mb-2">Current Password</label>
              <input type="password" className="form-control form-control-lg bg-light border-0" />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted fw-semibold small mb-2">New Password</label>
              <input type="password" className="form-control form-control-lg bg-light border-0" />
            </div>
            <div className="mb-5">
              <label className="form-label text-muted fw-semibold small mb-2">Confirm New Password</label>
              <input type="password" className="form-control form-control-lg bg-light border-0" />
            </div>
            <div className="d-flex justify-content-end mt-auto">
              <button className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm">Update Password</button>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white settings-form-card" style={{ minHeight: '500px' }}>
            <h4 className="fw-bold mb-4">Notification Preferences</h4>
            <div className="form-check form-switch mb-4">
              <input className="form-check-input" type="checkbox" role="switch" id="emailNotif" defaultChecked />
              <label className="form-check-label fw-semibold" htmlFor="emailNotif">Email Notifications</label>
              <div className="text-muted small">Receive daily summaries and important alerts via email.</div>
            </div>
            <div className="form-check form-switch mb-4">
              <input className="form-check-input" type="checkbox" role="switch" id="pushNotif" defaultChecked />
              <label className="form-check-label fw-semibold" htmlFor="pushNotif">Push Notifications</label>
              <div className="text-muted small">Receive real-time alerts on your devices.</div>
            </div>
            <div className="form-check form-switch mb-5">
              <input className="form-check-input" type="checkbox" role="switch" id="smsNotif" />
              <label className="form-check-label fw-semibold" htmlFor="smsNotif">SMS Alerts</label>
              <div className="text-muted small">Receive text messages for critical account changes.</div>
            </div>
            <div className="d-flex justify-content-end mt-auto">
              <button className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm">Save Preferences</button>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white settings-form-card" style={{ minHeight: '500px' }}>
            <h4 className="fw-bold mb-4">Privacy Settings</h4>
            <div className="form-check form-switch mb-4">
              <input className="form-check-input" type="checkbox" role="switch" id="publicProfile" defaultChecked />
              <label className="form-check-label fw-semibold" htmlFor="publicProfile">Public Profile</label>
              <div className="text-muted small">Allow other students and faculty to view your profile and achievements.</div>
            </div>
            <div className="form-check form-switch mb-4">
              <input className="form-check-input" type="checkbox" role="switch" id="showPoints" defaultChecked />
              <label className="form-check-label fw-semibold" htmlFor="showPoints">Display Total Points</label>
              <div className="text-muted small">Show your accumulated reward points on the leaderboard.</div>
            </div>
            <div className="form-check form-switch mb-5">
              <input className="form-check-input" type="checkbox" role="switch" id="shareData" />
              <label className="form-check-label fw-semibold" htmlFor="shareData">Share Data with Partners</label>
              <div className="text-muted small">Allow university partners to see your academic interests.</div>
            </div>
            <div className="d-flex justify-content-end mt-auto">
              <button className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm">Update Privacy</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="settings-page">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h5 className="fw-bold text-primary mb-0">Student Settings</h5>
      </div>

      <div className="row g-4">
        
        {/* Inner Sidebar */}
        <div className="col-md-3">
          <div className="d-flex flex-column gap-2 settings-sidebar">
            <button 
              className={`btn text-start p-3 rounded-3 d-flex align-items-center gap-3 border-0 ${activeTab === 'profile' ? 'btn-light text-primary fw-bold' : 'btn-white text-muted fw-semibold'}`}
              style={activeTab === 'profile' ? { backgroundColor: '#eef2fb' } : {}}
              onClick={() => setActiveTab('profile')}
            >
              <i className="bi bi-person fs-5"></i> Edit Profile
            </button>
            <button 
              className={`btn text-start p-3 rounded-3 d-flex align-items-center gap-3 border-0 ${activeTab === 'security' ? 'btn-light text-primary fw-bold' : 'btn-white text-muted fw-semibold'}`}
              style={activeTab === 'security' ? { backgroundColor: '#eef2fb' } : {}}
              onClick={() => setActiveTab('security')}
            >
              <i className="bi bi-lock fs-5"></i> Security
            </button>
            <button 
              className={`btn text-start p-3 rounded-3 d-flex align-items-center gap-3 border-0 ${activeTab === 'notifications' ? 'btn-light text-primary fw-bold' : 'btn-white text-muted fw-semibold'}`}
              style={activeTab === 'notifications' ? { backgroundColor: '#eef2fb' } : {}}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="bi bi-bell fs-5"></i> Notifications
            </button>
            <button 
              className={`btn text-start p-3 rounded-3 d-flex align-items-center gap-3 border-0 ${activeTab === 'privacy' ? 'btn-light text-primary fw-bold' : 'btn-white text-muted fw-semibold'}`}
              style={activeTab === 'privacy' ? { backgroundColor: '#eef2fb' } : {}}
              onClick={() => setActiveTab('privacy')}
            >
              <i className="bi bi-eye fs-5"></i> Privacy
            </button>
          </div>
        </div>

        {/* Main Content Form */}
        <div className="col-md-9">
          {renderContent()}
        </div>

      </div>

    </div>
  );
};

export default Settings;
