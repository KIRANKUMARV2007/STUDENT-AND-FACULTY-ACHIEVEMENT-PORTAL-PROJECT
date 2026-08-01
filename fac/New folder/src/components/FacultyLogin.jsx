import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Award, Terminal, Key, HelpCircle } from 'lucide-react';

export default function FacultyLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutofill = () => {
    setEmail('faculty@university.edu');
    setPassword('securityPass123');
    setErrors({});
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate network authentication request
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        email,
        name: 'Dr. Sarah Jenkins',
        department: 'Computer Science & Engineering',
        role: 'Associate Professor',
        avatar: 'SJ'
      });
    }, 1200);
  };

  return (
    <div className="login-page-container">
      <div className="fade-in-slide w-100" style={{ maxWidth: '420px' }}>
        
        {/* Crest/Logo Header */}
        <div className="d-flex flex-column align-items-center mb-4">
          <div className="login-logo-box mb-3 d-flex align-items-center justify-content-center">
            <Award className="text-primary" size={26} style={{ strokeWidth: 2.2 }} />
          </div>
          <h1 className="login-title-text mb-1">AchievementPortal</h1>
          <p className="login-subtitle-text text-muted mb-0">Academic Faculty Access</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <form onSubmit={handleLogin} noValidate>
            
            {/* Email Input */}
            <div className="mb-3">
              <label className="login-form-label" htmlFor="email-input">
                Faculty Email / ID
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="email-input"
                  type="email"
                  className={`login-input-field ${errors.email ? 'has-error' : ''}`}
                  placeholder="Enter your academic email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  autoComplete="email"
                />
                {errors.email && (
                  <div className="text-danger fs-7 mt-1 ps-1">{errors.email}</div>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <div className="login-form-label-row">
                <label className="login-form-label" htmlFor="password-input">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-decoration-none fs-7 fw-semibold text-primary mb-1"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions will be sent to ' + (email || 'your registered email.'));
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className={`login-input-field ${errors.password ? 'has-error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <div className="text-danger fs-7 mt-1 ps-1">{errors.password}</div>
                )}
              </div>
            </div>

            {/* Options Row */}
            <div className="d-flex align-items-center mb-4">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember this device for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <span>Login to Portal</span>
                  <LogIn size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider-container">
            <span className="login-divider-text">Or continue with</span>
          </div>

          {/* Alternate Login Buttons */}
          <div className="login-alt-buttons-row">
            <button className="login-alt-btn" type="button" onClick={() => alert('SSO Login service is currently unavailable.')}>
              <Key size={14} className="text-muted" />
              <span>SSO Login</span>
            </button>
            <button className="login-alt-btn" type="button" onClick={() => alert('Support page is currently loading...')}>
              <HelpCircle size={14} className="text-muted" />
              <span>Help Support</span>
            </button>
          </div>
        </div>

        {/* Acceptable Use Policy Link below card */}
        <p className="login-policy-text">
          By logging in, you agree to the <a href="#policy" className="login-policy-link" onClick={(e) => e.preventDefault()}>Acceptable Use Policy</a>.
        </p>

        {/* Footer Policy Links at bottom */}
        <div className="login-footer-links">
          <a href="#privacy" className="login-footer-link" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          <a href="#terms" className="login-footer-link" onClick={(e) => e.preventDefault()}>
            Terms of Service
          </a>
          <a href="#support" className="login-footer-link" onClick={(e) => e.preventDefault()}>
            Support
          </a>
        </div>
        <p className="login-copyright-text">
          &copy; 2026 Institutional Achievement Portal. All rights reserved.
        </p>
      </div>

      {/* Floating Demo Trigger */}
      <div className="demo-pill" onClick={handleAutofill} title="Autofill standard faculty credentials">
        <Terminal size={14} className="text-primary" />
        <span>Autofill Demo</span>
      </div>
    </div>
  );
}
