import React, { useState } from 'react';
import { 
  Code, Briefcase, ShieldAlert, BookOpen, Hammer, Activity, 
  Smile, Lightbulb, Compass, Search, Filter, Plus, Edit2, 
  Trash2, Globe 
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  color: string;
  iconName: 'Code' | 'Briefcase' | 'Shield' | 'Book' | 'Tools' | 'Sports' | 'Cultural' | 'Patent' | 'Project';
}

export const AchievementCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: '1', name: 'Hackathon', desc: '12 Active Achievements', color: '#2563eb', iconName: 'Code' },
    { id: '2', name: 'Internship', desc: '45 Industrial Partners', color: '#10b981', iconName: 'Briefcase' },
    { id: '3', name: 'Certification', desc: 'Cloud, Security, AI', color: '#f59e0b', iconName: 'Shield' },
    { id: '4', name: 'Research Paper', desc: 'IEEE, Scopus Journals', color: '#8b5cf6', iconName: 'Book' },
    { id: '5', name: 'Workshop', desc: 'Hands-on Learning', color: '#f97316', iconName: 'Tools' },
    { id: '6', name: 'Sports', desc: 'Inter-Institutional', color: '#ef4444', iconName: 'Sports' },
    { id: '7', name: 'Cultural', desc: 'Arts & Performances', color: '#ec4899', iconName: 'Cultural' },
    { id: '8', name: 'Patent', desc: 'IPR Filings', color: '#06b6d4', iconName: 'Patent' },
    { id: '9', name: 'Project', desc: 'Capstone & Minor Projects', color: '#6366f1', iconName: 'Project' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Add category states
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#2563eb');
  const [newIcon, setNewIcon] = useState<'Code' | 'Briefcase' | 'Shield' | 'Book' | 'Tools' | 'Sports' | 'Cultural' | 'Patent' | 'Project'>('Code');

  // Edit category inline states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const getIcon = (iconName: CategoryItem['iconName'], color: string) => {
    const style = { color };
    switch (iconName) {
      case 'Code':
        return <Code size={18} style={style} />;
      case 'Briefcase':
        return <Briefcase size={18} style={style} />;
      case 'Shield':
        return <ShieldAlert size={18} style={style} />;
      case 'Book':
        return <BookOpen size={18} style={style} />;
      case 'Tools':
        return <Hammer size={18} style={style} />;
      case 'Sports':
        return <Activity size={18} style={style} />;
      case 'Cultural':
        return <Smile size={18} style={style} />;
      case 'Patent':
        return <Lightbulb size={18} style={style} />;
      case 'Project':
        return <Compass size={18} style={style} />;
      default:
        return <Globe size={18} style={style} />;
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      alert('Category Name is required.');
      return;
    }
    const newCat: CategoryItem = {
      id: `${categories.length + 1}`,
      name: newName,
      desc: newDesc || 'Academic merit sub-division',
      color: newColor,
      iconName: newIcon
    };
    setCategories([...categories, newCat]);
    setShowAddModal(false);
    // Reset Form
    setNewName('');
    setNewDesc('');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the category "${name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEditClick = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.desc);
  };

  const handleSaveEdit = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editName, desc: editDesc } : c));
    setEditingId(null);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in-up text-start">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 text-primary">Achievement Categories</h4>
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Manage institutional classification for student and faculty recognitions.</span>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-glass-primary px-4 py-2.5 d-inline-flex align-items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="glass-panel p-3 mb-4">
        <div className="d-flex gap-2">
          <div className="position-relative flex-grow-1">
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
            />
            <Search size={14} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button className="btn btn-light p-2 rounded-3 border-0 d-flex align-items-center">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="row g-4 mb-4">
        {filteredCategories.map((cat) => {
          const isEditing = editingId === cat.id;
          return (
            <div 
              key={cat.id} 
              className="col-12 col-md-6 col-xl-4"
              onMouseEnter={() => setHoveredCardId(cat.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <div 
                className="glass-panel p-4 h-100 d-flex flex-column justify-content-between position-relative transition-all duration-300"
                style={{ 
                  borderWidth: isEditing ? '2px' : '1px',
                  borderColor: isEditing ? 'var(--primary-brand)' : 'var(--glass-border)'
                }}
              >
                <div>
                  {/* Top Icon Area */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div 
                      className="p-2.5 rounded d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: `${cat.color}12` }}
                    >
                      {getIcon(cat.iconName, cat.color)}
                    </div>

                    {/* Hover actions panel (matches the icons shown in your Cultural card!) */}
                    {hoveredCardId === cat.id && !isEditing && (
                      <div className="d-inline-flex gap-1.5 transition-all">
                        <button 
                          onClick={() => handleEditClick(cat)}
                          className="btn btn-sm btn-light p-1.5 rounded-2 d-flex align-items-center text-primary"
                          style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                          title="Edit Category"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="btn btn-sm btn-light p-1.5 rounded-2 d-flex align-items-center text-danger"
                          style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                          title="Delete Category"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Title and details */}
                  {isEditing ? (
                    <div className="mb-3 text-start">
                      <input 
                        type="text" 
                        className="glass-input py-1 px-3 mb-2"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ fontSize: '0.88rem' }}
                      />
                      <input 
                        type="text" 
                        className="glass-input py-1 px-3"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        style={{ fontSize: '0.78rem' }}
                      />
                    </div>
                  ) : (
                    <>
                      <h6 className="fw-bold text-primary mb-1" style={{ fontSize: '1rem' }}>{cat.name}</h6>
                      <div className="d-flex align-items-center gap-2 mb-0">
                        <span className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: cat.color }}></span>
                        <span className="text-secondary" style={{ fontSize: '0.78rem' }}>{cat.desc}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Edit inline buttons */}
                {isEditing && (
                  <div className="d-flex justify-content-end gap-2 border-top border-light-subtle pt-3 mt-3">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="btn btn-link text-secondary text-decoration-none p-0 fw-semibold"
                      style={{ fontSize: '0.78rem' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveEdit(cat.id)}
                      className="btn btn-primary btn-sm border-0 py-1.5 px-3 rounded-2 text-white fw-semibold"
                      style={{ fontSize: '0.78rem', backgroundColor: 'var(--primary-brand)' }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer statistics indicator */}
      <p className="text-center text-secondary mb-4" style={{ fontSize: '0.8rem' }}>
        Showing {filteredCategories.length} of 14 Achievement Categories
      </p>

      {/* Add Category Modal */}
      {showAddModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1000, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="glass-panel p-4 p-md-5 w-100" style={{ maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-primary">Log Achievement Category</h5>
              <button onClick={() => setShowAddModal(false)} className="btn-close" aria-label="Close"></button>
            </div>

            <form onSubmit={handleAddCategory} className="text-start">
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>CATEGORY NAME</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. Workshop or Cultural"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>SUBTEXT / DESCRIPTION</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '16px' }}
                  placeholder="e.g. 12 Active Achievements or Hands-on Learning"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>DOT COLOR Accent</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                  >
                    <option value="#2563eb">Blue</option>
                    <option value="#10b981">Green</option>
                    <option value="#f59e0b">Yellow</option>
                    <option value="#8b5cf6">Purple</option>
                    <option value="#f97316">Orange</option>
                    <option value="#ef4444">Red</option>
                    <option value="#ec4899">Pink</option>
                    <option value="#06b6d4">Cyan</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>ICON CHOICE</label>
                  <select 
                    className="form-select bg-light border-0 py-2" 
                    style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value as any)}
                  >
                    <option value="Code">Code Brackets</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="Shield">Shield check</option>
                    <option value="Book">Open Book</option>
                    <option value="Tools">Hammer / Wrench</option>
                    <option value="Sports">Soccer / Ball</option>
                    <option value="Cultural">Drama / Smile</option>
                    <option value="Patent">Lightbulb</option>
                    <option value="Project">Compass ruler</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-glass-outline">Cancel</button>
                <button type="submit" className="btn-glass-primary">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
