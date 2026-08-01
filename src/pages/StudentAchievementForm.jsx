import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css'; // Reuse dashboard styles for consistency

const StudentAchievementForm = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    certificateUrl: '',
    documentUrl: ''
  });
  
  const [certificateFile, setCertificateFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data, error } = await supabase
          .from('achievement_categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (isMounted) {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        if (isMounted) setError('Failed to load achievement categories.');
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title.trim() || !formData.categoryId) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        throw new Error('You must be logged in to submit an achievement.');
      }

      let certUrl = formData.certificateUrl.trim() || null;
      let docUrl = formData.documentUrl.trim() || null;

      // Upload Certificate if file is selected
      if (certificateFile) {
        const fileExt = certificateFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-cert.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('certificates').upload(fileName, certificateFile);
        if (uploadError) {
          console.warn('Certificate upload failed. Make sure "certificates" bucket exists.', uploadError);
        } else {
          const { data } = supabase.storage.from('certificates').getPublicUrl(fileName);
          certUrl = data.publicUrl;
        }
      }

      // Upload Document if file is selected
      if (documentFile) {
        const fileExt = documentFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-doc.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('certificates').upload(fileName, documentFile);
        if (uploadError) {
          console.warn('Document upload failed. Make sure "certificates" bucket exists.', uploadError);
        } else {
          const { data } = supabase.storage.from('certificates').getPublicUrl(fileName);
          docUrl = data.publicUrl;
        }
      }

      const achievementPayload = {
        student_id: user.id,
        category_id: formData.categoryId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        certificate_url: certUrl,
        document_url: docUrl,
        status: 'Pending'
      };

      const { data: insertedAchievement, error: insertError } = await supabase
        .from('achievements')
        .insert(achievementPayload)
        .select()
        .single();

      if (insertError) throw insertError;

      // Fetch student's department to notify faculty
      const { data: student } = await supabase.from('students').select('department_id').eq('user_id', user.id).single();
      if (student?.department_id) {
        const { data: facultyMembers } = await supabase.from('faculty').select('user_id').eq('department_id', student.department_id);
        if (facultyMembers && facultyMembers.length > 0) {
          const notifications = facultyMembers.map(fm => ({
            user_id: fm.user_id,
            title: 'New Achievement Submitted',
            message: `A new achievement "${formData.title.trim()}" requires your review.`
          }));
          await supabase.from('notifications').insert(notifications);
        }
      }

      setSuccess(true);
      setFormData({
        title: '',
        categoryId: '',
        description: '',
        certificateUrl: '',
        documentUrl: ''
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 1500);

    } catch (err) {
      console.error('Error submitting achievement:', err);
      setError(err.message || 'Failed to submit achievement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page p-4">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-light rounded-circle shadow-sm me-3 d-flex justify-content-center align-items-center"
            style={{ width: '40px', height: '40px' }}
            onClick={() => navigate('/student-dashboard')}
          >
            <i className="bi bi-arrow-left text-primary"></i>
          </button>
          <h2 className="fw-bold text-primary mb-0">Submit New Achievement</h2>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div>Achievement submitted successfully! Redirecting to dashboard...</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="form-label fw-bold text-muted small">ACHIEVEMENT TITLE <span className="text-danger">*</span></label>
              <input 
                type="text" 
                className="form-control form-control-lg bg-light border-0" 
                id="title" 
                name="title"
                placeholder="e.g., First Place at Hackathon 2026"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="categoryId" className="form-label fw-bold text-muted small">CATEGORY <span className="text-danger">*</span></label>
              {loadingCategories ? (
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Loading categories...
                </div>
              ) : (
                <select 
                  className="form-select form-select-lg bg-light border-0" 
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.base_points} Base Points)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="form-label fw-bold text-muted small">DESCRIPTION</label>
              <textarea 
                className="form-control bg-light border-0" 
                id="description" 
                name="description"
                rows="4"
                placeholder="Provide details about your achievement, your role, and the impact..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* URLs & Files */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted small">CERTIFICATE UPLOAD OR URL</label>
                <div className="input-group mb-2">
                  <input 
                    type="file" 
                    className="form-control bg-light border-0" 
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    accept="image/*,.pdf"
                  />
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 text-muted"><i className="bi bi-link-45deg"></i></span>
                  <input 
                    type="url" 
                    className="form-control bg-light border-0" 
                    name="certificateUrl"
                    placeholder="Or paste https://..."
                    value={formData.certificateUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-text small">Upload file OR provide a link to your digital certificate.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-muted small">SUPPORTING DOCUMENT OR URL</label>
                <div className="input-group mb-2">
                  <input 
                    type="file" 
                    className="form-control bg-light border-0" 
                    onChange={(e) => setDocumentFile(e.target.files[0])}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0 text-muted"><i className="bi bi-link-45deg"></i></span>
                  <input 
                    type="url" 
                    className="form-control bg-light border-0" 
                    name="documentUrl"
                    placeholder="Or paste https://..."
                    value={formData.documentUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-text small">Upload supporting project files or provide a link.</div>
              </div>
            </div>

            <hr className="mb-4 opacity-25" />

            {/* Actions */}
            <div className="d-flex justify-content-end gap-3">
              <button 
                type="button" 
                className="btn btn-light px-4 fw-bold text-muted"
                onClick={() => navigate('/student-dashboard')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-5 fw-bold d-flex align-items-center gap-2 shadow-sm"
                disabled={submitting || loadingCategories}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill"></i> Submit for Review
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default StudentAchievementForm;
