'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Package,
  Search,
  Layers
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';

export default function CategoryManager({ isOpen = true, onClose }) {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useProductStore();

  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [editData, setEditData] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await addCategory(formData);
    setFormData({ name: '', code: '', description: '' });
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditData({ name: cat.name, code: cat.code, description: cat.description || '' });
  };

  const handleUpdate = async (id) => {
    await updateCategory(id, editData);
    setEditingId(null);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bw-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-bold">
            <FolderTree className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Product Categories Manager
            </h3>
            <p className="text-xs text-zinc-400">
              Organize inventory items into logical taxonomy codes and groups.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#27272a] hover:bg-[#18181b] text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Grid: Create Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4 h-fit">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-white" /> Add New Category
          </h4>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Precision Tools"
                className="bw-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Category Code (4 Chars)
              </label>
              <input
                type="text"
                maxLength="6"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. TOOL"
                className="bw-input font-mono text-xs uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief notes on items contained within..."
                className="bw-input text-xs resize-none"
              />
            </div>

            <button type="submit" className="bw-button-primary w-full text-xs">
              <Plus className="w-4 h-4" /> Save Category
            </button>
          </form>
        </div>

        {/* Existing Categories Table/List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search categories by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bw-input pl-9 text-xs"
              />
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-[#18181b] border border-[#27272a] px-3 py-2 rounded-lg">
              {filteredCategories.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {filteredCategories.map((cat) => {
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="bg-[#121215] border border-[#27272a] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-zinc-500 transition-colors"
                >
                  {isEditing ? (
                    <div className="flex-1 space-y-2 w-full">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="bw-input text-xs"
                        />
                        <input
                          type="text"
                          value={editData.code}
                          onChange={(e) => setEditData({ ...editData, code: e.target.value.toUpperCase() })}
                          className="bw-input font-mono text-xs uppercase"
                        />
                      </div>
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="bw-input text-xs"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-white text-black px-2 py-0.5 rounded">
                          {cat.code || 'CAT'}
                        </span>
                        <h4 className="font-bold text-white text-base">{cat.name}</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[#27272a]">
                    {!isEditing && (
                      <span className="bw-badge bg-[#18181b] border border-zinc-700 text-zinc-300 font-mono">
                        <Package className="w-3 h-3 text-white" />
                        {cat.count ?? 0} Products
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            className="p-1.5 rounded bg-white text-black hover:bg-zinc-200"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded bg-[#18181b] text-zinc-400 hover:text-white"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#18181b]"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete category ${cat.name}?`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#18181b]"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
