'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
const feedItems = [
  {
    author: 'Sarah Chen',
    role: 'Founder',
    company: 'TechFlow AI',
    content: 'Just launched our MVP! Thanks to the amazing mentors on Next Ignition who helped us refine our product-market fit.',
    industry: 'AI/ML',
    stage: 'Early Stage',
    location: 'San Francisco, CA',
    likes: 42,
    comments: 8,
  },
  {
    author: 'Michael Rodriguez',
    role: 'Expert',
    company: 'Growth Strategies Inc.',
    content: 'Excited to share my latest insights on scaling SaaS startups. Check out my upcoming webinar!',
    industry: 'SaaS',
    stage: 'Growth',
    location: 'New York, NY',
    likes: 67,
    comments: 12,
  },
  {
    author: 'Emma Thompson',
    role: 'Founder',
    company: 'GreenTech Solutions',
    content: 'Raised our seed round! The investor matching feature on Next Ignition was a game-changer.',
    industry: 'CleanTech',
    stage: 'Seed',
    location: 'London, UK',
    likes: 89,
    comments: 15,
  },
]

export default function CommunityFeed() {
  return (
    <section id="community" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Community Feed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Live updates from founders and experts building the future
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-navy-blue/10 text-[10px] font-semibold text-navy-blue">
              F
            </span>
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          {['All', 'AI/ML', 'SaaS', 'CleanTech', 'FinTech', 'HealthTech'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-navy-blue hover:text-navy-blue transition-colors text-sm font-medium"
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Feed Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {feedItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-navy-blue/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy-blue to-electric-blue flex items-center justify-center text-white font-bold">
                  {item.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-navy-blue">{item.author}</h4>
                    <span className="text-xs px-2 py-1 bg-navy-blue/10 text-navy-blue rounded-full">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.company}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{item.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-electric-blue/10 text-electric-blue rounded">
                  {item.industry}
                </span>
                <span className="text-xs px-2 py-1 bg-atomic-orange/10 text-atomic-orange rounded">
                  {item.stage}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {item.location}
                </span>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <span>{item.likes} likes</span>
                  <span>{item.comments} comments</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button variant="primary" size="lg" href="#waitlist">
            Join the Community
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

