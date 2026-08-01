import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RewardPoints.css';

const RewardPoints = () => {
  const navigate = useNavigate();
  return (
    <div className="reward-points-page">
      <div className="row mb-5 g-4">
        {/* Total Points Card */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm text-white p-5 h-100 position-relative overflow-hidden" style={{ background: '#2156a6', borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-start position-relative z-index-1">
              <div>
                <h6 className="text-uppercase fw-bold text-white-50 mb-2" style={{ letterSpacing: '1px' }}>Total Accumulated Points</h6>
                <h1 className="fw-bold mb-0" style={{ fontSize: '4.5rem', color: '#ffc107' }}>1,250</h1>
              </div>
              <div className="bg-primary-dark rounded p-3 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <i className="bi bi-award-fill text-warning" style={{ fontSize: '2.5rem' }}></i>
              </div>
            </div>

            <div className="d-flex gap-5 mt-5 position-relative z-index-1">
              <div>
                <div className="text-white-50 fw-semibold mb-1">Academic</div>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></div>
                  <span className="fw-bold">850 pts</span>
                </div>
              </div>
              <div>
                <div className="text-white-50 fw-semibold mb-1">Sports</div>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-white" style={{ width: '8px', height: '8px' }}></div>
                  <span className="fw-bold">250 pts</span>
                </div>
              </div>
              <div>
                <div className="text-white-50 fw-semibold mb-1">Research</div>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-white" style={{ width: '8px', height: '8px' }}></div>
                  <span className="fw-bold">150 pts</span>
                </div>
              </div>
            </div>
            
            {/* Background design elements */}
            <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', backgroundColor: 'rgba(255,255,255,0.05)', top: '-50px', right: '-100px' }}></div>
          </div>
        </div>

        {/* Milestone Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '16px' }}>
            <h5 className="fw-bold text-primary mb-3">Next Milestone</h5>
            
            <div className="d-flex justify-content-between align-items-end mb-2">
              <span className="fw-bold fs-5">Silver Honor</span>
              <span className="text-warning fw-bold small">250 pts to go</span>
            </div>
            <div className="progress mb-4" style={{ height: '10px' }}>
              <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>

            <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
              Complete <span className="fw-bold text-primary">1 more research paper</span> or earn <span className="fw-bold text-primary">High Distinction</span> in exams to unlock Silver benefits.
            </p>

            <button onClick={() => navigate('/leaderboard')} className="btn btn-outline-primary w-100 fw-bold d-flex justify-content-between align-items-center py-2 mt-auto" style={{ borderRadius: '12px' }}>
              <span>View Milestone Benefits</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-5">
        {/* Rewards Section */}
        <div className="col-xl-8">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h4 className="fw-bold text-primary mb-1">Redeem Rewards</h4>
              <p className="text-muted mb-0">Turn your achievements into tangible benefits</p>
            </div>
            <a href="#" className="fw-bold text-decoration-none">All Rewards <i className="bi bi-arrow-right"></i></a>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
                <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=300&fit=crop" className="w-100" style={{ height: '180px', objectFit: 'cover' }} alt="Library" />
                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill">500 Points</span>
                </div>
                <div className="p-4 d-flex flex-column h-100">
                  <h5 className="fw-bold mb-2">Library VIP Credits</h5>
                  <p className="text-muted small flex-grow-1">Gain priority access to private study pods and extended borrowing limits for the entire semester.</p>
                  <button className="btn btn-primary w-100 fw-bold py-2 mt-3" style={{ borderRadius: '8px' }}>Redeem Now</button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
                <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop" className="w-100" style={{ height: '180px', objectFit: 'cover' }} alt="Workshop" />
                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill">850 Points</span>
                </div>
                <div className="p-4 d-flex flex-column h-100">
                  <h5 className="fw-bold mb-2">Workshop Waiver</h5>
                  <p className="text-muted small flex-grow-1">100% discount on any certified Advanced Leadership or Technical Skill workshop in the next quarter.</p>
                  <button className="btn btn-primary w-100 fw-bold py-2 mt-3" style={{ borderRadius: '8px' }}>Redeem Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="col-xl-4">
          <h4 className="fw-bold text-primary mb-4">Point History</h4>
          
          <div className="timeline-container ps-3 border-start border-2 border-primary-subtle position-relative">
            
            <div className="timeline-item mb-4 position-relative">
              <div className="timeline-dot position-absolute bg-warning rounded-circle" style={{ width: '12px', height: '12px', left: '-23px', top: '5px' }}></div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="fw-bold mb-0">Dean's List Achievement</h6>
                <span className="fw-bold text-warning">+500</span>
              </div>
              <p className="text-muted small mb-2">Awarded for GPA of 3.9 in Semester 1</p>
              <div className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>OCT 12, 2023 • ACADEMIC</div>
            </div>

            <div className="timeline-item mb-4 position-relative">
              <div className="timeline-dot position-absolute bg-warning rounded-circle" style={{ width: '12px', height: '12px', left: '-23px', top: '5px' }}></div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="fw-bold mb-0">Varsity Meet MVP</h6>
                <span className="fw-bold text-warning">+150</span>
              </div>
              <p className="text-muted small mb-2">Outstanding performance in Inter-College Athletics</p>
              <div className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>SEP 28, 2023 • SPORTS</div>
            </div>

            <div className="timeline-item position-relative">
              <div className="timeline-dot position-absolute bg-warning rounded-circle" style={{ width: '12px', height: '12px', left: '-23px', top: '5px' }}></div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="fw-bold mb-0">Research Citation</h6>
                <span className="fw-bold text-success">+75</span>
              </div>
              <p className="text-muted small mb-2">Paper cited in International Journal of Tech</p>
              <div className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>AUG 15, 2023 • RESEARCH</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardPoints;
