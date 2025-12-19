'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
const tools = [
  {
    title: 'Startup Summary Generator',
    description: 'Turn your startup ideas into concise, investor-ready summaries. Perfect for pitch decks and applications.',
    color: 'from-navy-blue to-electric-blue',
    example: 'Transform: "We make apps" → "A B2B SaaS platform that helps SMBs automate customer onboarding, reducing time-to-value by 60%"',
  },
  {
    title: 'Profile Summarizer',
    description: 'Transform your profile into a compelling narrative that attracts investors and increases visibility.',
    color: 'from-electric-blue to-atomic-orange',
    example: 'Highlight your expertise, achievements, and value proposition in a format that stands out to investors.',
  },
  {
    title: 'Pitch Deck Summarizer',
    description: 'Get key highlights and insights from your pitch deck. Perfect for quick investor reviews and feedback.',
    color: 'from-atomic-orange to-navy-blue',
    example: 'Extract the most important points from your deck: problem, solution, market size, traction, and ask.',
  },
]

export default function AITools() {
  return (
    <section id="ai-tools" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            AI Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Leverage AI to accelerate your startup journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tools.map((tool, index) => {
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-navy-blue/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-navy-blue/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 relative z-10 overflow-hidden`}>
                  <div className="absolute inset-3 rounded-lg border border-white/30" />
                  <div className="absolute -bottom-2 right-1 w-8 h-8 rounded-full bg-white/10" />
                  <span className="relative text-xs font-semibold tracking-widest text-white uppercase">
                    AI
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-navy-blue mb-4 relative z-10">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                  {tool.description}
                </p>

                <div className="bg-navy-blue/5 p-4 rounded-lg mb-6 relative z-10">
                  <p className="text-sm text-gray-700 italic">
                    &quot;{tool.example}&quot;
                  </p>
                </div>

                <Button variant="outline" size="sm" className="relative z-10">
                  Try This Tool
                </Button>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Button variant="primary" size="lg" href="#waitlist">
            Try AI Tools Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

