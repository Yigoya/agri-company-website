import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <section
      className="relative py-24 md:py-32 bg-primary-900 overflow-hidden"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(5, 46, 22, 0.75), rgba(5, 46, 22, 0.75)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <div className="container-section relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-950/30" />
    </section>
  );
}
