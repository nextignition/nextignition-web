import { motion } from 'motion/react';
import { Users, ArrowRight } from 'lucide-react';
import { brandColors } from '../utils/colors';

export function CommunitySection() {
  const industries = [
    'Tech Startups',
    'Healthcare & Biotech',
    'FinTech',
    'E-commerce & Retail',
    'SaaS & B2B',
    'Consumer Products',
    'Education & EdTech',
    'Food & Beverage',
    'Real Estate & PropTech',
    'Energy & CleanTech',
  ];

  const benefits = [
    'Industry specific discussion forums',
    'Filter content by your industry',
    'Connect with founders in your sector',
    'Access to industry experts',
    'Sector specific resources and guides',
    'Industry news and updates',
    'Networking events by industry',
    'Job opportunities in your sector',
    'Partnership opportunities',
    'Industry trend insights',
  ];

  const colors = [
    brandColors.atomicOrange,
    brandColors.electricBlue,
    brandColors.navyBlue,
  ];

  return (
    <section id="community" className="relative bg-gradient-to-b from-white to-gray-50 py-[48px] overflow-hidden px-[0px] bg-[rgba(40,40,40,0)] pt-[48px] pr-[0px] pb-[0px] pl-[0px]">
      {/* Continue Vertical Dashed Lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="max-w-7xl mx-auto h-full relative px-8">
          <svg className="absolute left-[calc(25%+2rem)] top-0 h-full w-px" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="100%" 
              stroke="#d1d5db" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <svg className="absolute left-[calc(50%+2rem)] top-0 h-full w-px" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="100%" 
              stroke="#d1d5db" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <svg className="absolute left-[calc(75%+2rem)] top-0 h-full w-px" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="100%" 
              stroke="#d1d5db" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-[32px] py-[48px] bg-[rgb(248,248,248)]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider mb-4"
            style={{ 
              backgroundColor: `${brandColors.atomicOrange}22`,
              color: brandColors.atomicOrange 
            }}
          >
            <Users className="w-4 h-4" />
            INDUSTRY COMMUNITY
          </div>
          <h2 className="text-5xl leading-tight tracking-tight mb-4">
            Connect with Your Industry
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join specialized communities for your sector. Connect with founders, experts, and investors in your industry.
          </p>
        </motion.div>

        {/* Industry Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-20"
        >
          {industries.map((industry, index) => {
            const color = colors[index % colors.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: `${color}22`,
                  color: color,
                  border: `2px solid ${color}44`
                }}
              >
                {industry}
              </motion.div>
            );
          })}
        </motion.div>

        {/* What You Get Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 hidden lg:block"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3">
              What You Get in Each Community
            </h3>
            <p className="text-gray-600 text-base">
              Everything you need to grow within your industry
            </p>
          </div>

          {/* Benefits Grid - 5 columns x 2 rows */}
          <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const color = colors[index % colors.length];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  className="group bg-white rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-opacity-30"
                  style={{
                    borderColor: `${color}00`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${color}00`;
                  }}
                >
                  {/* Number Badge */}
                  <div className="flex items-center justify-center mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Benefit Text */}
                  <p className="text-sm text-gray-800 leading-snug text-center font-medium">
                    {benefit}
                  </p>

                  {/* Hover Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${color}08, transparent)`
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button 
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-base hover:shadow-2xl transition-all hover:gap-4"
            style={{ backgroundColor: brandColors.atomicOrange }}
          >
            Join Your Industry Community Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}