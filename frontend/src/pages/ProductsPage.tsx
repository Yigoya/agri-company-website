import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsApi } from '@/api/products';
import { formatPrice, getImageUrl } from '@/utils/format';
import PageHeader from '@/components/common/PageHeader';
import { ProductCardSkeleton } from '@/components/common/SkeletonCard';
import type { ProductListItem } from '@/types';

function ProductCard({ product }: { product: ProductListItem }) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.slug}`} className="card group block">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(primaryImage?.image_url)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.is_featured && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="p-5">
          {product.category && (
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-primary-700 font-semibold">{formatPrice(product.price, product.unit)}</span>
            <span className="text-sm text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
              View Details &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const currentPage = parseInt(searchParams.get('page') || '1');
  const categorySlug = searchParams.get('category') || '';

  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: productsApi.getCategories,
  });

  const selectedCategory = categories?.find((c) => c.slug === categorySlug);

  const { data, isLoading } = useQuery({
    queryKey: ['products', currentPage, selectedCategory?.id, search],
    queryFn: () =>
      productsApi.getProducts({
        page: currentPage,
        page_size: 12,
        category_id: selectedCategory?.id,
        search: search || undefined,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <>
      <PageHeader
        title="Our Products"
        subtitle="Discover our range of premium, sustainably-grown agricultural products."
        backgroundImage="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
      />

      <section className="py-12 md:py-16 bg-white">
        <div className="container-section">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-6">
                Search
              </button>
            </form>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categorySlug
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.total_pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  {Array.from({ length: data.total_pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', String(i + 1));
                        setSearchParams(params);
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
