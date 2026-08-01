import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, Palette, Cpu } from 'lucide-react';

interface AccountSettingsProps {
  initialName: string;
  initialId: string;
  initialAvatar: string;
  onSaveProfile: (name: string, id: string, email: string, avatar: string, bio: string) => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
  initialName,
  initialId,
  initialAvatar,
  onSaveProfile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'theme' | 'config'>('profile');
  
  // Profile state
  const [fullName, setFullName] = useState(initialName);
  const [adminId, setAdminId] = useState(initialId);
  const [email, setEmail] = useState('admin@institution.edu');
  const [bio, setBio] = useState('Central Administration Oversight for Achievement and Merit Points. Managing institutional excellence across all departments.');
  const [avatar, setAvatar] = useState(initialAvatar);
  
  // Appearance / Theme states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeStyle, setThemeStyle] = useState<'default' | 'contrast'>('default');
  
  // Toast notifications
  const [successToast, setSuccessToast] = useState(false);

  // Hidden File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
  };

  const handleSave = () => {
    // Globally update the state in App.tsx
    onSaveProfile(fullName, adminId, email, avatar, bio);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
    }, 3000);
  };

  const handleDiscard = () => {
    setFullName(initialName);
    setAdminId(initialId);
    setEmail('admin@institution.edu');
    setBio('Central Administration Oversight for Achievement and Merit Points. Managing institutional excellence across all departments.');
    setAvatar(initialAvatar);
    alert('Changes discarded.');
  };

  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    document.documentElement.setAttribute('data-theme', nextVal ? 'dark' : 'light');
  };

  return (
    <div className="fade-in-up text-start">
      {/* Account Settings Header Banner */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1 text-primary">Account Settings</h4>
        <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Manage your institutional profile, security preferences, and system appearance</span>
      </div>

      {/* Tabs Header Selection (Image 3 layout) */}
      <div className="glass-panel p-1 mb-4 d-inline-flex align-items-center gap-1 bg-white bg-opacity-20" style={{ borderRadius: '14px' }}>
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`btn border-0 py-2 px-4 rounded-3 fw-semibold transition`}
          style={{ 
            fontSize: '0.85rem',
            backgroundColor: activeSubTab === 'profile' ? 'var(--primary-brand)' : 'transparent',
            color: activeSubTab === 'profile' ? '#ffffff' : 'var(--text-secondary)'
          }}
        >
          Profile Information
        </button>
        <button 
          onClick={() => setActiveSubTab('security')}
          className={`btn border-0 py-2 px-4 rounded-3 fw-semibold transition`}
          style={{ 
            fontSize: '0.85rem',
            backgroundColor: activeSubTab === 'security' ? 'var(--primary-brand)' : 'transparent',
            color: activeSubTab === 'security' ? '#ffffff' : 'var(--text-secondary)'
          }}
        >
          Security & Password
        </button>
        <button 
          onClick={() => setActiveSubTab('theme')}
          className={`btn border-0 py-2 px-4 rounded-3 fw-semibold transition`}
          style={{ 
            fontSize: '0.85rem',
            backgroundColor: activeSubTab === 'theme' ? 'var(--primary-brand)' : 'transparent',
            color: activeSubTab === 'theme' ? '#ffffff' : 'var(--text-secondary)'
          }}
        >
          System Theme
        </button>
        <button 
          onClick={() => setActiveSubTab('config')}
          className={`btn border-0 py-2 px-4 rounded-3 fw-semibold transition`}
          style={{ 
            fontSize: '0.85rem',
            backgroundColor: activeSubTab === 'config' ? 'var(--primary-brand)' : 'transparent',
            color: activeSubTab === 'config' ? '#ffffff' : 'var(--text-secondary)'
          }}
        >
          Global Config
        </button>
      </div>

      {successToast && (
        <div 
          className="alert alert-success border-0 glass-panel p-3 mb-4 text-start d-flex align-items-center gap-2"
          style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            color: 'var(--text-primary)',
            borderColor: 'rgba(16, 185, 129, 0.2)' 
          }}
        >
          <div style={{ color: '#10b981' }}>✔</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Settings saved successfully. Sidebar profile updated!</div>
        </div>
      )}

      {/* Profile Tab Panel */}
      {activeSubTab === 'profile' && (
        <div>
          {/* Card 1: Public Profile Form */}
          <div className="glass-panel p-4 p-md-5 mb-4">
            <h6 className="fw-bold mb-1 text-primary">Public Profile</h6>
            <p className="text-secondary mb-4" style={{ fontSize: '0.78rem' }}>These details will be visible to other administrative staff and departmental heads.</p>
            
            <div className="row g-4">
              {/* Profile Photo Upload Panel */}
              <div className="col-12 col-md-4 text-center text-md-start d-flex flex-column align-items-center justify-content-center border-end border-light-subtle pr-md-4">
                <div className="position-relative mb-3">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt="Avatar Preview" 
                      className="rounded-circle object-cover"
                      style={{ width: '100px', height: '100px', border: '3px solid var(--primary-brand)' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-secondary bg-opacity-25 text-primary d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                    >
                      {fullName ? fullName.slice(0, 2).toUpperCase() : 'AD'}
                    </div>
                  )}
                  {/* Photo Overlay trigger */}
                  <button 
                    onClick={handleUploadClick}
                    className="btn btn-primary rounded-circle p-2 position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center text-white border-0 shadow"
                    style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-brand)' }}
                    aria-label="Upload Photo"
                  >
                    <Camera size={14} />
                  </button>
                  {/* Hidden File select input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
                
                <div className="text-center text-md-start">
                  <button 
                    onClick={handleUploadClick}
                    className="btn btn-sm btn-glass-outline px-3 mb-1 text-primary"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Upload New
                  </button>
                  <button 
                    onClick={handleRemovePhoto}
                    className="btn btn-link text-danger text-decoration-none d-block w-100 text-center"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Remove
                  </button>
                  <span className="text-secondary d-block mt-2 text-center text-md-start" style={{ fontSize: '0.68rem' }}>
                    JPG, GIF or PNG. Max size of 800K
                  </span>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="col-12 col-md-8">
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label text-secondary fw-semibold mb-1.5" style={{ fontSize: '0.8rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      style={{ paddingLeft: '16px' }}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  
                  <div className="col-12 col-sm-6">
                    <label className="form-label text-secondary fw-semibold mb-1.5" style={{ fontSize: '0.8rem' }}>Admin ID</label>
                    <input 
                      type="text" 
                      className="glass-input" 
                      style={{ paddingLeft: '16px' }}
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold mb-1.5" style={{ fontSize: '0.8rem' }}>Institutional Email</label>
                    <input 
                      type="email" 
                      className="glass-input" 
                      style={{ paddingLeft: '16px' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold mb-1.5" style={{ fontSize: '0.8rem' }}>Bio / Signature</label>
                    <textarea 
                      className="glass-input" 
                      style={{ paddingLeft: '16px', minHeight: '80px', borderRadius: '12px' }}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Appearance Panel */}
          <div className="glass-panel p-4 p-md-5 mb-4">
            <h6 className="fw-bold mb-1 text-primary">Appearance</h6>
            <p className="text-secondary mb-4" style={{ fontSize: '0.78rem' }}>Customize the visual interface of the AchievementPortal for your session.</p>
            
            {/* Dark Mode Switcher Row */}
            <div className="d-flex align-items-center justify-content-between p-3.5 mb-4 rounded-3" style={{ background: 'rgba(0,0,0,0.02)' }}>
              <div>
                <span className="fw-semibold text-primary d-block" style={{ fontSize: '0.85rem' }}>Dark Mode</span>
                <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Reduce eye strain in low-light environments.</span>
              </div>
              <div className="form-check form-switch fs-5">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Accent selection row */}
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <div 
                  onClick={() => setThemeStyle('default')}
                  className="glass-panel p-3.5 d-flex align-items-center justify-content-between cursor-pointer border-2" 
                  style={{ 
                    cursor: 'pointer',
                    borderColor: themeStyle === 'default' ? 'var(--primary-brand)' : 'transparent',
                    background: themeStyle === 'default' ? 'rgba(37, 99, 235, 0.05)' : 'var(--glass-bg)'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-light text-primary d-flex align-items-center justify-content-center">
                      <Palette size={16} />
                    </div>
                    <div>
                      <span className="fw-bold text-primary d-block" style={{ fontSize: '0.82rem' }}>Default Theme</span>
                      <span className="text-secondary" style={{ fontSize: '0.72rem' }}>System default blue accent</span>
                    </div>
                  </div>
                  {themeStyle === 'default' && (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ width: '18px', height: '18px', backgroundColor: 'var(--primary-brand)', fontSize: '0.65rem' }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div 
                  onClick={() => setThemeStyle('contrast')}
                  className="glass-panel p-3.5 d-flex align-items-center justify-content-between cursor-pointer border-2" 
                  style={{ 
                    cursor: 'pointer',
                    borderColor: themeStyle === 'contrast' ? 'var(--primary-brand)' : 'transparent',
                    background: themeStyle === 'contrast' ? 'rgba(37, 99, 235, 0.05)' : 'var(--glass-bg)'
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-light text-dark d-flex align-items-center justify-content-center">
                      <Palette size={16} />
                    </div>
                    <div>
                      <span className="fw-bold text-primary d-block" style={{ fontSize: '0.82rem' }}>High Contrast</span>
                      <span className="text-secondary" style={{ fontSize: '0.72rem' }}>Accessibility optimized colors</span>
                    </div>
                  </div>
                  {themeStyle === 'contrast' && (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ width: '18px', height: '18px', backgroundColor: 'var(--primary-brand)', fontSize: '0.65rem' }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row buttons */}
          <div className="d-flex justify-content-end align-items-center gap-4 mt-4">
            <button 
              onClick={handleDiscard}
              className="btn btn-link text-decoration-none text-secondary p-0 fw-semibold"
              style={{ fontSize: '0.88rem' }}
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              className="btn-glass-primary px-4 py-2.5"
            >
              Save Changes
            </button>
          </div>

        </div>
      )}

      {/* Stubs for other sub tabs */}
      {activeSubTab === 'security' && (
        <div className="glass-panel p-4 p-md-5">
          <h6 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
            <ShieldCheck size={18} />
            <span>Security & Password Preferences</span>
          </h6>
          <div className="row g-3" style={{ maxWidth: '500px' }}>
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold mb-1">Current Password</label>
              <input type="password" className="glass-input" style={{ paddingLeft: '16px' }} placeholder="••••••••" />
            </div>
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold mb-1">New Password</label>
              <input type="password" className="glass-input" style={{ paddingLeft: '16px' }} placeholder="••••••••" />
            </div>
            <div className="col-12">
              <label className="form-label text-secondary fw-semibold mb-1">Confirm New Password</label>
              <input type="password" className="glass-input" style={{ paddingLeft: '16px' }} placeholder="••••••••" />
            </div>
            <div className="col-12 pt-3">
              <button className="btn-glass-primary" onClick={() => alert('Password updated successfully (simulation).')}>
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'theme' && (
        <div className="glass-panel p-4 p-md-5 text-center py-5">
          <Palette size={40} className="text-secondary mb-3" />
          <h6 className="fw-bold mb-1 text-primary">System Color Customizations</h6>
          <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Select accent colors and ambient mesh gradients for all sub-panels.</p>
        </div>
      )}

      {activeSubTab === 'config' && (
        <div className="glass-panel p-4 p-md-5 text-center py-5">
          <Cpu size={40} className="text-secondary mb-3" />
          <h6 className="fw-bold mb-1 text-primary">Global Portal Configurations</h6>
          <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Database synchronization rates, SSO keys, API integrations, and backup logs.</p>
        </div>
      )}

    </div>
  );
};
