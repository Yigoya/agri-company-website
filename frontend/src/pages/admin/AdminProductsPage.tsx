import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productsApi } from '@/api/products';
import { formatPrice, slugify } from '@/utils/format';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { ProductCategory } from '@/types';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: '', slug: '', short_description: '', description: '',
    price: '', unit: '', origin: '', harvest_season: '',
    packaging_info: '', specifications: '', is_featured: false,
    category_id: '' as string | number,
  });

  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: productsApi.getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => productsApi.getAllProducts({ page, page_size: 10, search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created');
      resetForm();
    },
    onError: () => toast.error('Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
      resetForm();
    },
    onError: () => toast.error('Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const resetForm = () => {
    setForm({ name: '', slug: '', short_description: '', description: '', price: '', unit: '', origin: '', harvest_season: '', packaging_info: '', specifications: '', is_featured: false, category_id: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Record<string, unknown>) => {
    setForm({
      name: product.name as string || '',
      slug: product.slug as string || '',
      short_description: product.short_description as string || '',
      description: product.description as string || '',
      price: product.price != null ? String(product.price) : '',
      unit: product.unit as string || '',
      origin: product.origin as string || '',
      harvest_season: product.harvest_season as string || '',
      packaging_info: product.packaging_info as string || '',
      specifications: product.specifications as string || '',
      is_featured: product.is_featured as boolean || false,
      category_id: product.category_id as number || '',
    });
    setEditingId(product.id as number);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description || undefined,
      description: form.description || undefined,
      price: form.price ? parseFloat(form.price) : undefined,
      unit: form.unit || undefined,
      origin: form.origin || undefined,
      harvest_season: form.harvest_season || undefined,
      packaging_info: form.packaging_info || undefined,
      specifications: form.specifications || undefined,
      is_featured: form.is_featured,
      category_id: form.category_id ? Number(form.category_id) : undefined,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);

  const uploadMutation = useMutation({
    mutationFn: ({ productId, file }: { productId: number; file: File }) =>
      productsApi.uploadProductImage(productId, file, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Image uploaded');
      setImageFile(null);
      setUploadingFor(null);
    },
    onError: () => toast.error('Failed to upload image'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm">
          Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                  <option value="">Select category</option>
                  {categories?.map((c: ProductCategory) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field" placeholder="per kg, per bag..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Season</label>
                <input value={form.harvest_season} onChange={(e) => setForm({ ...form, harvest_season: e.target.value })} className="input-field" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (one per line, format: Key: Value)</label>
              <textarea rows={3} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Info</label>
              <textarea rows={2} value={form.packaging_info} onChange={(e) => setForm({ ...form, packaging_info: e.target.value })} className="input-field resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Update' : 'Create'} Product
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="input-field max-w-sm"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Featured</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{formatPrice(product.price, product.unit)}</td>
                    <td className="px-4 py-3">{product.is_featured ? <span className="text-primary-600 font-medium">Yes</span> : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {uploadingFor === product.id ? (
                          <div className="flex items-center gap-2">
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-xs" />
                            <button
                              onClick={() => imageFile && uploadMutation.mutate({ productId: product.id, file: imageFile })}
                              disabled={!imageFile || uploadMutation.isPending}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                            >
                              Upload
                            </button>
                            <button onClick={() => { setUploadingFor(null); setImageFile(null); }} className="text-xs text-gray-500">Cancel</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setUploadingFor(product.id)} className="text-xs text-purple-600 hover:text-purple-700 font-medium">Image</button>
                            <button onClick={() => handleEdit(product as unknown as Record<string, unknown>)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                            <button
                              onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product.id); }}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && data.total_pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {Array.from({ length: data.total_pages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded text-xs font-medium ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
