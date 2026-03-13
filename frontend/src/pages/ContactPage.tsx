import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { contactApi } from '@/api/contact';
import PageHeader from '@/components/common/PageHeader';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const productName = searchParams.get('product') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: productName ? `Inquiry about ${productName}` : '',
    message: productName ? `I'm interested in ${productName}. Please provide more information including pricing and availability.` : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await contactApi.submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitted(true);
      toast.success('Your inquiry has been submitted successfully!');
    } catch {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out for inquiries, partnerships, or any questions."
        backgroundImage="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="container-section">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <motion.div {...fadeInUp} className="lg:col-span-1">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you're a potential buyer, distributor, or simply curious about our products,
                our team is ready to assist you.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-sm text-gray-600">123 Farm Road, Agricultural District<br />Greenville, CA 94105, USA</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-600">Mon - Fri, 8AM - 6PM PST</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-sm text-gray-600">info@greenfields-agri.com</p>
                    <p className="text-sm text-gray-600">sales@greenfields-agri.com</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 rounded-xl overflow-hidden border border-gray-200">
                <div className="aspect-[4/3] bg-sage-50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <svg className="w-12 h-12 mx-auto text-sage-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-sage-600 font-medium">GreenFields Agriculture HQ</p>
                    <p className="text-xs text-sage-500 mt-1">Greenville, California</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div {...fadeInUp} className="lg:col-span-2">
              {isSubmitted ? (
                <div className="bg-primary-50 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Thank You!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Your inquiry has been received. Our team will review your message and get back to you
                    within 1-2 business days.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
                    }}
                    className="btn-primary mt-6"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                        <input
                          id="name" name="name" type="text"
                          value={formData.name} onChange={handleChange}
                          className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                          placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                        <input
                          id="email" name="email" type="email"
                          value={formData.email} onChange={handleChange}
                          className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                          placeholder="john@company.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                        <input
                          id="phone" name="phone" type="tel"
                          value={formData.phone} onChange={handleChange}
                          className="input-field"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                        <input
                          id="company" name="company" type="text"
                          value={formData.company} onChange={handleChange}
                          className="input-field"
                          placeholder="Your Company Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                      <input
                        id="subject" name="subject" type="text"
                        value={formData.subject} onChange={handleChange}
                        className={`input-field ${errors.subject ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="How can we help you?"
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                      <textarea
                        id="message" name="message" rows={6}
                        value={formData.message} onChange={handleChange}
                        className={`input-field resize-none ${errors.message ? 'border-red-400 focus:ring-red-400' : ''}`}
                        placeholder="Tell us about your requirements..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full md:w-auto text-base px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
