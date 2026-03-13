import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

const team = [
  { name: 'David Mitchell', role: 'Founder & CEO', bio: 'Third-generation farmer with a vision for sustainable, global agriculture.' },
  { name: 'Dr. Priya Sharma', role: 'Head of Quality', bio: 'Food scientist with 15+ years ensuring the highest standards in agricultural products.' },
  { name: 'James Rodriguez', role: 'Operations Director', bio: 'Supply chain expert optimizing farm-to-table logistics across 40+ countries.' },
  { name: 'Sarah Chen', role: 'Sustainability Lead', bio: 'Environmental scientist driving our regenerative farming initiatives.' },
];

const timeline = [
  { year: '2005', event: 'GreenFields Agriculture founded with a single 50-acre organic farm.' },
  { year: '2009', event: 'Achieved USDA Organic certification. Expanded to 200 acres.' },
  { year: '2013', event: 'Launched international exports, reaching 15 countries.' },
  { year: '2017', event: 'Partnered with 50+ smallholder farms, creating a cooperative network.' },
  { year: '2020', event: 'Built state-of-the-art processing facility with ISO 22000 certification.' },
  { year: '2024', event: 'Serving 40+ countries with a catalog of 200+ premium products.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About GreenFields"
        subtitle="Our story of growing quality, nurturing sustainability, and feeding the world responsibly."
        backgroundImage="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80"
      />

      {/* Company story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">Our Story</span>
              <h2 className="section-title mt-2 mb-6">Rooted in Tradition, Growing for the Future</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  GreenFields Agriculture was born from a simple belief: that the best food comes from
                  healthy soil, sustainable practices, and genuine care for the land. Founded in 2005 by
                  David Mitchell, a third-generation farmer, we started with 50 acres of certified organic
                  farmland and a dream to share premium agricultural products with the world.
                </p>
                <p>
                  Today, we work with a network of over 50 partner farms spanning thousands of acres,
                  united by shared values of quality, sustainability, and transparency. From our
                  state-of-the-art processing facility, we serve customers in more than 40 countries,
                  offering over 200 premium agricultural products.
                </p>
                <p>
                  Every product we offer tells a story of dedication—from the farmer who nurtures the
                  crop, to our quality team that ensures perfection, to the logistics network that delivers
                  freshness to your doorstep.
                </p>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="relative">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80"
                alt="Our organic farm"
                className="rounded-2xl shadow-xl w-full"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-3xl font-bold">19+</p>
                <p className="text-sm text-primary-100">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-sage-50">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div {...fadeInUp} className="bg-white p-10 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the world's most trusted source of sustainable agricultural products,
                setting the standard for quality, transparency, and environmental stewardship
                in the global food supply chain.
              </p>
            </motion.div>
            <motion.div {...fadeInUp} className="bg-white p-10 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-earth-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To connect conscious consumers with premium, ethically-produced agricultural
                products while empowering farming communities through fair trade practices,
                regenerative agriculture, and cutting-edge food science.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="py-20 md:py-28 bg-white">
        <div className="container-section">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="section-title">Sustainability at Our Core</h2>
            <p className="section-subtitle mx-auto">
              Every decision we make considers its impact on people, planet, and future generations.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Regenerative Soil',
                desc: 'Our farming practices actively rebuild soil health, increasing organic matter and biodiversity year over year.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                ),
              },
              {
                title: 'Water Conservation',
                desc: 'Precision irrigation and rainwater harvesting systems reduce our water usage by 40% compared to conventional farming.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                ),
              },
              {
                title: 'Carbon Neutral',
                desc: 'Through carbon farming and renewable energy, we offset 100% of our operational carbon footprint.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                ),
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} className="p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-primary-900">
        <div className="container-section">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Our Journey</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, i) => (
              <motion.div key={i} {...fadeInUp} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {item.year.slice(2)}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 h-full bg-primary-700 mt-2" />}
                </div>
                <div className="pb-8">
                  <span className="text-primary-400 font-semibold">{item.year}</span>
                  <p className="text-gray-200 mt-1">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 md:py-28 bg-white">
        <div className="container-section">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="section-title">Our Leadership Team</h2>
            <p className="section-subtitle mx-auto">
              Passionate experts dedicated to bringing you the best of agriculture.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div key={i} {...fadeInUp} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-5 bg-gradient-to-br from-primary-200 to-sage-200 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-3xl font-display font-bold text-primary-800">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
