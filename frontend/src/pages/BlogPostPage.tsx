import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { blogApi } from '@/api/blog';
import { formatDate, getImageUrl } from '@/utils/format';
import { DetailSkeleton } from '@/components/common/SkeletonCard';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogApi.getPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <DetailSkeleton />;

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const tags = post.tags?.split(',').map((t) => t.trim()).filter(Boolean) || [];

  return (
    <article className="bg-white">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={getImageUrl(post.cover_image)}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container-section">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4">
                {tags.length > 0 && (
                  <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                    {tags[0]}
                  </span>
                )}
                <span className="text-sm text-gray-200">{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white max-w-3xl">{post.title}</h1>
              {post.author && (
                <p className="text-gray-300 mt-4">By {post.author}</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-section py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="prose prose-lg prose-gray max-w-none">
              {post.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-bold text-gray-900 mt-10 mb-4">{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-display font-bold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>;
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*\s*(.*)/);
                  if (match) return <li key={i} className="ml-6 mb-2 text-gray-600"><strong className="text-gray-900">{match[1]}</strong> {match[2]}</li>;
                }
                if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2 text-gray-600">{line.slice(2)}</li>;
                if (line.match(/^\d+\./)) return <li key={i} className="ml-6 mb-2 text-gray-600 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
                if (line.trim() === '') return <div key={i} className="h-4" />;
                return <p key={i} className="text-gray-600 leading-relaxed mb-4">{line}</p>;
              })}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?search=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Back link */}
            <div className="mt-10">
              <Link to="/blog" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                &larr; Back to all articles
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
