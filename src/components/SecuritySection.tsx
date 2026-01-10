import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileCheck, Search } from 'lucide-react';
import { brandColors } from '../utils/colors';

export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End to End Encryption',
      description: 'Your data is protected with enterprise grade encryption standards.',
      color: brandColors.atomicOrange,
    },
    {
      icon: Shield,
      title: 'Secure Data Storage',
      description: 'All data is stored securely with regular backups and recovery systems.',
      color: brandColors.electricBlue,
    },
    {
      icon: Eye,
      title: 'Privacy Controls',
      description: 'Control who sees your profile and manage data sharing preferences.',
      color: brandColors.electricBlue,
    },
    {
      icon: FileCheck,
      title: 'GDPR Compliant',
      description: 'Fully compliant with international data protection regulations.',
      color: brandColors.atomicOrange,
    },
    {
      icon: Search,
      title: 'Regular Security Audits',
      description: 'Continuous security monitoring and regular audits to ensure protection.',
      color: brandColors.electricBlue,
    },
  ];

  const stats = [
    { value: '500+', label: 'Startups Funded', color: brandColors.atomicOrange },
    { value: '1,200+', label: 'MVPs Launched', color: brandColors.electricBlue },
    { value: '15,000+', label: 'Mentorship Hours', color: brandColors.electricBlue },
    { value: '50+', label: 'Countries', color: brandColors.atomicOrange },
  ];

  return (
    <section id="security" className="relative p-[0px] overflow-hidden bg-[rgb(26,26,26)]" >
      {/* Continue Vertical Dashed Lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="max-w-7xl mx-auto h-full relative px-8">
          <svg className="absolute left-[calc(25%+2rem)] top-0 h-full w-px" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="100%" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <svg className="absolute left-[calc(50%+2rem)] top-0 h-full w-px" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="100%" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <svg className="absolute left-[calc(75%+2rem)] top-0 h-full w-px" preserveAspectRatio="none">
            <line 
              x1="0" 
              y1="0" 
              x2="0" 
              y2="100%" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeDasharray="8 4"
              opacity="0.1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: brandColors.electricBlue, filter: 'blur(80px)' }} />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-5" style={{ backgroundColor: brandColors.atomicOrange, filter: 'blur(100px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-[32px] bg-[rgb(26,26,26)] py-[96px]">
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
              backgroundColor: `${brandColors.electricBlue}33`,
              color: brandColors.electricBlue 
            }}
          >
            <Shield className="w-4 h-4" />
            SECURITY & PRIVACY
          </div>
          <h2 className="text-5xl leading-tight tracking-tight mb-4 text-white">
            Your Data is Safe
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enterprise grade security to protect your information and ensure your privacy.
          </p>
        </motion.div>

        {/* Security Features - 5 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-20">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative group"
              >
                {/* Card */}
                <div 
                  className="rounded-2xl p-6 h-full transition-all group-hover:scale-105"
                  style={{ 
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #333'
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: `${feature.color}22` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-sm font-bold mb-3 text-white text-center leading-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed text-center">
                    {feature.description}
                  </p>

                  {/* Decorative glow on hover */}
                  <div 
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color}33, transparent)`,
                      filter: 'blur(10px)',
                      zIndex: -1
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="text-center relative group"
            >
              {/* Stat Value */}
              <div className="mb-2">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="text-5xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </motion.span>
              </div>

              {/* Stat Label */}
              <p className="text-sm text-gray-400 font-medium">
                {stat.label}
              </p>

              {/* Accent Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="h-1 w-16 mx-auto mt-3 rounded-full"
                style={{ backgroundColor: stat.color }}
              />

              {/* Glow effect */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                style={{
                  backgroundColor: stat.color,
                  filter: 'blur(40px)'
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}