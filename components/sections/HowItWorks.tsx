'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

const steps = [
  {
    number: 1,
    title: 'Sign Up & Create Your Profile',
    description: 'Join Next Ignition and set up your profile. Choose your role and let us know your goals.',
    color: 'from-navy-blue to-electric-blue',
  },
  {
    number: 2,
    title: 'Post Your Startup Idea or Challenge',
    description: 'Share your startup idea or the challenges you\'re facing. Our AI will help structure your post.',
    color: 'from-electric-blue to-atomic-orange',
  },
  {
    number: 3,
    title: 'Get Matched with Experts & Resources',
    description: 'AI-powered matching connects you with the right experts, resources, and opportunities.',
    color: 'from-atomic-orange to-navy-blue',
  },
  {
    number: 4,
    title: 'Book Consults, Join Webinars, and Grow',
    description: 'Schedule consultations, attend webinars, and leverage our tools to accelerate your startup journey.',
    color: 'from-navy-blue to-atomic-orange',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in four simple steps and transform your startup idea into reality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => {
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:border-navy-blue/20 transition-all duration-300 hover:shadow-xl h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                    <span className="text-lg font-bold text-white">0{step.number}</span>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-navy-blue/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-navy-blue">{step.number}</span>
                  </div>

                  <h3 className="text-xl font-bold text-navy-blue mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="w-8 h-0.5 bg-gradient-to-r from-navy-blue to-atomic-orange"
                    />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button variant="primary" size="lg" href="#waitlist">
            Start Your Journey Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

