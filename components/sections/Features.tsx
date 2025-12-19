'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
const coreFeatures = [
  { title: 'AI-Powered Expert Matching', description: 'Get matched with the perfect experts for your startup needs' },
  { title: 'Business-Only Community Feed', description: 'Connect with founders and experts in a professional environment' },
  { title: 'Founder–Expert Booking System', description: 'Schedule consultations and meetings seamlessly' },
  { title: 'AI Tools Suite', description: 'Startup Summary, Profile Summarizer, and Pitch Deck Summary' },
  { title: 'Webinars & Events', description: 'Learn from industry leaders and network with peers' },
  { title: 'Switch Role Feature', description: 'Switch between Founder, Expert, Investor, or Agency roles' },
  { title: 'Connect System', description: 'Internal emails and notifications to stay connected' },
  { title: 'In-App Support & Feedback', description: 'Get help when you need it, right in the platform' },
]

const proFeatures = [
  { title: 'Premium AI Analytics & Insights', description: 'Advanced analytics to track your startup growth' },
  { title: 'Enhanced Startup Visibility', description: 'Get more exposure to investors and experts' },
  { title: 'Priority Booking with Top Experts', description: 'Access to premium experts and faster booking' },
  { title: 'Marketplace for Services & Solutions', description: 'Buy and sell startup services and solutions' },
  { title: 'Investor Analytics & Pitch Ranking', description: 'Get insights on your pitch deck performance' },
]

export default function Features() {
  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to grow your startup, from idea to launch
          </p>
        </motion.div>

        {/* Core Features */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-blue/10 rounded-full mb-4">
              <span className="text-sm font-semibold text-navy-blue">Core Features (Free / V1)</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => {
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-navy-blue/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-4 inline-flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-navy-blue to-electric-blue overflow-hidden">
                      <div className="absolute inset-y-1 left-1 w-1 rounded-full bg-white/20" />
                      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white/70" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-navy-blue/60">
                      Core
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-blue mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Pro Features */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-atomic-orange/10 rounded-full mb-4">
              <span className="text-sm font-semibold text-atomic-orange">Pro / Advanced Features (Coming Soon / Paid)</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {proFeatures.map((feature, index) => {
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-atomic-orange/5 to-white p-6 rounded-xl border-2 border-atomic-orange/20 hover:border-atomic-orange/40 hover:shadow-lg transition-all duration-300 relative"
                >
                  <div className="absolute top-2 right-2">
                    <span className="text-xs font-bold text-atomic-orange bg-atomic-orange/10 px-2 py-1 rounded">PRO</span>
                  </div>
                  <div className="mb-4 inline-flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-atomic-orange to-orange-600 overflow-hidden">
                      <div className="absolute inset-x-1 top-1 h-1 rounded-full bg-white/25" />
                      <div className="absolute bottom-1 left-1 w-3 h-3 rounded-md border border-white/50" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-atomic-orange">
                      Pro
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-blue mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button variant="secondary" size="lg" href="#waitlist">
            Join Pro Waiting List
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

