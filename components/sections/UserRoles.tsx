'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
const roles = [
  {
    title: 'Founder',
    description: 'Share problems, get mentorship, track growth',
    color: 'from-navy-blue to-electric-blue',
    features: ['Post startup ideas', 'Get expert mentorship', 'Track your progress', 'Build your MVP'],
  },
  {
    title: 'Expert',
    description: 'Share knowledge, earn, gain visibility',
    color: 'from-electric-blue to-atomic-orange',
    features: ['Share your expertise', 'Earn from consultations', 'Build your reputation', 'Help founders succeed'],
  },
  {
    title: 'Investor',
    description: 'Stealth access, browse AI-summarized pitch decks',
    color: 'from-atomic-orange to-navy-blue',
    features: ['Browse pitch decks', 'AI-powered summaries', 'Stealth mode access', 'Find investment opportunities'],
  },
  {
    title: 'Agency / Service Provider',
    description: 'Offer solutions & integrate with founders',
    color: 'from-navy-blue to-atomic-orange',
    features: ['Offer your services', 'Connect with founders', 'Showcase solutions', 'Grow your business'],
  },
]

export default function UserRoles() {
  return (
    <section id="roles" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            User Roles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role and start your journey on Next Ignition
          </p>
        </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {roles.map((role, index) => {
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-navy-blue/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
              >
                <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 overflow-hidden`}>
                  <div className="absolute inset-2 rounded-lg border border-white/30 opacity-80" />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-white/80" />
                  <span className="relative text-xs font-semibold tracking-widest text-white uppercase">
                    {role.title.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-navy-blue mb-3">
                  {role.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {role.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-atomic-orange mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" size="sm" className="mt-auto">
                  Join as {role.title}
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
            Join Your Role Today
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

