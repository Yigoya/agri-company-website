import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { blogApi } from '@/api/blog';
import { formatDate, slugify } from '@/utils/format';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    cover_image: '', author: '', tags: '', is_published: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog', page],
    queryFn: () => blogApi.getAllPosts({ page, page_size: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => blogApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Post created');
      resetForm();
    },
    onError: () => toast.error('Failed to create post'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => blogApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Post updated');
      resetForm();
    },
    onError: () => toast.error('Failed to update post'),
  });

  const deleteMutation = useMutation({
    mutationFn: blogApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const resetForm = () => {
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_image: '', author: '', tags: '', is_published: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (post: Record<string, unknown>) => {
    setForm({
      title: post.title as string || '',
      slug: post.slug as string || '',
      excerpt: post.excerpt as string || '',
      content: post.content as string || '',
      cover_image: post.cover_image as string || '',
      author: post.author as string || '',
      tags: post.tags as string || '',
      is_published: post.is_published as boolean || false,
    });
    setEditingId(post.id as number);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || undefined,
      content: form.content,
      cover_image: form.cover_image || undefined,
      author: form.author || undefined,
      tags: form.tags || undefined,
      is_published: form.is_published,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Blog Posts</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm">
          New Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Post' : 'New Post'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content * (Markdown supported)</label>
              <textarea rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field resize-none font-mono text-sm" required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary text-sm" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Update' : 'Create'} Post
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Author</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.items.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{post.title}</td>
                    <td className="px-4 py-3 text-gray-500">{post.author || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(post.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(post as unknown as Record<string, unknown>)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                        <button
                          onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(post.id); }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
