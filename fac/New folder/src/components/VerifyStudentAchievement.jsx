import React, { useState } from 'react';
import { 
  ArrowLeft, ZoomIn, Download, RotateCw, CheckSquare, 
  HelpCircle, ChevronRight, Check, X, ShieldAlert, Award, FileText
} from 'lucide-react';

export default function VerifyStudentAchievement({ item, onAction, onBack }) {
  const [checklist, setChecklist] = useState({
    authenticity: false,
    idMatch: false,
    categoryMatch: false,
    dateSemester: false
  });
  const [remarks, setRemarks] = useState('');

  const toggleCheck = (key) => {
    setChecklist({ ...checklist, [key]: !checklist[key] });
  };

  const handleApprove = () => {
    // Basic warnings if not all checked
    if (!checklist.authenticity || !checklist.idMatch || !checklist.categoryMatch || !checklist.dateSemester) {
      if (!window.confirm("Some verification checklist items are unchecked. Do you still want to approve this achievement?")) {
        return;
      }
    }
    onAction(item.id, 'approve', item.title, item.studentName);
    onBack();
  };

  const handleReject = () => {
    if (!remarks) {
      alert("Please provide remarks explaining the reason for rejection.");
      return;
    }
    onAction(item.id, 'reject', item.title, item.studentName);
    onBack();
  };

  return (
    <div className="container py-4 fade-in-slide">
      {/* Breadcrumbs header */}
      <div className="d-flex align-items-center gap-2 mb-3 text-muted fs-8">
        <span className="cursor-pointer hover-dark" onClick={onBack}>Pending Approvals</span>
        <ChevronRight size={12} />
        <span className="text-dark fw-medium">Verification Details</span>
      </div>

      {/* Main Title Row */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h3 className="mb-0 fw-bold text-dark font-heading">Verify Student Achievement</h3>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted fs-7">Submission ID: #ACH-88921</span>
          <span className="badge border border-success text-success px-2.5 py-1 rounded fs-8 fw-semibold bg-success-subtle bg-opacity-25">
            PRIORITY
          </span>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="row g-4">
        {/* Left Column: Document evidence and Achievement Details */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-4">
            
            {/* Document Evidence */}
            <div className="glass-panel p-4 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-dark font-heading fw-bold d-flex align-items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  Document Evidence
                </h5>
                <div className="d-flex gap-2">
                  <button className="btn border-0 p-1 text-muted hover-dark" title="Zoom in"><ZoomIn size={16} /></button>
                  <button className="btn border-0 p-1 text-muted hover-dark" title="Download"><Download size={16} /></button>
                  <button className="btn border-0 p-1 text-muted hover-dark" title="Rotate"><RotateCw size={16} /></button>
                </div>
              </div>

              {/* Certificate preview card container */}
              <div className="w-100 bg-white border border-light-subtle rounded-4 p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                <div className="w-100" style={{ maxWidth: '480px', border: '8px double #d97706', padding: '20px', background: '#fefdfa', position: 'relative' }}>
                  {/* Decorative stamp seal */}
                  <div className="position-absolute" style={{ right: '30px', bottom: '30px', width: '60px', height: '60px', borderRadius: '50%', border: '2px dashed #ca8a04', opacity: 0.15 }}></div>
                  
                  <div className="text-center font-heading fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#b45309', letterSpacing: '2px' }}>
                    CERTIFICATE OF EXCELLENCE
                  </div>
                  <div className="text-center text-muted fs-8 mb-4">THIS IS PROUDLY PRESENTED TO</div>
                  
                  <h4 className="text-center fw-bold font-heading mb-1 text-dark" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    {item.studentName}
                  </h4>
                  
                  <p className="text-center text-muted fs-8 mb-4 leading-sm mt-3 px-3">
                    for successfully demonstrating outstanding skills and securing first place in the <strong>{item.title}</strong> held during this academic session.
                  </p>
                  
                  <div className="d-flex justify-content-between mt-4 fs-8 text-muted pt-2" style={{ borderTop: '1px dashed #e2e8f0' }}>
                    <div>
                      <span className="d-block fw-bold text-dark">Ministry of Ed.</span>
                      <span>Issuing Authority</span>
                    </div>
                    <div className="text-end">
                      <span className="d-block fw-bold text-dark">June 15, 2026</span>
                      <span>Date Awarded</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Details */}
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="fs-8 text-muted fw-bold text-uppercase tracking-wider">TITLE</span>
                  <h5 className="mb-0 text-dark font-heading fw-bold mt-0.5">{item.title}</h5>
                </div>
                <span className="badge bg-primary text-white fs-8 px-2.5 py-1 rounded fw-semibold">
                  Hackathon Winner
                </span>
              </div>

              <div className="mb-4">
                <span className="fs-8 text-muted fw-bold text-uppercase tracking-wider">DESCRIPTION</span>
                <p className="fs-7 text-muted lh-sm mt-1">
                  Led a team of four to develop an autonomous energy monitoring system using IoT and machine learning. The project was recognized for its scalability and immediate impact on smart city infrastructure. Competing against 150+ teams nationwide.
                </p>
              </div>

              <div className="row g-3 fs-7 border-top pt-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="col-6">
                  <span className="text-muted d-block fs-8">Date of Achievement</span>
                  <strong className="text-dark">{item.date}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block fs-8">Issuing Authority</span>
                  <strong className="text-dark">{item.issuer}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Student Info, Checklist, and Remarks */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4">
            
            {/* Student Information */}
            <div className="glass-panel p-4">
              <h6 className="fw-bold text-muted text-uppercase fs-8 mb-3 tracking-wider">Student Information</h6>
              
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
                  {item.avatar}
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark font-heading fs-7">{item.studentName}</h6>
                  <span className="text-muted fs-8 d-block mb-1">Reg No: {item.regNum}</span>
                  <span className="badge bg-light text-muted border px-2 py-1 rounded fs-8 fw-semibold">
                    Computer Science Engineering
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="glass-panel p-4">
              <h6 className="fw-bold text-muted text-uppercase fs-8 mb-3 tracking-wider d-flex align-items-center gap-2">
                <CheckSquare size={16} className="text-primary" />
                Verification Checklist
              </h6>

              <div className="d-flex flex-column gap-3 fs-7">
                {/* Item 1 */}
                <label className="d-flex align-items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-check-input m-0" 
                    checked={checklist.authenticity}
                    onChange={() => toggleCheck('authenticity')}
                  />
                  <span className={checklist.authenticity ? 'text-dark fw-medium' : 'text-muted'}>
                    Authenticity of document verified
                  </span>
                </label>

                {/* Item 2 */}
                <label className="d-flex align-items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-check-input m-0" 
                    checked={checklist.idMatch}
                    onChange={() => toggleCheck('idMatch')}
                  />
                  <span className={checklist.idMatch ? 'text-dark fw-medium' : 'text-muted'}>
                    Matches Student ID & Reg No.
                  </span>
                </label>

                {/* Item 3 */}
                <label className="d-flex align-items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-check-input m-0" 
                    checked={checklist.categoryMatch}
                    onChange={() => toggleCheck('categoryMatch')}
                  />
                  <span className={checklist.categoryMatch ? 'text-dark fw-medium' : 'text-muted'}>
                    Achievement Category is appropriate
                  </span>
                </label>

                {/* Item 4 */}
                <label className="d-flex align-items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="form-check-input m-0" 
                    checked={checklist.dateSemester}
                    onChange={() => toggleCheck('dateSemester')}
                  />
                  <span className={checklist.dateSemester ? 'text-dark fw-medium' : 'text-muted'}>
                    Date falls within current semester
                  </span>
                </label>
              </div>
            </div>

            {/* Faculty Remarks */}
            <div className="glass-panel p-4">
              <h6 className="fw-bold text-muted text-uppercase fs-8 mb-3 tracking-wider">Faculty Remarks</h6>
              <textarea 
                className="glass-input w-100" 
                rows="4" 
                placeholder="Add your feedback or reasons for approval/rejection here..."
                style={{ paddingLeft: '1rem' }}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <div className="d-flex align-items-center gap-1 text-muted fs-8 mt-2.5 px-1">
                <HelpCircle size={12} />
                <span>These remarks will be visible to the student.</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom action panel bar */}
      <footer className="glass-panel p-3.5 mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <span className="text-muted fs-8">Last autosaved at 14:45 PM</span>
        
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-glass-secondary py-2" onClick={onBack}>
            Cancel
          </button>
          
          <button 
            className="btn btn-outline-danger px-4 py-2 rounded-3 fs-7"
            onClick={handleReject}
          >
            Reject
          </button>

          <button 
            className="btn btn-success text-white px-4 py-2 rounded-3 fs-7 d-flex align-items-center gap-1.5"
            onClick={handleApprove}
          >
            <Check size={16} />
            Approve
          </button>
        </div>
      </footer>
    </div>
  );
}
