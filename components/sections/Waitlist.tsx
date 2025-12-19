'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function Waitlist() {
  return (
    <section id="waitlist" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Join the Waiting List
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us a bit about you and we’ll notify you as soon as new features and Pro access are available.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="waitlist-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="waitlist-name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="waitlist-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="waitlist-role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="waitlist-role"
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
                <label htmlFor="waitlist-interest" className="block text-sm font-semibold text-gray-700 mb-2">
                  What interests you?
                </label>
                <select
                  id="waitlist-interest"
                  name="interest"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all bg-white"
                >
                  <option value="">Choose an option</option>
                  <option value="pro">Pro plan access</option>
                  <option value="ai-tools">Advanced AI tools</option>
                  <option value="investor">Investor features</option>
                  <option value="services">Agency / services marketplace</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="waitlist-notes" className="block text-sm font-semibold text-gray-700 mb-2">
                Anything else we should know?
              </label>
              <textarea
                id="waitlist-notes"
                name="notes"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-navy-blue focus:ring-2 focus:ring-navy-blue/20 outline-none transition-all resize-none"
                placeholder="Share a bit about your startup or what you’re looking for."
              />
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Join Waiting List
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By joining, you agree to be contacted about Next Ignition updates. No spam.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}



