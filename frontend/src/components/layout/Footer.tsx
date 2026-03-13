import { Link } from 'react-router-dom';

const footerLinks = {
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/about#team', label: 'Our Team' },
    { to: '/about#sustainability', label: 'Sustainability' },
    { to: '/blog', label: 'Blog' },
  ],
  products: [
    { to: '/products', label: 'All Products' },
    { to: '/products?category=grains-cereals', label: 'Grains & Cereals' },
    { to: '/products?category=fresh-vegetables', label: 'Fresh Vegetables' },
    { to: '/products?category=spices-herbs', label: 'Spices & Herbs' },
  ],
  support: [
    { to: '/contact', label: 'Contact Us' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Request a Quote' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-section py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c0 0-8 4-8 14h4c0-6 4-10 4-10s4 4 4 10h4c0-10-8-14-8-14z" />
                </svg>
              </div>
              <span className="text-lg font-display font-bold text-white">GreenFields</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Premium organic agricultural products from sustainable farms. Committed to quality,
              transparency, and environmental stewardship since 2005.
            </p>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social}
                >
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm text-gray-400">
              <p>info@greenfields-agri.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-section py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} GreenFields Agriculture. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
