import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryApi } from '@/api/gallery';
import { getImageUrl } from '@/utils/format';
import PageHeader from '@/components/common/PageHeader';
import { GallerySkeleton } from '@/components/common/SkeletonCard';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['gallery-categories'],
    queryFn: galleryApi.getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', selectedCategory],
    queryFn: () => galleryApi.getImages({ page_size: 50, category: selectedCategory || undefined }),
  });

  return (
    <>
      <PageHeader
        title="Our Gallery"
        subtitle="A visual journey through our farms, facilities, and harvest process."
        backgroundImage="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1920&q=80"
      />

      <section className="py-12 md:py-16 bg-white">
        <div className="container-section">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Photos
            </button>
            {categories?.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <GallerySkeleton key={i} />)}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-500">Gallery images will appear here once uploaded.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {data?.items.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => setLightboxImage(getImageUrl(image.image_url))}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={getImageUrl(image.image_url)}
                      alt={image.title || 'Gallery image'}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                      <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {image.title && <p className="text-white font-semibold">{image.title}</p>}
                        {image.description && <p className="text-white/80 text-sm">{image.description}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightboxImage}
              alt="Gallery preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
