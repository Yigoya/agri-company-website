import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { blogApi } from '@/api/blog';
import { formatDate, getImageUrl } from '@/utils/format';
import PageHeader from '@/components/common/PageHeader';
import { BlogCardSkeleton } from '@/components/common/SkeletonCard';
import type { BlogPostListItem } from '@/types';

function BlogCard({ post }: { post: BlogPostListItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/blog/${post.slug}`} className="card group block">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(post.cover_image)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {post.tags && (
              <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                {post.tags.split(',')[0]}
              </span>
            )}
            <span className="text-xs text-gray-400">{formatDate(post.published_at || post.created_at)}</span>
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900 group-hover:text-primary-700 transition-colors mb-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            {post.author && (
              <span className="text-sm text-gray-600">By {post.author}</span>
            )}
            <span className="text-sm text-primary-600 font-medium ml-auto group-hover:translate-x-1 transition-transform">
              Read More &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts', currentPage, search],
    queryFn: () => blogApi.getPosts({ page: currentPage, page_size: 9, search: search || undefined }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <>
      <PageHeader
        title="Our Blog"
        subtitle="Insights, stories, and knowledge from the world of sustainable agriculture."
        backgroundImage="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80"
      />

      <section className="py-12 md:py-16 bg-white">
        <div className="container-section">
          <form onSubmit={handleSearch} className="max-w-md mb-10 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">Check back soon for new content.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.items.map((post) => <BlogCard key={post.id} post={post} />)}
              </div>

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
