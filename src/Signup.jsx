import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Student-specific fields
  const [registerNumber, setRegisterNumber] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [year, setYear] = useState('');
  
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from('departments').select('id, name');
      if (error) console.error('Error fetching departments:', error);
      else setDepartments(data || []);
    };
    fetchDepartments();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (role === 'student' && (!registerNumber || !departmentId || !year)) {
      setError('Please fill in all student details.');
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Handle the case where email confirmation is required and user is not instantly logged in
      if (!authData.session) {
        throw new Error('Registration requires email verification. Please check your inbox.');
      }

      const userId = authData.user.id;

      // 2. Insert into public.users
      const { error: userError } = await supabase
        .from('users')
        .insert([{ id: userId, email, role }]);
        
      if (userError) throw userError;

      // 3. Insert into Role-specific table
      let roleError;
      if (role === 'student') {
        const { error: err } = await supabase.from('students').insert([{
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          register_number: registerNumber,
          department_id: departmentId,
          year: parseInt(year)
        }]);
        roleError = err;
      } else if (role === 'faculty') {
        const { error: err } = await supabase.from('faculty').insert([{
          user_id: userId,
          first_name: firstName,
          last_name: lastName
        }]);
        roleError = err;
      } else if (role === 'admin') {
        const { error: err } = await supabase.from('admins').insert([{
          user_id: userId,
          first_name: firstName,
          last_name: lastName
        }]);
        roleError = err;
      }

      if (roleError) {
        console.error('Role table insert error:', roleError);
        throw new Error('Failed to create role profile. ' + roleError.message);
      }

      // 4. Save role to localStorage and redirect
      localStorage.setItem('userRole', role);
      localStorage.setItem('access_token', authData.session.access_token);
      
      const dashboardRoute = role === 'student' ? '/student-dashboard' : role === 'faculty' ? '/faculty-dashboard' : '/admin-dashboard';
      navigate(dashboardRoute);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper py-5">
      <div className="login-bg-blob"></div>
      
      <div className="login-content-wrapper my-4">
        <div className="text-center mb-4">
          <div className="login-logo-box mx-auto mb-3 d-flex align-items-center justify-content-center bg-white shadow-sm rounded-3">
            <i className="bi bi-person-plus-fill text-primary fs-3"></i>
          </div>
          <h2 className="login-brand-title fw-bold text-primary mb-1">Create Account</h2>
          <p className="login-subtitle text-muted small">Register for the AchievementPortal</p>
        </div>

        <div className="card login-form-card bg-white border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto">
          <form onSubmit={handleSignup}>
            {error && (
              <div className="alert alert-danger text-center small p-2 mb-4" role="alert">
                {error}
              </div>
            )}

            {/* Role Dropdown */}
            <div className="mb-3">
              <label className="form-label small text-muted fw-semibold">Register As</label>
              <select 
                className="form-select bg-light border-0 shadow-none py-2 px-3 text-secondary fw-semibold"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ borderRadius: '0.5rem', cursor: 'pointer' }}
                disabled={loading}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small text-muted fw-semibold">First Name</label>
                <div className="input-group login-input-group">
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 px-3 shadow-none" 
                    placeholder="First" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6">
                <label className="form-label small text-muted fw-semibold">Last Name</label>
                <div className="input-group login-input-group">
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 px-3 shadow-none" 
                    placeholder="Last" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {role === 'student' && (
              <>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-muted fw-semibold">Register No.</label>
                    <div className="input-group login-input-group">
                      <input 
                        type="text" 
                        className="form-control bg-light border-0 px-3 shadow-none" 
                        placeholder="e.g. 21001" 
                        required 
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small text-muted fw-semibold">Year</label>
                    <select 
                      className="form-select bg-light border-0 shadow-none px-3"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label small text-muted fw-semibold">Department</label>
                  <select 
                    className="form-select bg-light border-0 shadow-none py-2 px-3 text-secondary"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label small text-muted fw-semibold">Email Address</label>
              <div className="input-group login-input-group">
                <span className="input-group-text bg-light border-0 px-3 rounded-start-3">
                  <i className="bi bi-envelope text-muted"></i>
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
              <label className="form-label small text-muted fw-semibold">Password</label>
              <div className="input-group login-input-group">
                <span className="input-group-text bg-light border-0 px-3 rounded-start-3">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className="form-control bg-light border-0 px-2 shadow-none" 
                  placeholder="Create a password" 
                  required 
                  minLength="6"
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

            <button type="submit" disabled={loading} className="btn btn-primary w-100 login-btn py-3 mb-4 d-flex justify-content-center align-items-center gap-2 rounded-3 fw-bold border-0 shadow-sm">
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              {!loading && <i className="bi bi-person-plus"></i>}
            </button>
            
            <div className="text-center mt-3">
              <p className="text-muted small mb-0">
                Already have an account? <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#2156a6' }}>Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
