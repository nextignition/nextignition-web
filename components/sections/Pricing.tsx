'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Core features access',
      'Limited consults (3/month)',
      'AI tool access',
      'Community feed',
      'Basic expert matching',
      'Webinar access',
      'In-app support',
    ],
    cta: 'Start Free',
    variant: 'outline' as const,
    popular: false,
    availableNow: true,
  },
  {
    name: 'Pro',
    price: '$49',
    period: 'per month',
    description: 'Coming soon for fast-growing teams',
    features: [
      'Everything in Free',
      'Unlimited consults',
      'Premium AI Analytics & Insights',
      'Enhanced startup visibility',
      'Priority booking with top experts',
      'Marketplace access',
      'Investor analytics & pitch ranking',
      'Priority support',
    ],
    cta: 'Join Pro Waiting List',
    variant: 'outline' as const,
    popular: true,
    availableNow: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Pricing Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start on Free today and join the Pro waiting list for upcoming advanced features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-white p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? 'border-atomic-orange shadow-xl scale-105'
                  : 'border-gray-200 hover:border-navy-blue/30 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-atomic-orange text-white text-sm font-bold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-navy-blue mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-navy-blue">{plan.price}</span>
                  {plan.period !== 'forever' && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-atomic-orange mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                size="lg"
                className={`w-full ${!plan.availableNow ? 'opacity-90' : ''}`}
                href={plan.availableNow ? '#join' : '#contact'}
              >
                {plan.cta}
              </Button>
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
          <p className="text-gray-600 mb-4">
            Free plan is available now. Pro is in private beta—join the waiting list to get early access.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

