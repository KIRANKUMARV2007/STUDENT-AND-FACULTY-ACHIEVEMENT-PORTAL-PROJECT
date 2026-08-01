import React, { useState } from 'react';
import { 
  GraduationCap, Award, Building, Microscope, Calendar, 
  Search, Play, Download, Table, BarChart2, Eye
} from 'lucide-react';
import { exportToPDF } from '../../utils/pdfExport';

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('Student Portfolio');
  const [dateRange, setDateRange] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [reportType, setReportType] = useState('Publications');
  const [status, setStatus] = useState('All Verified');
  
  const [generatedData, setGeneratedData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { id: 'Student Portfolio', label: 'Student Portfolio', icon: GraduationCap },
    { id: 'Faculty Achievement', label: 'Faculty Achievement', icon: Award },
    { id: 'Departmental Status', label: 'Departmental Status', icon: Building },
    { id: 'Research Grants', label: 'Research Grants', icon: Microscope },
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedData([
        { id: 1, name: "Elena Rodriguez", code: "2023CS012", desc: "Advanced Algorithmic Research Presentation", points: 450, date: "2023-10-24" },
        { id: 2, name: "Chen Wei", code: "2023CS042", desc: "Edge Device Deep Learning System", points: 150, date: "2023-10-18" },
        { id: 3, name: "Arjun Sharma", code: "2023CS088", desc: "Hybrid Scheduling Neural Architectures", points: 200, date: "2023-10-11" }
      ]);
    }, 1000);
  };

  return (
    <div className="container py-4">
      {/* Top Banner section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 font-heading text-primary fw-bold" style={{ fontSize: '1.25rem' }}>Reports Center</h4>
        <div className="bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
          SJ
        </div>
      </div>

      {/* Main Title Row */}
      <div className="mb-4">
        <h3 className="mb-1 fw-bold text-dark font-heading">Reports Center</h3>
        <p className="text-muted small">Generate, view, and export detailed academic and administrative reports.</p>
      </div>

      {/* Select Report Category Cards */}
      <div className="mb-4">
        <span className="fs-8 text-muted fw-bold text-uppercase tracking-wider mb-2 d-block">Select Report Category</span>
        
        <div className="row g-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.id} className="col-6 col-md-3">
                <div 
                  className={`report-selector-card ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setGeneratedData(null); // Clear preview when category changes
                  }}
                >
                  <div className="report-icon-box">
                    <Icon size={22} />
                  </div>
                  <h6 className="mb-0 fs-7 fw-bold text-dark font-heading">{cat.label}</h6>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Configuration Card */}
      <div className="glass-panel p-4 mb-4">
        <h5 className="mb-4 text-dark font-heading fw-bold">
          <SlidersIcon size={16} className="me-2 text-primary" />
          Report Configuration
        </h5>

        <form onSubmit={handleGenerate}>
          <div className="row g-3 mb-4">
            {/* Date Range */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label text-muted small fw-medium">Date Range</label>
              <div className="glass-input-group">
                <span className="glass-input-icon"><Calendar size={16} /></span>
                <input 
                  type="date" 
                  className="glass-input" 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
              </div>
            </div>

            {/* Department */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label text-muted small fw-medium">Department</label>
              <select 
                className="glass-input" 
                style={{ paddingLeft: '1rem' }}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Bio-Technology</option>
              </select>
            </div>

            {/* Category */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label text-muted small fw-medium">Category</label>
              <select 
                className="glass-input" 
                style={{ paddingLeft: '1rem' }}
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Publications</option>
                <option>Patents</option>
                <option>Workshops</option>
                <option>Certifications</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label text-muted small fw-medium">Status</label>
              <select 
                className="glass-input" 
                style={{ paddingLeft: '1rem' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>All Verified</option>
                <option>Pending</option>
                <option>Rejected</option>
                <option>Draft</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <button 
              type="submit" 
              className="btn btn-primary text-white fs-7 py-2 px-4 d-flex align-items-center gap-1.5 rounded-3 shadow-sm"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  Generate Report
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline-primary fs-7 py-2 px-4 d-flex align-items-center gap-1.5 rounded-3"
              onClick={() => {
                if (!generatedData || generatedData.length === 0) {
                  alert("Please generate a report first.");
                  return;
                }
                exportToPDF({
                  title: `${department} - ${reportType} Report`,
                  data: generatedData,
                  headers: ['Student Name', 'Reg No.', 'Description', 'Points', 'Date'],
                  keys: ['name', 'code', 'desc', 'points', 'date'],
                  generatedBy: 'Dr. Sarah Jenkins' // TODO: Replace with actual faculty name
                });
              }}
            >
              <Download size={14} />
              Export PDF
            </button>

            <button 
              type="button" 
              className="btn btn-outline-success fs-7 py-2 px-4 d-flex align-items-center gap-1.5 rounded-3"
              style={{ color: '#10b981', borderColor: '#10b981' }}
              onClick={() => alert("Exporting report list to Excel Spreadsheet...")}
            >
              <Download size={14} />
              Export Excel
            </button>
          </div>
        </form>
      </div>

      {/* Preview Area */}
      <div className="glass-panel p-4 mb-2 min-vh-25 d-flex align-items-center justify-content-center">
        {!generatedData ? (
          <div className="text-center py-5 text-muted">
            <div className="logo-container bg-white border border-light-subtle d-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
              <Table size={20} className="text-muted" />
            </div>
            <h6 className="fw-bold text-dark mb-1">Ready to Visualize</h6>
            <p className="fs-8 text-muted px-4 leading-sm mb-0">
              Configure your parameters above and click "Generate Report" to see the data preview here.
            </p>
          </div>
        ) : (
          <div className="w-100 fade-in-slide">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-dark fs-7">Report Preview: {selectedCategory} ({reportType})</span>
              <span className="badge bg-primary-subtle text-primary fs-8">{generatedData.length} records</span>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Name</th>
                    <th>Reg No</th>
                    <th>Detail</th>
                    <th className="text-center">Points</th>
                    <th className="text-end">Verification Date</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedData.map((row) => (
                    <tr key={row.id}>
                      <td className="fw-semibold fs-7 py-3">{row.name}</td>
                      <td className="text-muted fs-7">{row.code}</td>
                      <td className="fs-7 text-dark-emphasis">{row.desc}</td>
                      <td className="text-center fw-bold text-primary fs-7">{row.points}</td>
                      <td className="text-end text-muted fs-7">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon helper
function SlidersIcon({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
