import React, { useState } from 'react';
import { 
  FileText, Shield, TrendingUp, BarChart3, Database, Users, 
  Settings, Lock, Globe, FileSpreadsheet, Play, Calendar, Wrench, Clock 
} from 'lucide-react';

interface ReportCard {
  id: string;
  title: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}

export const Reports: React.FC = () => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const reports: ReportCard[] = [
    { id: 'student', title: 'Student Achievements', tag: 'ACADEMIC', desc: 'Comprehensive breakdown of student achievement counts, reward points earned, and category-wise distributions.', icon: <FileText size={20} className="text-primary" /> },
    { id: 'faculty', title: 'Faculty Mentorship', tag: 'FACULTY', desc: 'Track faculty involvement in student success, achievement validations, and departmental mentorship indices.', icon: <Users size={20} className="text-info" /> },
    { id: 'dept', title: 'Departmental Ranking', tag: 'INSTITUTIONAL', desc: 'Aggregate achievement metrics by department to identify high-performing units and allocation of reward resources.', icon: <TrendingUp size={20} className="text-warning" /> },
    { id: 'category', title: 'Category Distribution', tag: 'CATEGORIES', desc: 'Deep dive into which types of achievements (Sports, Cultural, Technical) are most prevalent across the portal.', icon: <BarChart3 size={20} className="text-danger" /> },
    { id: 'ledger', title: 'Reward Point Ledger', tag: 'FINANCIAL', desc: 'Audit log of all reward points allocated, redeemed, and pending approval. Essential for institutional budgeting.', icon: <Database size={20} className="text-success" /> },
    { id: 'engagement', title: 'Portal Engagement', tag: 'SYSTEM', desc: 'Analysis of user login frequency, submission lead times, and overall platform adoption rates.', icon: <Settings size={20} className="text-secondary" /> }
  ];

  const handleGenerate = (id: string, title: string) => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
      alert(`Report "${title}" generated and compiled successfully! Download starting...`);
    }, 1500);
  };

  return (
    <div className="fade-in-up text-start">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">Institutional Analytics</h4>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Generate detailed reports across all institutional segments.</span>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            onClick={() => alert('Viewing recent audit logs...')}
            className="btn btn-light py-2 px-3 border-0 d-inline-flex align-items-center gap-2 fw-semibold text-secondary" 
            style={{ borderRadius: '10px', fontSize: '0.85rem' }}
          >
            <Clock size={15} />
            <span>Recent Runs</span>
          </button>
          <button 
            onClick={() => alert('Schedule report configurations.')}
            className="btn-glass-primary px-4 py-2.5 d-inline-flex align-items-center gap-2"
          >
            <Calendar size={15} />
            <span>Schedule Report</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="row g-4 mb-4">
        {reports.map((report) => (
          <div key={report.id} className="col-12 col-md-6 col-xl-4">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                {/* Header tag and icon */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="p-2.5 rounded bg-light d-flex align-items-center justify-content-center">
                    {report.icon}
                  </div>
                  <span 
                    className="badge border-0 rounded-pill font-bold" 
                    style={{ 
                      fontSize: '0.68rem',
                      padding: '4px 10px',
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {report.tag}
                  </span>
                </div>

                <h6 className="fw-bold text-primary mb-2" style={{ fontSize: '0.95rem' }}>{report.title}</h6>
                <p className="text-secondary mb-4" style={{ fontSize: '0.78rem', lineHeight: '1.5' }}>{report.desc}</p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 border-top pt-3 border-light-subtle align-items-center">
                <button 
                  onClick={() => handleGenerate(report.id, report.title)}
                  disabled={generatingId !== null}
                  className="btn btn-primary btn-sm flex-grow-1 border-0 py-2 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold"
                  style={{ backgroundColor: 'var(--primary-brand)', borderRadius: '8px', fontSize: '0.78rem' }}
                >
                  {generatingId === report.id ? (
                    <span>Compiling Report...</span>
                  ) : (
                    <>
                      <Play size={12} fill="#ffffff" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => alert(`Exporting "${report.title}" as PDF...`)}
                  className="btn btn-sm btn-light p-2"
                  style={{ borderRadius: '8px' }}
                  title="PDF format"
                >
                  <FileText size={15} className="text-danger" />
                </button>
                <button 
                  onClick={() => alert(`Exporting "${report.title}" as Excel spreadsheet...`)}
                  className="btn btn-sm btn-light p-2"
                  style={{ borderRadius: '8px' }}
                  title="Excel format"
                >
                  <FileSpreadsheet size={15} className="text-success" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tailored Report Custom query builder (Bottom Card) */}
      <div className="glass-panel p-4 mb-4 text-start">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-8">
            <div className="d-flex align-items-start gap-3">
              <div 
                className="p-3.5 rounded-circle text-white d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'var(--primary-brand)' }}
              >
                <Wrench size={22} />
              </div>
              <div>
                <h6 className="fw-bold mb-1 text-primary">Need a tailored report?</h6>
                <p className="text-secondary mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                  Access our advanced Query Builder to select specific parameters, filters, and output visualizations for custom institutional requirements.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button 
              onClick={() => alert('Initializing Report Query Builder...')}
              className="btn btn-primary px-4 py-2.5 border-0 rounded-3 text-white fw-bold"
              style={{ backgroundColor: 'var(--primary-brand)', fontSize: '0.82rem' }}
            >
              Launch Report Builder
            </button>
          </div>
        </div>

        {/* Footer badges */}
        <div className="d-flex flex-wrap gap-4 border-top border-light-subtle pt-3 mt-3 justify-content-center justify-content-md-start" style={{ fontSize: '0.72rem' }}>
          <div className="d-flex align-items-center gap-1.5 text-secondary">
            <Globe size={13} className="text-primary" />
            <span>Real-time Data</span>
          </div>
          <div className="d-flex align-items-center gap-1.5 text-secondary">
            <Lock size={13} className="text-success" />
            <span>Secured SSL Encryption</span>
          </div>
          <div className="d-flex align-items-center gap-1.5 text-secondary">
            <Shield size={13} className="text-warning" />
            <span>ISO Certified</span>
          </div>
        </div>
      </div>

    </div>
  );
};
