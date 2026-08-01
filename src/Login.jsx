import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData.user.id;
      
      // 2. Verify existence in the role-specific table
      let tableToQuery = '';
      let dashboardRoute = '';
      
      if (role === 'student') {
        tableToQuery = 'students';
        dashboardRoute = '/student-dashboard';
      } else if (role === 'faculty') {
        tableToQuery = 'faculty';
        dashboardRoute = '/faculty-dashboard';
      } else if (role === 'admin') {
        tableToQuery = 'admins';
        dashboardRoute = '/admin-dashboard';
      }

      // We check if the user exists in their respective table
      const { data: roleData, error: roleError } = await supabase
        .from(tableToQuery)
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle(); // maybeSingle returns null if 0 rows, instead of throwing PGRST116

      if (roleError) {
        throw roleError;
      }

      if (!roleData) {
        // User does not exist in the requested role table.
        // Sign them out immediately.
        await supabase.auth.signOut();
        throw new Error(`Access Denied: Your account does not have ${role} privileges.`);
      }

      // 3. Save role to localStorage to enforce Route Protection
      localStorage.setItem('userRole', role);
      localStorage.setItem('access_token', authData.session.access_token);

      // 4. Redirect to the respective dashboard
      navigate(dashboardRoute);

    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message || 'An error occurred during login. Please check your credentials.');
      // Cleanup on failure
      localStorage.removeItem('userRole');
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-bg-blob"></div>
      
      <div className="login-content-wrapper">
        <div className="text-center mb-4">
          <div className="login-logo-box mx-auto mb-3 d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3">
            <i className="bi bi-award-fill text-primary fs-3"></i>
          </div>
          <h2 className="login-brand-title fw-bold text-primary mb-1">AchievementPortal</h2>
          <p className="login-subtitle text-muted small">Centralized Authentication Portal</p>
        </div>

        <div className="card login-form-card bg-white border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert alert-danger text-center small p-2 mb-4" role="alert">
                {error}
              </div>
            )}

            {/* Role Dropdown */}
            <div className="mb-3">
              <label className="form-label small text-muted fw-semibold">Select Role</label>
              <select 
                className="form-select bg-light border-0 shadow-none py-2 px-3 text-secondary fw-semibold"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="form-label small text-muted fw-semibold">Email Address</label>
              <div className="input-group login-input-group">
                <span className="input-group-text bg-light border-0 px-3 rounded-start-3">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control bg-light border-0 ps-2 rounded-end-3 shadow-none" 
                  placeholder="Enter your email ID" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small text-muted fw-semibold mb-0">Password</label>
                <a href="#" className="forgot-password-link text-decoration-none small fw-semibold">Forgot Password?</a>
              </div>
              <div className="input-group login-input-group">
                <span className="input-group-text bg-light border-0 px-3 rounded-start-3">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="form-control bg-light border-0 px-2 shadow-none" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span 
                  className="input-group-text bg-light border-0 px-3 rounded-end-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </span>
              </div>
            </div>

            <div className="mb-4 small">
              <div className="form-check d-flex align-items-center">
                <input className="form-check-input shadow-none mt-0 me-2" type="checkbox" id="rememberMe" />
                <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                  Remember this device for 30 days
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-100 login-btn py-3 mb-4 d-flex justify-content-center align-items-center gap-2 rounded-3 fw-bold border-0 shadow-sm">
              <span>{loading ? 'Authenticating...' : 'Login to Portal'}</span>
              {!loading && <i className="bi bi-box-arrow-in-right"></i>}
            </button>
            
            <div className="login-divider text-muted small text-center mb-4 position-relative">
              <span className="bg-white px-3 position-relative" style={{ zIndex: 1, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px' }}>OR CONTINUE WITH</span>
              <hr className="position-absolute w-100 top-50 start-0 m-0 opacity-10" style={{ zIndex: 0 }} />
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 mb-2">
              <button type="button" className="btn btn-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 border shadow-sm bg-white text-dark">
                <i className="bi bi-key text-muted"></i> <span className="small fw-semibold">SSO Login</span>
              </button>
              <button type="button" className="btn btn-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 border shadow-sm bg-white text-dark">
                <i className="bi bi-question-circle text-muted"></i> <span className="small fw-semibold">Help Support</span>
              </button>
            </div>
            
            <div className="text-center mt-3">
              <p className="text-muted small mb-0">
                Don't have an account? <Link to="/signup" className="text-decoration-none fw-semibold" style={{ color: '#2156a6' }}>Sign Up here</Link>
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                By logging in, you agree to the <a href="#" className="text-decoration-none fw-semibold">Acceptable Use Policy</a>.
              </p>
            </div>
          </form>
        </div>

        <div className="login-footer text-center mt-5">
          <div className="d-flex justify-content-center gap-4 mb-3">
            <a href="#" className="text-muted text-decoration-none small fw-semibold">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none small fw-semibold">Terms of Service</a>
            <a href="#" className="text-muted text-decoration-none small fw-semibold">Support</a>
          </div>
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>© 2026 Institutional Achievement Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
