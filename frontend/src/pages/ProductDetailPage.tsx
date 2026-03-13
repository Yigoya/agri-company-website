import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsApi } from '@/api/products';
import { formatPrice, getImageUrl } from '@/utils/format';
import { DetailSkeleton } from '@/components/common/SkeletonCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getProduct(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
    : [{ id: 0, image_url: '', alt_text: product.name, is_primary: true, sort_order: 0 }];

  const specs = product.specifications?.split('\n').filter(Boolean) || [];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-section py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600">Products</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={getImageUrl(images[selectedImage]?.image_url)}
                  alt={images[selectedImage]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={getImageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {product.category && (
                <Link
                  to={`/products?category=${product.category.slug}`}
                  className="text-sm font-medium text-primary-600 uppercase tracking-wider hover:text-primary-700"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-primary-700 mb-6">
                {formatPrice(product.price, product.unit)}
              </p>

              {product.description && (
                <div className="prose prose-gray max-w-none mb-8">
                  {product.description.split('\n\n').map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed mb-3">{p}</p>
                  ))}
                </div>
              )}

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.origin && (
                  <div className="p-4 bg-sage-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Origin</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{product.origin}</p>
                  </div>
                )}
                {product.harvest_season && (
                  <div className="p-4 bg-sage-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Harvest Season</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{product.harvest_season}</p>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {specs.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="bg-gray-50 rounded-xl p-5">
                    {specs.map((spec, i) => {
                      const [key, ...valueParts] = spec.split(':');
                      const value = valueParts.join(':').trim();
                      return (
                        <div key={i} className={`flex justify-between py-2.5 ${i < specs.length - 1 ? 'border-b border-gray-200' : ''}`}>
                          <span className="text-sm text-gray-600">{key.trim()}</span>
                          <span className="text-sm font-medium text-gray-900">{value || key}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Packaging */}
              {product.packaging_info && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Packaging</h3>
                  <p className="text-gray-600">{product.packaging_info}</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/contact?product=${product.name}`}
                  className="btn-primary text-base px-8 py-4"
                >
                  Request a Quote
                </Link>
                <Link to="/contact" className="btn-outline text-base px-8 py-4">
                  Ask a Question
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
