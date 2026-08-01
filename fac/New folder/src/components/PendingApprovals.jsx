import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Eye, Flag, Check, X, 
  Clock, Plus, XCircle, CheckCircle, Award
} from 'lucide-react';

export default function PendingApprovals({ pendingList, setPendingList, onAction, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modal State for adding a new student submission
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [regNum, setRegNum] = useState('');
  const [certTitle, setCertTitle] = useState('');
  const [certCategory, setCertCategory] = useState('TECHNICAL CERTIFICATION');
  const [certIssuer, setCertIssuer] = useState('');

  // Handle Search and Filter
  const filteredList = pendingList.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regNum.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'All' || 
      item.category.toUpperCase() === filterType.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  // Handle addition of a mock student submission
  const handleAddSubmission = (e) => {
    e.preventDefault();
    if (!studentName || !regNum || !certTitle || !certIssuer) {
      alert("Please fill in all details.");
      return;
    }
    const newSubmission = {
      id: Date.now(),
      studentName,
      regNum,
      title: certTitle,
      category: certCategory,
      issuer: certIssuer,
      date: new Date().toISOString().split('T')[0],
      avatar: studentName.split(' ').map(n => n[0]).join('')
    };

    setPendingList([newSubmission, ...pendingList]);
    setShowAddModal(false);
    // Reset Form
    setStudentName('');
    setRegNum('');
    setCertTitle('');
    setCertIssuer('');
  };

  // Thumbnail generators based on category type
  const renderThumbnail = (category) => {
    switch (category) {
      case 'TECHNICAL CERTIFICATION':
        return (
          <div className="mock-cert-svg">
            <div className="text-center" style={{ fontSize: '0.45rem', fontWeight: 'bold', color: '#854d0e' }}>
              CERTIFICATE
            </div>
            <Award className="mx-auto text-warning" size={24} style={{ opacity: 0.8 }} />
            <div className="text-center" style={{ fontSize: '0.35rem', color: '#a16207', scale: '0.9' }}>
              COMPLETION
            </div>
          </div>
        );
      case 'COMPETITION':
        return (
          <div className="mock-badge-svg">
            <div className="text-center text-orange" style={{ transform: 'rotate(-5deg)' }}>
              <Award size={28} className="text-danger mb-1" />
              <div className="fw-bold" style={{ fontSize: '0.4rem', color: '#c2410c' }}>WINNER</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="mock-doc-svg">
            <div className="bg-secondary rounded" style={{ height: '3px', width: '80%', marginBottom: '4px' }}></div>
            <div className="bg-secondary rounded" style={{ height: '3px', width: '100%', marginBottom: '4px' }}></div>
            <div className="bg-secondary rounded" style={{ height: '3px', width: '90%', marginBottom: '4px' }}></div>
            <div className="bg-secondary rounded" style={{ height: '3px', width: '60%' }}></div>
            <div className="mt-auto text-end" style={{ fontSize: '0.35rem', fontWeight: 'bold', color: '#64748b' }}>
              PDF.txt
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container py-4">
      {/* Top Banner section matching the reference headers */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Faculty Achievement Portal</h4>
        
        <div className="d-flex align-items-center gap-3">
          <div className="glass-input-group d-none d-md-block" style={{ width: '220px' }}>
            <span className="glass-input-icon"><Search size={16} /></span>
            <input type="text" className="glass-input py-1.5" placeholder="Global search..." style={{ fontSize: '0.8rem' }} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="text-end d-none d-sm-block">
              <h6 className="mb-0 fs-7 fw-bold text-dark font-heading">Dr. Sarah Jenkins</h6>
              <span className="text-muted fs-8">DEAN OF RESEARCH</span>
            </div>
            <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
              SJ
            </div>
          </div>
        </div>
      </div>

      {/* Main Title Row */}
      <div className="mb-4">
        <h3 className="mb-1 fw-bold text-dark font-heading">Verification Queue</h3>
        <p className="text-muted small">Review and approve student achievement submissions for this semester.</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-3 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        {/* Search */}
        <div className="glass-input-group flex-grow-1" style={{ maxWidth: '450px' }}>
          <span className="glass-input-icon">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="glass-input"
            placeholder="Search by student or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-1.5">
            <SlidersHorizontal size={16} className="text-muted" />
            <select
              className="glass-input py-1.5 border-0 bg-transparent fs-7 fw-medium"
              style={{ width: '130px', paddingLeft: '0.5rem' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Technical Certification">Certifications</option>
              <option value="Competition">Competitions</option>
              <option value="Research Publication">Publications</option>
            </select>
          </div>

          <div className="fs-7 text-muted d-flex align-items-center gap-2">
            <span>Sort by:</span>
            <span className="fw-bold text-primary cursor-pointer" onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}>
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </span>
          </div>
        </div>
      </div>

      {/* Verification List Cards */}
      <div className="verification-list">
        {filteredList.length === 0 ? (
          <div className="glass-panel p-5 text-center text-muted">
            No pending submissions match your filters.
          </div>
        ) : (
          filteredList.map((item) => (
            <div key={item.id} className="queue-card align-items-center">
              {/* Left Side: Thumbnail Preview */}
              <div className="cert-thumbnail-container">
                {renderThumbnail(item.category)}
              </div>

              {/* Middle Side: Details */}
              <div className="flex-grow-1">
                {/* Category Badge */}
                <span className={`badge-category ${
                  item.category === 'TECHNICAL CERTIFICATION' ? 'badge-tech' : 
                  item.category === 'COMPETITION' ? 'badge-comp' : 'badge-pub'
                }`}>
                  {item.category}
                </span>

                {/* Achievement Title */}
                <h5 className="mb-2 text-dark font-heading fs-6 fw-bold">{item.title}</h5>

                {/* Student Info Details */}
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-secondary-subtle text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                    {item.avatar}
                  </div>
                  <div>
                    <span className="text-dark fw-semibold fs-7 d-block leading-sm">{item.studentName}</span>
                    <span className="text-muted fs-8">Reg: {item.regNum}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Status and Actions */}
              <div className="d-flex flex-column align-items-md-end justify-content-between h-100 gap-3">
                {/* Pending Badge */}
                <span className="badge border border-warning text-warning px-3 py-1.5 rounded-pill fw-semibold bg-warning-subtle bg-opacity-25 fs-8 d-inline-flex align-items-center gap-1">
                  <Clock size={12} />
                  Pending
                </span>

                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-2 mt-auto">
                  <button 
                    className="btn border-0 text-muted p-2 hover-dark" 
                    title="View Full Document"
                    onClick={() => onSelect(item)}
                  >
                    <Eye size={18} />
                  </button>
                  <button className="btn border-0 text-muted p-2 hover-dark" title="Flag submission"><Flag size={16} /></button>
                  
                  <button 
                    className="btn btn-outline-danger fs-7 px-3 py-1.5 d-flex align-items-center gap-1 rounded-3"
                    onClick={() => onAction(item.id, 'reject', item.title, item.studentName)}
                  >
                    <X size={14} />
                    Reject
                  </button>
                  <button 
                    className="btn btn-success fs-7 px-3 py-1.5 d-flex align-items-center gap-1 rounded-3 text-white"
                    onClick={() => onAction(item.id, 'approve', item.title, item.studentName)}
                  >
                    <Check size={14} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls at the bottom */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-2 flex-wrap gap-3">
        <span className="text-muted fs-7">
          Showing 1 to {filteredList.length} of {pendingList.length} pending requests
        </span>
        <nav aria-label="Page navigation">
          <ul className="pagination pagination-sm m-0 align-items-center gap-1">
            <li className="page-item"><a className="page-link border-0 text-muted rounded bg-transparent" href="#prev">&lt;</a></li>
            <li className="page-item active"><a className="page-link border-0 rounded bg-primary text-white" href="#p1">1</a></li>
            <li className="page-item"><a className="page-link border-0 text-muted rounded bg-transparent" href="#p2">2</a></li>
            <li className="page-item"><a className="page-link border-0 text-muted rounded bg-transparent" href="#p3">3</a></li>
            <li className="page-item"><span className="px-2 text-muted">...</span></li>
            <li className="page-item"><a className="page-link border-0 text-muted rounded bg-transparent" href="#p14">14</a></li>
            <li className="page-item"><a className="page-link border-0 text-muted rounded bg-transparent" href="#next">&gt;</a></li>
          </ul>
        </nav>
      </div>

      {/* Floating Action Button for adding pending requests */}
      <button 
        className="floating-action-btn"
        onClick={() => setShowAddModal(true)}
        title="Add Mock Pending Submission"
      >
        <Plus size={26} />
      </button>

      {/* Add Mock Student Submission Modal (CSS Glass Overlaid) */}
      {showAddModal && (
        <div className="position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel p-4 p-sm-5 fade-in-slide w-100 m-3" style={{ maxWidth: '480px', background: 'rgba(255,255,255,0.95)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold text-dark font-heading">Add Mock Pending Submission</h5>
              <button className="btn border-0 p-1" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddSubmission}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-medium">Student Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Liam Smith" 
                  style={{ paddingLeft: '1rem' }}
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-medium">Register Number</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. 2024CS0991" 
                  style={{ paddingLeft: '1rem' }}
                  required
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-medium">Certificate Title</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Google Cloud Cloud Digital Leader" 
                  style={{ paddingLeft: '1rem' }}
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted small fw-medium">Category</label>
                  <select 
                    className="glass-input" 
                    style={{ paddingLeft: '1rem' }}
                    value={certCategory}
                    onChange={(e) => setCertCategory(e.target.value)}
                  >
                    <option value="TECHNICAL CERTIFICATION">Technical Certification</option>
                    <option value="COMPETITION">Competition</option>
                    <option value="RESEARCH PUBLICATION">Research Publication</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted small fw-medium">Issuing Authority</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="e.g. Coursera / IEEE" 
                    style={{ paddingLeft: '1rem' }}
                    required
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-glass-primary w-100">
                Submit Pending Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
