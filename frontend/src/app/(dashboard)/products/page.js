'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Plus,
  Search,
  SlidersHorizontal,
  Box,
  AlertTriangle,
  RotateCcw,
  List,
  LayoutGrid,
  Eye,
  Edit2,
  Sliders,
  Trash2,
  ArrowUpDown,
  PackageOpen,
} from 'lucide-react';
import { productService } from '../../../services/productService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [selectedRows, setSelectedRows] = useState([]);

  const loadProducts = async () => {
    try {
      const list = await productService.getProducts();
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name || id}"?`)) {
      await productService.deleteProduct(id);
      await loadProducts();
      setSelectedRows((prev) => prev.filter((rId) => rId !== id));
    }
  };

  // Real-time KPI computations from live Supabase data
  const totalSkus = products.length;
  const totalInventoryValue = products.reduce((sum, p) => {
    const price = parseFloat(p.price) || 0;
    const stock = parseInt(p.stock) || 0;
    return sum + price * stock;
  }, 0);

  const lowStockCount = products.filter(
    (p) => p.statusType === 'low_stock' || (p.stock <= p.reorderPoint && p.stock > 0)
  ).length;

  const outOfStockCount = products.filter(
    (p) => p.statusType === 'out_of_stock' || p.stock === 0
  ).length;

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const nameMatch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const idMatch = (p.id || '').toLowerCase().includes(search.toLowerCase());
    const catMatch = (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesSearch = nameMatch || idMatch || catMatch;

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Extract unique categories from live Supabase records
  const availableCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rId) => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.4px',
                margin: 0,
              }}
            >
              Products Inventory Directory
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
              BLACK & WHITE CORE
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#71717a',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            Live Supabase database connection active. Real-time stock catalog & reorder controls.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/products/categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0d0d10',
              border: '1px solid #27272e',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#e4e4e7',
              fontSize: '12.5px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Categories</span>
          </Link>

          <Link
            href="/products/create"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #ffffff',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#000000',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 0 16px rgba(255, 255, 255, 0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={15} color="#000000" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
        }}
      >
        {/* Card 1: Total SKUs */}
        <div
          style={{
            background: '#0d0d11',
            border: '1px solid #1c1c22',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '110px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#71717a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              TOTAL SKUS
            </span>
            <Box size={16} color="#71717a" />
          </div>
          <div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
              }}
            >
              {totalSkus}
            </div>
            <div
              style={{
                fontSize: '11.5px',
                color: '#71717a',
                marginTop: '4px',
              }}
            >
              Live Supabase catalog records
            </div>
          </div>
        </div>

        {/* Card 2: Inventory Value */}
        <div
          style={{
            background: '#0d0d11',
            border: '1px solid #1c1c22',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '110px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#71717a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              INVENTORY VALUE
            </span>
            <span style={{ fontSize: '15px', color: '#71717a', fontWeight: 600 }}>$</span>
          </div>
          <div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
              }}
            >
              $
              {totalInventoryValue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div
              style={{
                fontSize: '11.5px',
                color: '#71717a',
                marginTop: '4px',
              }}
            >
              Total on-hand valuation
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Warnings */}
        <div
          style={{
            background: '#0d0d11',
            border: '1px solid #1c1c22',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '110px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#71717a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              LOW STOCK WARNINGS
            </span>
            <AlertTriangle size={15} color="#71717a" />
          </div>
          <div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
              }}
            >
              {lowStockCount}
            </div>
            <div
              style={{
                fontSize: '11.5px',
                color: '#71717a',
                marginTop: '4px',
              }}
            >
              Requires replenishment
            </div>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div
          style={{
            background: '#0d0d11',
            border: '1px solid #1c1c22',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '110px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#71717a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              OUT OF STOCK
            </span>
            <Boxes size={16} color="#71717a" />
          </div>
          <div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
              }}
            >
              {outOfStockCount}
            </div>
            <div
              style={{
                fontSize: '11.5px',
                color: '#71717a',
                marginTop: '4px',
              }}
            >
              Zero inventory count
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Control Panel ── */}
      <div
        style={{
          background: '#0d0d11',
          border: '1px solid #1c1c22',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717a',
              }}
            />
            <input
              type="text"
              placeholder="Filter by SKU, Product Name, or Barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#121216',
                border: '1px solid #24242c',
                borderRadius: '8px',
                padding: '9px 12px 9px 36px',
                color: '#f4f4f5',
                fontSize: '12.5px',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              background: '#121216',
              border: '1px solid #24242c',
              borderRadius: '8px',
              padding: '9px 14px',
              color: '#e4e4e7',
              fontSize: '12.5px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '160px',
            }}
          >
            <option value="All">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              background: '#121216',
              border: '1px solid #24242c',
              borderRadius: '8px',
              padding: '9px 14px',
              color: '#e4e4e7',
              fontSize: '12.5px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '160px',
            }}
          >
            <option value="All">All Stock Statuses</option>
            <option value="IN STOCK">In Stock</option>
            <option value="LOW STOCK">Low Stock</option>
            <option value="OUT OF STOCK">Out of Stock</option>
          </select>

          {/* View Toggle and Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                display: 'flex',
                background: '#121216',
                border: '1px solid #24242c',
                borderRadius: '8px',
                padding: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? '#ffffff' : 'transparent',
                  color: viewMode === 'list' ? '#000000' : '#71717a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? '#000000' : '#71717a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LayoutGrid size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
                loadProducts();
              }}
              title="Refresh Products from Supabase"
              style={{
                background: '#121216',
                border: '1px solid #24242c',
                borderRadius: '8px',
                padding: '8px 10px',
                color: '#71717a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Products Table / Empty State ── */}
      <div
        style={{
          background: '#0d0d11',
          border: '1px solid #1c1c22',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                background: '#141418',
                border: '1px solid #24242c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#71717a',
              }}
            >
              <PackageOpen size={26} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px',
                }}
              >
                {products.length === 0
                  ? 'No Products in Supabase'
                  : 'No Products Match Filters'}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#71717a',
                  maxWidth: '380px',
                  margin: '0 auto',
                }}
              >
                {products.length === 0
                  ? 'Start by creating your first real SKU product to track inventory, pricing, and reorder points in Supabase.'
                  : 'Try clearing your search or status filters to see available inventory items.'}
              </p>
            </div>
            {products.length === 0 && (
              <Link
                href="/products/create"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '10px',
                  padding: '9px 18px',
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Plus size={15} color="#000000" />
                <span>Add Your First Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '12.5px',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #1c1c22',
                    background: '#09090c',
                    color: '#71717a',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '14px 16px', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={toggleSelectAll}
                      style={{
                        cursor: 'pointer',
                        accentColor: '#ffffff',
                      }}
                    />
                  </th>
                  <th style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>SKU / ITEM</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px' }}>CATEGORY</th>
                  <th style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>STOCK LEVEL</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>PRICE ($)</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ padding: '14px 16px' }}>WAREHOUSE</th>
                  <th style={{ padding: '14px 16px' }}>STATUS</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p, idx) => {
                  const isSelected = selectedRows.includes(p.id);
                  const maxVal = p.maxStock || Math.max(p.stock * 2, 100);
                  const stockPercent = Math.min(
                    100,
                    Math.round((p.stock / maxVal) * 100)
                  );

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom:
                          idx < filteredProducts.length - 1
                            ? '1px solid #16161c'
                            : 'none',
                        background: isSelected ? '#121217' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#111115';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '16px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(p.id)}
                          style={{
                            cursor: 'pointer',
                            accentColor: '#ffffff',
                          }}
                        />
                      </td>

                      {/* SKU / ITEM */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: '#16161b',
                              border: '1px solid #24242c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#71717a',
                              flexShrink: 0,
                            }}
                          >
                            <Box size={18} />
                          </div>

                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: '#ffffff',
                                fontSize: '13px',
                                lineHeight: 1.3,
                              }}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#71717a',
                                fontFamily: 'monospace',
                                marginTop: '3px',
                              }}
                            >
                              {p.sku || p.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '16px', color: '#d4d4d8' }}>
                        {p.category}
                      </td>

                      {/* Stock Level + Progress Bar */}
                      <td style={{ padding: '16px', minWidth: '140px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '13px' }}>
                            {p.stock}
                          </span>
                          <span style={{ color: '#52525b', fontSize: '11px' }}>
                            / {maxVal}
                          </span>
                        </div>
                        <div
                          style={{
                            width: '110px',
                            height: '4px',
                            background: '#222228',
                            borderRadius: '2px',
                            marginTop: '6px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${stockPercent}%`,
                              height: '100%',
                              background:
                                p.statusType === 'out_of_stock'
                                  ? '#ef4444'
                                  : p.statusType === 'low_stock'
                                  ? '#eab308'
                                  : '#ffffff',
                              borderRadius: '2px',
                            }}
                          />
                        </div>
                      </td>

                      {/* Price */}
                      <td
                        style={{
                          padding: '16px',
                          fontWeight: 700,
                          color: '#ffffff',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                        }}
                      >
                        ${p.price}
                      </td>

                      {/* Warehouse */}
                      <td style={{ padding: '16px', color: '#a1a1aa', fontSize: '12px' }}>
                        {p.warehouse}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            background:
                              p.statusType === 'in_stock'
                                ? '#141418'
                                : p.statusType === 'low_stock'
                                ? 'rgba(234, 179, 8, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            color:
                              p.statusType === 'in_stock'
                                ? '#ffffff'
                                : p.statusType === 'low_stock'
                                ? '#eab308'
                                : '#ef4444',
                            border:
                              p.statusType === 'in_stock'
                                ? '1px solid #2e2e36'
                                : p.statusType === 'low_stock'
                                ? '1px solid rgba(234, 179, 8, 0.3)'
                                : '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Action Icons */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <Link
                            href={`/products/${p.id}`}
                            title="View"
                            style={{
                              color: '#71717a',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
                          >
                            <Eye size={15} />
                          </Link>

                          <button
                            type="button"
                            title="Delete"
                            onClick={() => handleDelete(p.id, p.name)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#71717a',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717a')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
