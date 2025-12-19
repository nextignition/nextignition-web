'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Contact & Support
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We&apos;re here to help
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-navy-blue mb-6">
              Send us a Message
            </h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all bg-white"
                >
                  <option value="">Select your role</option>
                  <option value="founder">Founder</option>
                  <option value="expert">Expert</option>
                  <option value="investor">Investor</option>
                  <option value="agency">Agency / Service Provider</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-navy-blue to-electric-blue p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    @
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a href="mailto:support@nextignition.com" className="text-white/90 hover:text-white transition-colors">
                      support@nextignition.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-navy-blue mb-6">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {['LinkedIn', 'Twitter', 'Instagram'].map((label) => (
                  <motion.a
                    key={label}
                    href="#"
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-br from-navy-blue to-electric-blue text-white text-sm font-medium hover:shadow-lg transition-all"
                    aria-label={label}
                  >
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-atomic-orange/10 p-8 rounded-2xl border border-atomic-orange/20">
              <h3 className="text-xl font-bold text-navy-blue mb-4">
                Need Immediate Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Use our in-app support feature for instant assistance. Our team typically responds within 24 hours.
              </p>
              <Button variant="secondary" size="md" href="#waitlist">
                Access In-App Support
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

