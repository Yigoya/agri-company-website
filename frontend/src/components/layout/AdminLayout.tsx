import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/blog', label: 'Blog Posts' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/inquiries', label: 'Inquiries' },
];

export default function AdminLayout() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c0 0-8 4-8 14h4c0-6 4-10 4-10s4 4 4 10h4c0-10-8-14-8-14z" />
                  </svg>
                </div>
                <span className="font-display font-bold text-gray-800">Admin Panel</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'text-primary-700 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                View Site
              </Link>
              <span className="text-sm text-gray-500">{user?.full_name}</span>
              <button
                onClick={() => { logout(); navigate('/admin/login'); }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile admin nav */}
      <div className="md:hidden bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
}
