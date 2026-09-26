'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Boxes,
  SlidersHorizontal,
  CheckCircle,
  FolderOpen,
  Warehouse,
  Thermometer,
  Package,
} from 'lucide-react';
import { productService } from '../../../../services/productService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Active Category States
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Extended Form State with More Category Fields
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    zone: 'Zone A - General Storage',
    unitOfMeasure: 'Units',
    condition: 'Standard Ambient (15-25°C)',
    description: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Real Categories & Products from Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load categories/products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Category Detail Modal
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);

    // Extract embedded details from description if present
    let desc = cat.description || '';
    let zone = 'Zone A - General Storage';
    let unitOfMeasure = 'Units';
    let condition = 'Standard Ambient (15-25°C)';

    setFormData({
      name: cat.name || '',
      code: cat.code || '',
      zone,
      unitOfMeasure,
      condition,
      description: desc,
    });
    setIsEditMode(false);
    setFormError('');
  };

  // Handle Create Category Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Category Name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDesc = `Zone: ${formData.zone} | Unit: ${formData.unitOfMeasure} | Handling: ${formData.condition}\n${formData.description.trim()}`;

      await productService.createCategory({
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: fullDesc.trim(),
      });
      setShowCreateModal(false);
      setFormData({
        name: '',
        code: '',
        zone: 'Zone A - General Storage',
        unitOfMeasure: 'Units',
        condition: 'Standard Ambient (15-25°C)',
        description: '',
      });
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Category Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedCategory) return;
    if (!formData.name.trim()) {
      setFormError('Category Name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDesc = `Zone: ${formData.zone} | Unit: ${formData.unitOfMeasure} | Handling: ${formData.condition}\n${formData.description.trim()}`;

      const updated = await productService.updateCategory(selectedCategory.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: fullDesc.trim(),
      });
      setSelectedCategory((prev) => ({
        ...prev,
        ...updated,
        name: formData.name,
        code: formData.code,
        description: fullDesc,
      }));
      setIsEditMode(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to update category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      await productService.deleteCategory(id);
      setSelectedCategory(null);
      await loadData();
    }
  };

  // Get products for the selected category
  const categoryProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.category === selectedCategory.name ||
          p.category_id === selectedCategory.id
      )
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/products"
            style={{
              color: '#71717a',
              fontSize: '13.5px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Products
          </Link>
          <span style={{ color: '#3f3f46' }}>/</span>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            Categories
          </h1>
          <span
            style={{
              background: '#121216',
              border: '1px solid #3f3f46',
              color: '#e4e4e7',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '20px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            SUPABASE LIVE
          </span>
        </div>

        {/* New Category Button */}
        <button
          type="button"
          onClick={() => {
            setFormData({
              name: '',
              code: '',
              zone: 'Zone A - General Storage',
              unitOfMeasure: 'Units',
              condition: 'Standard Ambient (15-25°C)',
              description: '',
            });
            setFormError('');
            setShowCreateModal(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '8px 18px',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.15)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={15} color="#000000" />
          <span>New Category</span>
        </button>
      </div>

      {/* ── Categories Grid ── */}
      {isLoading ? (
        <div
          style={{
            padding: '60px',
            textAlign: 'center',
            color: '#71717a',
            fontSize: '14px',
          }}
        >
          Loading categories from Supabase...
        </div>
      ) : categories.length === 0 ? (
        <div
          style={{
            background: '#0d0d11',
            border: '1px solid #1c1c22',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#141418',
              border: '1px solid #24242c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717a',
            }}
          >
            <FolderOpen size={24} />
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: 0 }}>
            No Categories Found
          </h3>
          <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>
            Create your first category to organize your product inventory catalog in Supabase.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              style={{
                background: '#0d0d11',
                border: '1px solid #1c1c22',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3f3f46';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = '#111116';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1c1c22';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#0d0d11';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#16161b',
                      border: '1px solid #24242c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a1a1aa',
                    }}
                  >
                    <Tag size={16} />
                  </div>
                  {cat.code && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#71717a',
                        fontFamily: 'monospace',
                        background: '#141418',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        border: '1px solid #24242c',
                      }}
                    >
                      {cat.code}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {cat.name}
                </div>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: '#71717a',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #16161c',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{cat.skus} SKUs</span>
                <span style={{ fontWeight: 600, color: '#e4e4e7' }}>
                  Total value {cat.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE NEW CATEGORY MODAL (WITH EXTENDED FIELDS) ── */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0d0d11',
              border: '1px solid #24242c',
              borderRadius: '14px',
              padding: '24px 28px',
              width: '100%',
              maxWidth: '520px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Add Category Specifications
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '12.5px',
                  fontWeight: 500,
                }}
              >
                {formError}
              </div>
            )}

            <form
              onSubmit={handleCreateSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Audio Equipment"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#121216',
                      border: '1px solid #24242c',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Category Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AUDI"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#121216',
                      border: '1px solid #24242c',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Rich Fields: Storage Zone & Default UOM */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Storage Zone
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#121216',
                      border: '1px solid #24242c',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Zone A - General Storage">Zone A - General Storage</option>
                    <option value="Zone B - Cleanroom & Microcontrollers">Zone B - Cleanroom</option>
                    <option value="Zone C - Heavy Parts & Metals">Zone C - Heavy Parts</option>
                    <option value="Zone D - Hazardous & Solvents">Zone D - Hazardous</option>
                    <option value="Cold Storage Vault">Cold Storage Vault</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Default Unit of Measure
                  </label>
                  <select
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#121216',
                      border: '1px solid #24242c',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Units">Units</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Sheets">Sheets</option>
                    <option value="Meters">Meters</option>
                    <option value="Kilograms">Kilograms</option>
                    <option value="Pallets">Pallets</option>
                  </select>
                </div>
              </div>

              {/* Rich Field: Handling & Storage Conditions */}
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#a1a1aa',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Handling & Condition Controls
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#121216',
                    border: '1px solid #24242c',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  <option value="Standard Ambient (15-25°C)">Standard Ambient (15-25°C)</option>
                  <option value="Refrigerated (2-8°C)">Refrigerated (2-8°C)</option>
                  <option value="Frozen Vault (-20°C)">Frozen Vault (-20°C)</option>
                  <option value="Electrostatic Sensitive (ESD)">Electrostatic Sensitive (ESD)</option>
                  <option value="Flammable / Chemical Safe">Flammable / Chemical Safe</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#a1a1aa',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Category Notes & Description
                </label>
                <textarea
                  placeholder="Additional specifications or handling notes..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#121216',
                    border: '1px solid #24242c',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    height: '70px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#121216',
                    border: '1px solid #24242c',
                    borderRadius: '8px',
                    color: '#d4d4d8',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 18px',
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY DETAIL & EDIT MODAL (WITH EXTENDED FIELDS) ── */}
      {selectedCategory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0d0d11',
              border: '1px solid #24242c',
              borderRadius: '14px',
              padding: '28px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {selectedCategory.name}
                  </h2>
                  {selectedCategory.code && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#a1a1aa',
                        fontFamily: 'monospace',
                        background: '#16161c',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        border: '1px solid #24242c',
                      }}
                    >
                      {selectedCategory.code}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: '12.5px',
                    color: '#71717a',
                    marginTop: '4px',
                    margin: 0,
                  }}
                >
                  Supabase Category ID: {selectedCategory.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '12.5px',
                  fontWeight: 500,
                }}
              >
                {formError}
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: '#121216',
                border: '1px solid #1f1f26',
                borderRadius: '10px',
                padding: '14px 18px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>
                  Total SKUs
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {selectedCategory.skus}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>
                  Total Inventory Valuation
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {selectedCategory.value}
                </span>
              </div>
            </div>

            {/* EDIT MODE vs VIEW MODE */}
            {isEditMode ? (
              <form
                onSubmit={handleEditSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#a1a1aa',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#141418',
                        border: '1px solid #27272e',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#a1a1aa',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Category Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#141418',
                        border: '1px solid #27272e',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#a1a1aa',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Storage Zone
                    </label>
                    <select
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#141418',
                        border: '1px solid #27272e',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    >
                      <option value="Zone A - General Storage">Zone A - General Storage</option>
                      <option value="Zone B - Cleanroom & Microcontrollers">Zone B - Cleanroom</option>
                      <option value="Zone C - Heavy Parts & Metals">Zone C - Heavy Parts</option>
                      <option value="Zone D - Hazardous & Solvents">Zone D - Hazardous</option>
                      <option value="Cold Storage Vault">Cold Storage Vault</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#a1a1aa',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Default Unit of Measure
                    </label>
                    <select
                      value={formData.unitOfMeasure}
                      onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#141418',
                        border: '1px solid #27272e',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    >
                      <option value="Units">Units</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Sheets">Sheets</option>
                      <option value="Meters">Meters</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="Pallets">Pallets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Handling & Condition Controls
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#141418',
                      border: '1px solid #27272e',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="Standard Ambient (15-25°C)">Standard Ambient (15-25°C)</option>
                    <option value="Refrigerated (2-8°C)">Refrigerated (2-8°C)</option>
                    <option value="Frozen Vault (-20°C)">Frozen Vault (-20°C)</option>
                    <option value="Electrostatic Sensitive (ESD)">Electrostatic Sensitive (ESD)</option>
                    <option value="Flammable / Chemical Safe">Flammable / Chemical Safe</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#a1a1aa',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#141418',
                      border: '1px solid #27272e',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      height: '70px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#121216',
                      border: '1px solid #24242c',
                      borderRadius: '8px',
                      color: '#d4d4d8',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Save size={14} color="#000000" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Description Text */}
                <div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#71717a',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    Description & Specifications
                  </span>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#d4d4d8',
                      margin: 0,
                      lineHeight: 1.4,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {selectedCategory.description ||
                      'No detailed description set for this category.'}
                  </p>
                </div>

                {/* Associated Products List */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#a1a1aa',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Products in this Category ({categoryProducts.length})
                    </span>
                  </div>

                  {categoryProducts.length === 0 ? (
                    <div
                      style={{
                        padding: '16px',
                        background: '#121216',
                        border: '1px solid #1f1f26',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        color: '#71717a',
                        textAlign: 'center',
                      }}
                    >
                      No active products assigned to this category yet.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maxHeight: '180px',
                        overflowY: 'auto',
                      }}
                    >
                      {categoryProducts.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: '#121216',
                            border: '1px solid #1f1f26',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, color: '#ffffff' }}>
                              {p.name}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#71717a',
                                fontFamily: 'monospace',
                                marginLeft: '8px',
                              }}
                            >
                              {p.id}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#a1a1aa' }}>Stock: {p.stock}</span>
                            <span style={{ fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                              ${p.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid #1c1c22',
                    marginTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(selectedCategory.id, selectedCategory.name)
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Category</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditMode(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      background: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <Edit2 size={14} color="#000000" />
                    <span>Edit Category</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
