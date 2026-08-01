import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const AddAchievement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    date: '',
    organizer: '',
    description: ''
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const certInputRef = useRef(null);
  const proofInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('achievement_categories').select('*');
      if (data) {
        setCategories(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, category_id: data[0].id }));
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'certificate') setCertificateFile(file);
      if (type === 'proof') setProofFile(file);
    }
  };

  const uploadFile = async (file, bucket) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError, data } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let certUrl = null;
      let proofUrl = null;

      if (certificateFile) certUrl = await uploadFile(certificateFile, 'certificates');
      if (proofFile) proofUrl = await uploadFile(proofFile, 'proofs');

      const { error: insertError } = await supabase.from('achievements').insert([{
        student_id: user.id,
        title: formData.title,
        category_id: formData.category_id,
        description: formData.description,
        status: 'Pending',
        certificate_url: certUrl,
        proof_url: proofUrl,
        // date and organizer aren't standard from our last view of achievements, 
        // but can be added if the schema supports it. We will leave them out for safety
        // or just rely on created_at.
      }]);

      if (insertError) throw insertError;
      
      setSuccess(true);
      setTimeout(() => navigate('/my-achievements'), 2000);
    } catch (err) {
      console.error('Error submitting achievement:', err);
      setError(err.message || 'Failed to submit achievement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-achievement-page" style={{ maxWidth: '1000px' }}>
      <div className="mb-4">
        <h6 className="text-primary fw-bold text-uppercase mb-2"><i className="bi bi-plus-circle me-2"></i>New Submission</h6>
        <h1 className="fw-bold mb-3">Capture Your Success</h1>
        <p className="text-muted fs-5">Document your academic, extracurricular, and research milestones to build your prestige profile and earn institutional rewards.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Achievement submitted successfully! Redirecting...</div>}

      <div className="row g-4">
        {/* Form Section */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 rounded-4">
            <h6 className="text-primary mb-4 fw-bold"><i className="bi bi-info-circle me-2"></i>Core Information</h6>
            
            <form onSubmit={handleSubmit} id="achievementForm">
              <div className="mb-4">
                <label className="form-label fw-semibold small text-dark">Achievement Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-control p-3 bg-light border-0" placeholder="e.g. Dean's List Spring 2024" />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-dark">Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} required className="form-select p-3 bg-light border-0 text-muted">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-dark">Date of Achievement</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control p-3 bg-light border-0 text-muted" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small text-dark">Organizer / Issuing Body</label>
                <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} className="form-control p-3 bg-light border-0" placeholder="e.g. Faculty of Engineering, Global Research Council" />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold small text-dark">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="form-control p-3 bg-light border-0" rows="5" placeholder="Detail the significance, your role, and the impact of this achievement..."></textarea>
              </div>
            </form>
          </div>
        </div>

        {/* Upload & Reward Section */}
        <div className="col-lg-4">
          
          {/* Certificate Upload */}
          <div className="card border-0 shadow-sm p-4 rounded-4 text-center mb-4 border border-1 border-dashed" style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
            <div className="mx-auto bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center mb-3" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-patch-check fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1">Official Certificate</h6>
            <p className="text-muted small mb-4">{certificateFile ? certificateFile.name : 'PDF, JPG or PNG (Max 5MB)'}</p>
            <input type="file" ref={certInputRef} className="d-none" onChange={(e) => handleFileChange(e, 'certificate')} accept=".pdf,image/*" />
            <button type="button" onClick={() => certInputRef.current?.click()} className="btn btn-light border text-primary fw-bold w-100 py-2 rounded-pill">
              {certificateFile ? 'Change File' : 'Upload File'}
            </button>
          </div>

          {/* Proof Upload */}
          <div className="card border-0 shadow-sm p-4 rounded-4 text-center mb-4 border border-1 border-dashed" style={{ borderStyle: 'dashed', borderColor: '#cbd5e1' }}>
            <div className="mx-auto bg-warning-subtle text-warning rounded-circle d-flex justify-content-center align-items-center mb-3" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-paperclip fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1">Proof of Achievement</h6>
            <p className="text-muted small mb-4">{proofFile ? proofFile.name : 'Photos, Links, or Event Docs'}</p>
            <input type="file" ref={proofInputRef} className="d-none" onChange={(e) => handleFileChange(e, 'proof')} accept=".pdf,image/*" />
            <button type="button" onClick={() => proofInputRef.current?.click()} className="btn btn-light border text-primary fw-bold w-100 py-2 rounded-pill">
              {proofFile ? 'Change Proof' : 'Add Proof'}
            </button>
          </div>

          {/* Estimated Reward */}
          <div className="card border-0 shadow-sm p-4 rounded-4 text-white position-relative overflow-hidden" style={{ background: '#0a3672' }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <i className="bi bi-award-fill text-warning fs-3"></i>
              <span className="badge bg-white text-dark rounded-pill fw-semibold">In Progress</span>
            </div>
            <div className="progress mb-3 bg-white bg-opacity-25" style={{ height: '6px' }}>
              <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
            </div>
            <div className="small text-white-50 fw-semibold">Estimated Reward: 150 Points</div>
          </div>

        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-4">
         <button type="submit" form="achievementForm" disabled={loading} className="btn btn-primary px-5 py-3 rounded-pill fw-bold fs-6">
           {loading ? 'Submitting...' : 'Submit Achievement for Review'}
         </button>
      </div>
    </div>
  );
};

export default AddAchievement;
