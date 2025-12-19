'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-6">
              About Next Ignition
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Founded by <strong>Sanket</strong> to empower early-stage founders, Next Ignition solves real startup challenges with mentorship, AI, and a global community.
              </p>
              <p>
                We're here to help founders grow smarter and faster. Our platform brings together founders, experts, investors, and service providers in one place, making it easier than ever to turn your startup idea into reality.
              </p>
              <p>
                With AI-powered matching, comprehensive tools, and a supportive community, Next Ignition is your partner in the startup journey—from idea to launch and beyond.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { label: 'Mission-Driven', value: 'Empower Founders' },
                { label: 'Global Community', value: '10K+ Members' },
                { label: 'AI-Powered', value: 'Smart Matching' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-navy-blue to-electric-blue mx-auto mb-3 overflow-hidden">
                    <div className="absolute inset-x-2 top-2 h-0.5 rounded-full bg-white/40" />
                    <div className="absolute inset-x-3 bottom-2 h-0.5 rounded-full bg-white/25" />
                    <div className="absolute left-2 top-2.5 w-1.5 h-4 rounded-full bg-white/30" />
                  </div>
                  <div className="text-sm font-semibold text-navy-blue mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <Button variant="primary" size="lg" href="#join">
                Join Our Mission
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-navy-blue to-electric-blue rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-lg leading-relaxed mb-6">
                To become the world's leading platform for early-stage founders, where every startup idea has the resources, mentorship, and community support needed to succeed.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-atomic-orange mt-2 flex-shrink-0" />
                  <p>Democratize access to startup resources and expertise</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-atomic-orange mt-2 flex-shrink-0" />
                  <p>Leverage AI to match founders with the right opportunities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-atomic-orange mt-2 flex-shrink-0" />
                  <p>Build a global community of innovators and changemakers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

