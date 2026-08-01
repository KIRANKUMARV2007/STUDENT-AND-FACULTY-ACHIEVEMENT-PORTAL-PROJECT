import React from 'react';
import { Link } from 'react-router-dom';
import './AchievementDetail.css';

const AchievementDetail = () => {
  return (
    <div className="achievement-detail-page pb-5">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-3 small fw-bold">
          <Link to="/my-achievements" className="text-decoration-none">My Achievements</Link>
          <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
          <span className="text-primary">Research Excellence Award</span>
        </div>

        <div className="d-flex align-items-center gap-3 mb-3">
          <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2 fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>DEAN'S HONOR</span>
          <span className="text-muted small fw-semibold"><i className="bi bi-patch-check-fill text-success me-1"></i> Verified Oct 24, 2023</span>
        </div>

        <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">
          <div style={{ maxWidth: '800px' }}>
            <h1 className="fw-bold text-primary mb-3" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>National Research Symposium: First Place</h1>
            <p className="text-muted fs-5">Awarded for the groundbreaking study on "Autonomous Systems in Urban Environments" at the 2023 Academic Summit.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 fw-bold shadow-sm bg-white">
              <i className="bi bi-download"></i> Download PDF
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2 px-4 fw-bold shadow-sm">
              <i className="bi bi-share"></i> Share Achievement
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          
          {/* Meta Info */}
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4 bg-white">
            <div className="d-flex justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-light rounded p-2 text-muted"><i className="bi bi-diagram-3 fs-5"></i></div>
                <div>
                  <div className="small text-muted fw-bold text-uppercase">Category</div>
                  <div className="fw-bold fs-6">Academic Research</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="bg-light rounded p-2 text-muted"><i className="bi bi-calendar3 fs-5"></i></div>
                <div>
                  <div className="small text-muted fw-bold text-uppercase">Date Earned</div>
                  <div className="fw-bold fs-6">October 12, 2023</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-3">
                <div className="bg-light rounded p-2 text-muted"><i className="bi bi-briefcase fs-5"></i></div>
                <div>
                  <div className="small text-muted fw-bold text-uppercase">Organizer</div>
                  <div className="fw-bold fs-6">Nat. Research Inst.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Summary */}
          <div className="mb-5">
            <h4 className="fw-bold mb-3">Achievement Summary</h4>
            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
              The Research Excellence Award is granted to undergraduate students who demonstrate exceptional analytical skills and innovative thinking in technical domains. This year's symposium hosted over 400 participants from 50 universities nationwide. The research titled "Autonomous Systems in Urban Environments" focused on optimizing last-mile delivery protocols using decentralized AI clusters.
            </p>

            <div className="bg-light p-4 rounded-4 border-start border-4 border-warning position-relative">
              <i className="bi bi-quote position-absolute text-warning" style={{ fontSize: '3rem', opacity: 0.2, top: '10px', left: '15px' }}></i>
              <p className="fst-italic text-muted mb-0" style={{ lineHeight: '1.7', position: 'relative', zIndex: 1, paddingLeft: '20px' }}>
                "Alex demonstrated a level of technical maturity usually seen in postgraduate scholars. Their work on AI clusters is already being reviewed for publication in the international journal."
              </p>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Certificate Preview</h5>
              <button className="btn btn-sm btn-link text-decoration-none fw-bold"><i className="bi bi-arrows-fullscreen"></i> View Full Screen</button>
            </div>
            
            <div className="bg-light rounded-3 p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
               {/* Mock Certificate Visual */}
               <div className="bg-white p-5 text-center shadow-sm position-relative" style={{ width: '100%', maxWidth: '600px', border: '1px solid #e2e8f0' }}>
                 <div className="position-absolute top-0 start-0 w-100 h-100 border border-4 border-white" style={{ pointerEvents: 'none' }}></div>
                 <div className="position-absolute" style={{ top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px solid #e2e8f0', pointerEvents: 'none' }}></div>
                 
                 <h2 className="text-primary fw-bold mb-1" style={{ letterSpacing: '2px', fontFamily: 'serif' }}>CERTIFICATE OF</h2>
                 <h2 className="text-primary fw-bold mb-4" style={{ letterSpacing: '2px', fontFamily: 'serif' }}>ACHIEVEMENT</h2>
                 
                 <p className="text-muted small fst-italic mb-3">PRESENTED TO</p>
                 <h1 className="fw-bold mb-4 border-bottom border-2 pb-2 mx-auto" style={{ maxWidth: '300px', fontFamily: 'serif' }}>Alex Rivera</h1>
                 
                 <p className="text-muted small px-4 mx-auto" style={{ maxWidth: '400px' }}>
                   For outstanding performance and achieving First Place in the National Research Symposium of 2023.
                 </p>
               </div>
            </div>
          </div>

          {/* Impact Metrics Row (from bottom of image 1) */}
          <div className="row g-3">
            <div className="col-md-4">
              <div className="bg-light rounded-4 p-3 d-flex align-items-center gap-3 h-100">
                <h2 className="fw-bold mb-0 text-primary opacity-25">01</h2>
                <div>
                  <div className="fw-bold small">Leaderboard Impact</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Jumped +12 spots this month</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light rounded-4 p-3 d-flex align-items-center gap-3 h-100">
                <h2 className="fw-bold mb-0 text-primary opacity-25">02</h2>
                <div>
                  <div className="fw-bold small">Skill Endorsement</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Unlocked "Advanced Analyst"</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light rounded-4 p-3 d-flex align-items-center gap-3 h-100">
                <h2 className="fw-bold mb-0 text-primary opacity-25">03</h2>
                <div>
                  <div className="fw-bold small">Career Readiness</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Top 2% in Research Category</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          
          {/* Reward Impact Card */}
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4 text-white text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #104c91 0%, #1f6bc4 100%)' }}>
            <div className="text-uppercase small fw-bold text-white-50 mb-3" style={{ letterSpacing: '1px' }}>Reward Impact</div>
            <h1 className="fw-bold mb-0" style={{ fontSize: '4rem' }}>+450</h1>
            <h4 className="fw-bold mb-4">Achievement<br/>Points</h4>
            <p className="small text-white-50 px-2 mb-5">Contributes to the University Leaderboard rank and qualifies for Honor Grants.</p>
            
            <div className="d-flex justify-content-between align-items-center small fw-bold mb-2">
              <span>LEVEL 4 SCHOLAR</span>
              <span>TOP 5%</span>
            </div>
            <div className="progress bg-white bg-opacity-25" style={{ height: '4px' }}>
              <div className="progress-bar bg-warning" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Approval Lifecycle */}
          <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><i className="bi bi-activity text-primary"></i> Approval Lifecycle</h6>
            
            <div className="timeline-vertical">
              <div className="d-flex gap-3 mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-send-fill small"></i>
                  </div>
                  <div className="flex-grow-1 border-start border-2 mt-2" style={{ minHeight: '40px' }}></div>
                </div>
                <div>
                  <div className="fw-bold small">Submitted</div>
                  <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Oct 14, 10:24 AM</div>
                  <div className="text-muted small">Document uploaded.</div>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-search small"></i>
                  </div>
                  <div className="flex-grow-1 border-start border-2 mt-2" style={{ minHeight: '40px' }}></div>
                </div>
                <div>
                  <div className="fw-bold small">Reviewed by Academic Advisory Committee.</div>
                  <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Oct 16, 02:15 PM</div>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-shield-check small"></i>
                  </div>
                  <div className="flex-grow-1 border-start border-2 mt-2" style={{ minHeight: '40px' }}></div>
                </div>
                <div>
                  <div className="fw-bold small">Final Verification</div>
                  <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Oct 24, 09:00 AM</div>
                  <div className="text-muted small">Authenticated via External Board records.</div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <div className="d-flex flex-column align-items-center">
                  <div className="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-star-fill small"></i>
                  </div>
                </div>
                <div>
                  <div className="fw-bold small text-warning-emphasis">Rewards Disbursed</div>
                  <div className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>Oct 24, 11:30 AM</div>
                  <div className="text-muted small">Points successfully added to student wallet.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Assets */}
          <div className="card border-0 shadow-sm p-4 rounded-4">
            <h6 className="fw-bold mb-4">Supporting Assets</h6>
            
            <div className="border rounded-3 p-3 d-flex align-items-center gap-3 mb-3 hover-highlight cursor-pointer">
              <div className="bg-danger-subtle text-danger rounded p-2 text-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-file-earmark-pdf fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold small">Research_T...</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>2.4 MB • PDF Document</div>
              </div>
              <i className="bi bi-download text-muted"></i>
            </div>
            
            <div className="border rounded-3 p-3 d-flex align-items-center gap-3 hover-highlight cursor-pointer">
              <div className="bg-primary-subtle text-primary rounded p-2 text-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-image fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <div className="fw-bold small">Symposium...</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>4.1 MB • Image</div>
              </div>
              <i className="bi bi-eye text-muted"></i>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AchievementDetail;
