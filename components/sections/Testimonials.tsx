'use client'

import { motion } from 'framer-motion'
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, TechFlow AI',
    image: 'SC',
    quote: 'Next Ignition connected me with the perfect mentors who helped refine our product-market fit. We launched our MVP in just 3 months!',
    achievement: 'Raised $500K Seed Round',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Expert, Growth Strategies',
    image: 'MR',
    quote: 'As an expert, I\'ve helped dozens of founders on Next Ignition. The platform makes it easy to share knowledge and build meaningful connections.',
    achievement: '50+ Successful Consultations',
    rating: 5,
  },
  {
    name: 'Emma Thompson',
    role: 'Founder, GreenTech Solutions',
    image: 'ET',
    quote: 'The AI-powered investor matching was incredible. We found our lead investor through the platform and closed our seed round faster than expected.',
    achievement: 'Launched MVP & Raised $1M',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Investor, Venture Capital',
    image: 'DK',
    quote: 'Next Ignition\'s pitch deck summaries save me hours. I can quickly identify promising startups and focus on the ones that matter.',
    achievement: 'Invested in 5 Startups',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from founders, experts, and investors using Next Ignition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-navy-blue/30 hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-navy-blue/15" />
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy-blue to-electric-blue flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-navy-blue text-lg mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {testimonial.role}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-atomic-orange">
                      {testimonial.rating.toFixed(1)} / 5.0 rating
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic relative z-10">
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="pt-6 border-t border-gray-200">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-atomic-orange/10 rounded-full">
                  <span className="text-sm font-semibold text-atomic-orange">
                    {testimonial.achievement}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-br from-navy-blue to-electric-blue p-12 rounded-2xl"
        >
          {[
            { label: 'Startups Funded', value: '500+' },
            { label: 'MVPs Launched', value: '1.2K+' },
            { label: 'Mentorship Hours', value: '10K+' },
            { label: 'Active Experts', value: '200+' },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-3 h-10 w-10 rounded-xl border border-white/20 relative overflow-hidden">
                <div className="absolute inset-x-2 top-2 h-0.5 bg-white/35 rounded-full" />
                <div className="absolute left-2 bottom-2 h-3 w-1 bg-white/45 rounded-full" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-white/80">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

