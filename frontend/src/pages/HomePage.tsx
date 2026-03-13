import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { formatPrice, getImageUrl } from '@/utils/format';
import { ProductCardSkeleton } from '@/components/common/SkeletonCard';
import type { ProductListItem } from '@/types';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
      <div className="container-section relative z-10 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-600/90 text-white text-sm font-medium rounded-full mb-6">
              Sustainable Agriculture Since 2005
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
              From Our Fields{' '}
              <span className="text-primary-400">to Your Table</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
              Premium organic agricultural products grown with care, harvested with precision,
              and delivered with a promise of unmatched quality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-4">
                Explore Products
              </Link>
              <Link to="/about" className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20 text-base px-8 py-4">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  const features = [
    { icon: '🌱', title: 'Organic Farming', desc: 'Certified organic practices with zero synthetic chemicals.' },
    { icon: '🌍', title: 'Sustainable', desc: 'Regenerative agriculture that heals the planet.' },
    { icon: '🔬', title: 'Lab Tested', desc: 'Every batch tested for purity and quality.' },
    { icon: '🚚', title: 'Global Shipping', desc: 'Delivering freshness to 40+ countries worldwide.' },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-section">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="section-title">Why Choose GreenFields?</h2>
          <p className="section-subtitle mx-auto">
            We combine traditional farming wisdom with modern technology to produce
            the highest quality agricultural products.
          </p>
        </motion.div>
        <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeInUp} className="text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors duration-300">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: ProductListItem }) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  return (
    <Link to={`/products/${product.slug}`} className="card group">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(primaryImage?.image_url)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
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
        <p className="text-primary-700 font-semibold mt-3">{formatPrice(product.price, product.unit)}</p>
      </div>
    </Link>
  );
}

function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getProducts({ featured: true, page_size: 4 }),
  });

  return (
    <section className="py-20 md:py-28 bg-sage-50">
      <div className="container-section">
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Our finest selection, handpicked for quality.</p>
          </div>
          <Link to="/products" className="btn-outline text-sm whitespace-nowrap">
            View All Products &rarr;
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.items.map((product) => (
                <motion.div key={product.id} {...fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "GreenFields has been our trusted supplier for over 5 years. Their commitment to quality and sustainability is unmatched in the industry.",
      name: "Maria Chen",
      role: "Head of Procurement, FreshMart",
    },
    {
      quote: "The consistency and purity of their products is remarkable. Every shipment meets our strict quality standards without exception.",
      name: "Robert Kimani",
      role: "Quality Director, Global Foods",
    },
    {
      quote: "Working with GreenFields transformed our supply chain. Their traceability system gives us and our customers complete confidence.",
      name: "Anna Petrov",
      role: "CEO, Organic Kitchen Co.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-section">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h2 className="section-title">What Our Partners Say</h2>
          <p className="section-subtitle mx-auto">
            Trusted by leading food companies and distributors worldwide.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i} {...fadeInUp} className="p-8 rounded-2xl bg-sage-50 border border-sage-100">
              <svg className="w-8 h-8 text-primary-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationsSection() {
  const certs = [
    { name: 'USDA Organic', desc: 'Certified organic products' },
    { name: 'ISO 22000', desc: 'Food safety management' },
    { name: 'Fair Trade', desc: 'Ethical sourcing practices' },
    { name: 'Global GAP', desc: 'Good agricultural practices' },
    { name: 'HACCP', desc: 'Hazard analysis certified' },
  ];

  return (
    <section className="py-16 bg-primary-900">
      <div className="container-section">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h3 className="text-xl font-display font-semibold text-white">Certifications & Standards</h3>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {certs.map((cert, i) => (
            <motion.div key={i} {...fadeInUp} className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-primary-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">{cert.name}</p>
              <p className="text-xs text-primary-300">{cert.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-earth-50">
      <div className="container-section text-center">
        <motion.div {...fadeInUp}>
          <h2 className="section-title mb-4">Ready to Partner with Us?</h2>
          <p className="section-subtitle mx-auto mb-8">
            Whether you're a retailer, distributor, or food manufacturer, we'd love to discuss
            how GreenFields can meet your agricultural product needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary text-base px-8 py-4">
              Contact Our Sales Team
            </Link>
            <Link to="/products" className="btn-outline text-base px-8 py-4">
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <FeaturedProducts />
      <CertificationsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
