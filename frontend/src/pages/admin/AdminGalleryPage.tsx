import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { galleryApi } from '@/api/gallery';
import { getImageUrl } from '@/utils/format';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: () => galleryApi.getImages({ page_size: 50 }),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: { title?: string; description?: string; category?: string } }) =>
      galleryApi.uploadImage(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Image uploaded');
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('');
    },
    onError: () => toast.error('Failed to upload image'),
  });

  const deleteMutation = useMutation({
    mutationFn: galleryApi.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Image deleted');
    },
    onError: () => toast.error('Failed to delete image'),
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    uploadMutation.mutate({
      file,
      metadata: {
        title: title || undefined,
        description: description || undefined,
        category: category || undefined,
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Gallery</h1>

      {/* Upload form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Image title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="e.g., Farm, Harvest, Facilities" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" placeholder="Brief description" />
          </div>
          <button type="submit" className="btn-primary text-sm" disabled={!file || uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Gallery grid */}
      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : data?.items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No gallery images yet. Upload your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.items.map((image) => (
            <div key={image.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
              <img
                src={getImageUrl(image.image_url)}
                alt={image.title || 'Gallery image'}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <button
                  onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(image.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                  <p className="text-white text-xs truncate">{image.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
