import React, { useState } from 'react';
import { Award, Lock, Eye, EyeOff, Key, HelpCircle, ArrowRight, User } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (admin: { admin_id: string; name?: string; email?: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = adminId.trim();
    if (!trimmedId) {
      setError('Admin ID or Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    // Client-side validations
    if (trimmedId.includes('@')) {
      const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
      if (!emailPattern.test(trimmedId)) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: trimmedId,
          password: password,
        }),
      });

      let data: any = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle HTML or text error pages (e.g., 500, 404, or dev server debug pages)
        throw new Error(`Server error (${response.status}). Please verify that the database is running and configured properly.`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed. Please check your credentials.');
      }

      // Store JWT token securely
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (rememberMe) {
          localStorage.setItem('remember_device', 'true');
        }
      }

      onLoginSuccess(data.admin || { admin_id: trimmedId });
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ admin_id: 'SSO_ADMIN_01', name: 'SSO Administrator' });
    }, 1200);
  };

  return (
    <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center py-5 fade-in-up">
      {/* Upper Logo / Title Area */}
      <div className="text-center mb-4">
        <div 
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.04)'
          }}
        >
          <Award size={32} className="text-primary" />
        </div>
        <h1 className="fw-bold mb-1 text-primary d-block" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>
          AchievementPortal
        </h1>
        <p className="text-secondary fw-normal mb-0" style={{ fontSize: '1rem' }}>
          Institutional Administration Access
        </p>
      </div>

      {/* Glassmorphic Login Card */}
      <div className="w-100" style={{ maxWidth: '440px' }}>
        <div className="glass-panel p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            {error && (
              <div 
                className="alert alert-danger border-0 glass-panel p-3 mb-4 text-start d-flex align-items-center gap-2"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(239, 68, 68, 0.2)' 
                }}
              >
                <div style={{ color: '#ef4444' }}>●</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{error}</div>
              </div>
            )}

            {/* Admin ID / Email input */}
            <div className="mb-4">
              <label 
                className="form-label d-block text-start mb-2 fw-semibold text-secondary" 
                style={{ fontSize: '0.85rem' }}
              >
                Admin ID or Email
              </label>
              <div className="glass-input-group">
                <span className="input-icon">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter Admin ID or email"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label 
                  className="form-label mb-0 fw-semibold text-secondary" 
                  style={{ fontSize: '0.85rem' }}
                >
                  Password
                </label>
                <a 
                  href="#forgot" 
                  className="text-decoration-none fw-semibold" 
                  style={{ fontSize: '0.8rem', color: 'var(--primary-brand)' }}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been simulated to your institutional email.');
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="glass-input-group">
                <span className="input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="form-check text-start mb-4 d-flex align-items-center gap-2">
              <input
                type="checkbox"
                className="form-check-input mt-0"
                id="rememberDevice"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                style={{ 
                  cursor: 'pointer',
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)' 
                }}
              />
              <label 
                className="form-check-label text-secondary" 
                htmlFor="rememberDevice" 
                style={{ fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}
              >
                Remember this device for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-glass-primary w-100 mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Login to Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="glass-divider">OR CONTINUE WITH</div>

            {/* External buttons */}
            <div className="row g-3">
              <div className="col-6">
                <button
                  type="button"
                  className="btn-glass-outline w-100"
                  onClick={handleSSOLogin}
                  disabled={isLoading}
                >
                  <Key size={16} />
                  <span>SSO Login</span>
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn-glass-outline w-100"
                  onClick={() => alert('Support line open. Please email support@institution.edu')}
                  disabled={isLoading}
                >
                  <HelpCircle size={16} />
                  <span>Help Support</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Policy agreement */}
        <p className="text-center text-secondary mt-4 mb-0" style={{ fontSize: '0.8rem' }}>
          By logging in, you agree to the{' '}
          <a 
            href="#policy" 
            className="text-decoration-none fw-semibold"
            style={{ color: 'var(--primary-brand)' }}
            onClick={(e) => { e.preventDefault(); alert('Acceptable Use Policy document stub.'); }}
          >
            Acceptable Use Policy
          </a>.
        </p>
      </div>

      {/* Footer Links & Copyright */}
      <div className="mt-5 text-center">
        <div className="d-flex justify-content-center gap-3 mb-2" style={{ fontSize: '0.85rem' }}>
          <a href="#privacy" className="text-secondary text-decoration-none hover-underline" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <span className="text-muted">•</span>
          <a href="#terms" className="text-secondary text-decoration-none hover-underline" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <span className="text-muted">•</span>
          <a href="#support" className="text-secondary text-decoration-none hover-underline" onClick={(e) => e.preventDefault()}>Support</a>
        </div>
        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
          © 2024 Institutional Achievement Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};
