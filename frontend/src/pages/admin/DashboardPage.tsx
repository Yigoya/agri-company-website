import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productsApi } from '@/api/products';
import { blogApi } from '@/api/blog';
import { contactApi } from '@/api/contact';

export default function DashboardPage() {
  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsApi.getAllProducts({ page: 1, page_size: 1 }),
  });

  const { data: posts } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: () => blogApi.getAllPosts({ page: 1, page_size: 1 }),
  });

  const { data: inquiries } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: () => contactApi.getInquiries({ page: 1, page_size: 1 }),
  });

  const { data: unread } = useQuery({
    queryKey: ['admin-unread'],
    queryFn: contactApi.getUnreadCount,
  });

  const stats = [
    { label: 'Total Products', value: products?.total ?? '—', to: '/admin/products', color: 'bg-primary-50 text-primary-700' },
    { label: 'Blog Posts', value: posts?.total ?? '—', to: '/admin/blog', color: 'bg-blue-50 text-blue-700' },
    { label: 'Inquiries', value: inquiries?.total ?? '—', to: '/admin/inquiries', color: 'bg-amber-50 text-amber-700' },
    { label: 'Unread Messages', value: unread?.count ?? '—', to: '/admin/inquiries', color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-500">Add, edit, or remove products</p>
              </div>
            </Link>
            <Link to="/admin/blog" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Blog Posts</p>
                <p className="text-sm text-gray-500">Write and publish articles</p>
              </div>
            </Link>
            <Link to="/admin/gallery" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Gallery</p>
                <p className="text-sm text-gray-500">Upload and organize photos</p>
              </div>
            </Link>
            <Link to="/admin/inquiries" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Inquiries</p>
                <p className="text-sm text-gray-500">Review and respond to messages</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Platform</span>
              <span className="font-medium text-gray-900">GreenFields CMS v1.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Frontend</span>
              <span className="font-medium text-gray-900">React 18 + TypeScript</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Backend</span>
              <span className="font-medium text-gray-900">FastAPI + PostgreSQL</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-primary-600">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
