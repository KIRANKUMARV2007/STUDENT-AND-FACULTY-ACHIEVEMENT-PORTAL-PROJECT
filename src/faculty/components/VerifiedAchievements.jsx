import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download, Eye, Award, CheckCircle } from 'lucide-react';

export default function VerifiedAchievements({ verifiedList }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter listings
  const filteredList = verifiedList.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'All' || 
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-4">
      {/* Top Banner section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Faculty Achievement Portal</h4>
        <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
          SJ
        </div>
      </div>

      {/* Main Title Row */}
      <div className="mb-4">
        <span className="fs-8 text-muted fw-bold text-uppercase tracking-wider">Management</span>
        <h3 className="mb-1 fw-bold text-dark font-heading">Verified Achievements</h3>
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
            placeholder="Search students or achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Buttons Controls */}
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-glass-secondary py-2 px-3 d-flex align-items-center gap-1.5"
            onClick={() => alert("Categories filters options...")}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
          
          <button 
            className="btn btn-outline-primary py-2 px-3 d-flex align-items-center gap-1.5 rounded-3"
            onClick={() => alert("Exporting verified items to Excel...")}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Verified List */}
      <div className="verified-list-flow">
        {filteredList.length === 0 ? (
          <div className="glass-panel p-5 text-center text-muted">
            No verified achievements match your criteria.
          </div>
        ) : (
          filteredList.map((item) => (
            <div key={item.id} className="verified-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              {/* Left Side: Avatar and Description */}
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                  {item.avatar}
                </div>
                <div>
                  <h5 className="mb-1 text-dark font-heading fs-6 fw-bold">{item.studentName}</h5>
                  <p className="text-muted small mb-2">{item.title}</p>
                  
                  {/* Indicators Badges */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-secondary-subtle text-dark-emphasis px-2.5 py-1 rounded fs-8">{item.category}</span>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded fs-8 d-inline-flex align-items-center gap-1">
                      <CheckCircle size={10} />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Metrics and Details button */}
              <div className="d-flex flex-row flex-md-column justify-content-between align-items-md-end gap-3 flex-wrap">
                <div className="d-flex gap-4">
                  {/* Approved Date */}
                  <div className="text-start text-md-end">
                    <span className="text-muted fs-8 fw-semibold text-uppercase d-block mb-1">Approved Date</span>
                    <span className="text-dark fs-7 fw-medium">{item.date}</span>
                  </div>
                  {/* Reward Points */}
                  <div className="text-start text-md-end">
                    <span className="text-muted fs-8 fw-semibold text-uppercase d-block mb-1">Reward</span>
                    <span className="text-success fs-7 fw-bold">🏆 {item.points} pts</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mt-md-2 w-100 justify-content-md-end">
                  {item.badge && (
                    <span className="verified-scholar-badge fs-8 me-2">
                      {item.badge}
                    </span>
                  )}
                  <button 
                    className="btn btn-primary text-white fs-7 px-3 py-1.5 rounded-3 shadow-sm"
                    onClick={() => alert(`Details for submission by ${item.studentName}: Approved ${item.date}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls at the bottom */}
      {filteredList.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <nav aria-label="Verified navigation">
            <ul className="pagination pagination-sm m-0 align-items-center gap-1.5 bg-white bg-opacity-40 border p-1 rounded-pill shadow-sm">
              <li className="page-item"><a className="page-link border-0 text-muted rounded-circle bg-transparent" href="#prev">&lt;</a></li>
              <li className="page-item"><a className="page-link border-0 rounded-circle bg-primary text-white" href="#p1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</a></li>
              <li className="page-item"><a className="page-link border-0 text-muted rounded-circle bg-transparent" href="#p2" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</a></li>
              <li className="page-item"><a className="page-link border-0 text-muted rounded-circle bg-transparent" href="#p3" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</a></li>
              <li className="page-item"><a className="page-link border-0 text-muted rounded-circle bg-transparent" href="#next">&gt;</a></li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
