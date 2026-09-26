'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { productService } from '../../../../services/productService';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: '#121216',
  border: '1px solid #24242c',
  borderRadius: '8px',
  color: '#f4f4f5',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};

const labelStyle = {
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#a1a1aa',
  display: 'block',
  marginBottom: '6px',
};

export default function CreateProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Audio',
    unitPrice: '',
    initialStock: '',
    reorderPoint: '',
    safetyStock: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (!formData.sku.trim()) {
      setError('SKU is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await productService.createProduct(formData);
      if (saved) {
        router.push('/products');
      } else {
        setError('Failed to save product. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: 780,
      }}
    >
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link
          href="/products"
          style={{
            color: '#71717a',
            fontSize: '13px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Products
        </Link>
        <span style={{ color: '#3f3f46' }}>/</span>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
          }}
        >
          Add Product
        </h1>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#0d0d11',
          border: '1px solid #1c1c22',
          borderRadius: '12px',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {error && (
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
            {error}
          </div>
        )}

        {/* Row 1: Name and SKU */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. airbuds"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>SKU *</label>
            <input
              type="text"
              name="sku"
              placeholder="e.g. SKU-1"
              value={formData.sku}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Row 2: Category and Unit Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Audio">Audio</option>
              <option value="Electronics & Sensors">Electronics & Sensors</option>
              <option value="Raw Materials & Alloys">Raw Materials & Alloys</option>
              <option value="Robotics & Motion">Robotics & Motion</option>
              <option value="Warehouse Tools & Gear">Warehouse Tools & Gear</option>
              <option value="Heavy Machinery & Motors">Heavy Machinery & Motors</option>
              <option value="Packaging & Logistics">Packaging & Logistics</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Unit Price</label>
            <input
              type="number"
              name="unitPrice"
              step="0.01"
              placeholder="0.00"
              value={formData.unitPrice}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 3: Stock Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Initial Stock</label>
            <input
              type="number"
              name="initialStock"
              placeholder="0"
              value={formData.initialStock}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Reorder Point</label>
            <input
              type="number"
              name="reorderPoint"
              placeholder="0"
              value={formData.reorderPoint}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Safety Stock</label>
            <input
              type="number"
              name="safetyStock"
              placeholder="0"
              value={formData.safetyStock}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Row 4: Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            placeholder="Product description…"
            value={formData.description}
            onChange={handleChange}
            style={{ ...inputStyle, height: '90px', resize: 'vertical' }}
          />
        </div>

        {/* Actions Row */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid #1c1c22',
            marginTop: '8px',
          }}
        >
          <Link
            href="/products"
            style={{
              padding: '9px 18px',
              background: '#121216',
              border: '1px solid #24242c',
              borderRadius: '8px',
              color: '#d4d4d8',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 20px',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 16px rgba(255, 255, 255, 0.15)',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <Save size={15} color="#000000" />
            <span>{isSubmitting ? 'Saving to Supabase...' : 'Save Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
