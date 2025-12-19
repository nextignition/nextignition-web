'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
const blogPosts = [
  {
    title: '10 Essential Tips for First-Time Founders',
    category: 'Founder Tips',
    date: 'March 10, 2024',
    excerpt: 'Learn the key strategies that successful founders wish they knew when starting out.',
    readTime: '5 min read',
  },
  {
    title: 'How to Build a Pitch Deck That Gets Funded',
    category: 'Expert Advice',
    date: 'March 5, 2024',
    excerpt: 'Industry experts share their insights on creating compelling pitch decks that attract investors.',
    readTime: '8 min read',
  },
  {
    title: 'New AI Features: Enhanced Matching Algorithm',
    category: 'Platform Updates',
    date: 'March 1, 2024',
    excerpt: 'We\'ve improved our AI matching to better connect founders with the right experts and opportunities.',
    readTime: '3 min read',
  },
]

const categories = ['All', 'Founder Tips', 'Expert Advice', 'Platform Updates']

export default function Blog() {
  return (
    <section id="blog" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Blog & Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tips, advice, and updates to help you on your startup journey
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-navy-blue hover:text-navy-blue transition-colors text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-navy-blue/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-navy-blue/10 text-navy-blue text-xs font-semibold rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-navy-blue mb-3 group-hover:text-electric-blue transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy-blue" />
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-navy-blue group-hover:text-electric-blue transition-colors">
                  Read
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button variant="outline" size="lg" href="#waitlist">
            Join Content Waiting List
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

