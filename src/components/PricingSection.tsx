import { motion } from "motion/react";
import { brandColors } from "../utils/colors";

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <div
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
            style={{
              backgroundColor: `${brandColors.atomicOrange}22`,
              color: brandColors.atomicOrange,
            }}
          >
            SIMPLE PRICING
          </div>
          <h2 className="text-3xl lg:text-5xl mb-4 lg:mb-6">
            Pricing Plans Coming Soon
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            We're putting the finishing touches on our pricing plans. Get
            started for free and stay tuned for exciting updates.
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-center border-2 border-gray-100">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${brandColors.atomicOrange}15`,
              }}
            >
              <svg
                className="w-8 h-8 lg:w-10 lg:h-10"
                style={{ color: brandColors.atomicOrange }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-2xl lg:text-3xl mb-3 lg:mb-4"
            >
              Coming Soon
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xl lg:text-2xl font-semibold mb-4 text-gray-800"
            >
              Pricing Plans Launching Soon
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-sm lg:text-base text-gray-600 mb-8 max-w-lg mx-auto"
            >
              We're working on flexible pricing options that work for everyone.
              In the meantime, all core features are available for free.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 lg:px-10 lg:py-4 text-white rounded-lg font-medium text-base lg:text-lg transition-opacity"
              style={{
                backgroundColor: brandColors.atomicOrange,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get Started Free
            </motion.button>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <p className="text-xs lg:text-sm text-gray-500 mb-4">
                Currently included for free:
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                {[
                  "AI Matching",
                  "Expert Network",
                  "Community Access",
                  "Core Tools",
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                    className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-green-50 rounded-full"
                  >
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs lg:text-sm font-medium text-green-700">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
