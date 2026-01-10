import { motion } from 'motion/react';
import { Video, ArrowRight, Calendar, Users, Lightbulb, Clock, BookOpen, MessageCircle, Download, PlayCircle, User, Network } from 'lucide-react';
import { brandColors } from '../utils/colors';

export function WebinarSection() {
  const webinarTypes = [
    {
      icon: Video,
      title: 'Live Webinars',
      description: 'Weekly sessions with industry experts, interactive Q&A sessions, real time learning, and expert insights and tips.',
      color: brandColors.atomicOrange,
      gradient: 'from-orange-50 to-white',
    },
    {
      icon: Lightbulb,
      title: 'Expert Led Workshops',
      description: 'Hands on learning experiences, practical skills development, step by step guidance, and actionable takeaways.',
      color: brandColors.electricBlue,
      gradient: 'from-blue-50 to-white',
    },
    {
      icon: Network,
      title: 'Networking Sessions',
      description: 'Connect with peers, meet industry experts, build your network, share experiences, and find collaborators.',
      color: brandColors.navyBlue,
      gradient: 'from-indigo-50 to-white',
    },
  ];

  const eventFeatures = [
    { icon: Clock, text: 'Auto reminders via email and app' },
    { icon: Calendar, text: 'Calendar integration' },
    { icon: BookOpen, text: 'Recorded sessions library' },
    { icon: Download, text: 'Downloadable materials' },
    { icon: PlayCircle, text: 'Event replays' },
    { icon: User, text: 'Speaker profiles' },
    { icon: MessageCircle, text: 'Event chat and networking' },
    { icon: Download, text: 'Post event resources' },
  ];

  const upcomingTopics = [
    'Fundraising Strategies for Startups',
    'Product Market Fit: Finding Your Niche',
    'Growth Hacking Techniques',
    'Legal Essentials for Startups',
    'Scaling Your Team Effectively',
    'Investor Pitch Best Practices',
    'Marketing on a Startup Budget',
    'Industry Specific Insights',
  ];

  const colors = [brandColors.atomicOrange];

  return (
    <section id="webinars" className="relative bg-white py-24 overflow-hidden">
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

      {/* Animated Background Icons */}
      <motion.div
        className="absolute top-20 right-20 w-24 h-24 rounded-2xl flex items-center justify-center pointer-events-none opacity-10"
        style={{ backgroundColor: `${brandColors.electricBlue}22` }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Video className="w-12 h-12" style={{ color: brandColors.electricBlue }} />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 w-20 h-20 rounded-xl flex items-center justify-center pointer-events-none opacity-10"
        style={{ backgroundColor: `${brandColors.atomicOrange}22` }}
        animate={{
          y: [0, 15, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Calendar className="w-10 h-10" style={{ color: brandColors.atomicOrange }} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-32 w-16 h-16 rounded-lg flex items-center justify-center pointer-events-none opacity-10"
        style={{ backgroundColor: `${brandColors.navyBlue}22` }}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <PlayCircle className="w-8 h-8" style={{ color: brandColors.navyBlue }} />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-16 w-14 h-14 rounded-full flex items-center justify-center pointer-events-none opacity-10"
        style={{ backgroundColor: `${brandColors.electricBlue}22` }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <MessageCircle className="w-7 h-7" style={{ color: brandColors.electricBlue }} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider mb-4"
            style={{ 
              backgroundColor: `${brandColors.electricBlue}22`,
              color: brandColors.electricBlue 
            }}
          >
            <Video className="w-4 h-4" />
            FREE WEBINARS
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight mb-4">
            Learn from Industry Leaders<br className="hidden md:block" />
            All Free
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
            Access expert knowledge through free webinars and events. Weekly sessions with industry experts, interactive Q&A, and recorded sessions library.
          </p>
        </motion.div>

        {/* Three Webinar Types - Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-16 md:mb-24">
          {webinarTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`bg-gradient-to-br ${type.gradient} rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all`}
              >
                {/* Icon */}
                <motion.div
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: 360 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                  style={{ backgroundColor: `${type.color}22` }}
                >
                  <Icon className="w-8 h-8" style={{ color: type.color }} />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 text-center" style={{ color: type.color }}>
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed text-center">
                  {type.description}
                </p>

                {/* Decorative element */}
                <div 
                  className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10"
                  style={{ backgroundColor: type.color }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Event Features Section - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24 items-start">
          {/* Left: Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Event Features
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Everything you need for seamless event participation
            </p>

            {/* Decorative Infographic Element */}
            <div className="mt-8 relative">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-32 h-32 rounded-full relative"
                style={{ backgroundColor: `${brandColors.electricBlue}22` }}
              >
                <div 
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${brandColors.electricBlue}33` }}
                >
                  <Calendar className="w-10 h-10" style={{ color: brandColors.electricBlue }} />
                </div>
                {/* Orbiting dots */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div 
                    className="absolute top-0 left-1/2 w-3 h-3 rounded-full -ml-1.5"
                    style={{ backgroundColor: brandColors.atomicOrange }}
                  />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div 
                    className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: brandColors.navyBlue }}
                  />
                </motion.div>
              </motion.div>

              {/* Stats Element */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-6 p-4 rounded-xl"
                style={{ backgroundColor: `${brandColors.atomicOrange}11` }}
              >
                <div className="text-3xl font-bold" style={{ color: brandColors.atomicOrange }}>
                  8
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Key Features
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: 4x2 Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
              {eventFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const color = colors[index % colors.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                    className="group relative bg-white rounded-2xl p-4 md:p-5 hover:shadow-lg transition-all border border-gray-100"
                  >
                    {/* Number Badge and Icon */}
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Feature Text */}
                    <p className="text-sm text-gray-800 leading-snug font-medium">
                      {feature.text}
                    </p>

                    {/* Accent Line */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '50px' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                      className="h-1 mt-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />

                    {/* Decorative corner element */}
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-5 flex items-center justify-center">
                      <Icon className="w-12 h-12" style={{ color: color }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Webinar Topics - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-12 md:mb-16 p-5 md:p-6 lg:p-8 rounded-2xl bg-[rgb(26,26,26)]">
          {/* Left: Heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-[rgb(255,255,255)]">
              Upcoming Webinar Topics
            </h3>
            <p className="text-[rgb(255,255,255)] text-base leading-relaxed mb-6">
              Learn from industry leaders on these key topics
            </p>

            {/* Decorative Infographic Element */}
            <div className="relative hidden lg:block">
              {/* Stacked Circles */}
              <div className="flex items-center gap-2 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${brandColors.atomicOrange}22` }}
                >
                  <Lightbulb className="w-7 h-7" style={{ color: brandColors.atomicOrange }} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${brandColors.electricBlue}22` }}
                >
                  <Users className="w-7 h-7" style={{ color: brandColors.electricBlue }} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${brandColors.white}22` }}
                >
                  <Video className="w-7 h-7" style={{ color: brandColors.white }} />
                </motion.div>
              </div>

              {/* Connection Lines */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="h-0.5 flex-1 rounded" style={{ backgroundColor: brandColors.atomicOrange }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.electricBlue }} />
                <div className="h-0.5 flex-1 rounded" style={{ backgroundColor: brandColors.white }} />
              </motion.div>

              {/* "And many more..." */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-base font-semibold italic"
                style={{ color: brandColors.atomicOrange }}
              >
                And many more...
              </motion.p>
            </div>
          </motion.div>

          {/* Right: Two Column List */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 lg:gap-x-8 gap-y-3 lg:gap-y-4">
              {upcomingTopics.map((topic, index) => {
                const color = colors[index % colors.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                    className="flex items-start gap-3 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    {/* Number Circle */}
                    <div 
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-base group-hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: `${color}22`,
                        color: color 
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Topic Text */}
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-semibold text-[rgb(255,255,255)] group-hover:text-black group-hover:translate-x-1 transition-transform leading-snug">
                        {topic}
                      </p>
                    </div>

                    {/* Arrow on Hover */}
                    <ArrowRight 
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 flex-shrink-0" 
                      style={{ color: color }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <button 
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-base hover:shadow-2xl transition-all hover:gap-4"
            style={{ 
              background: `linear-gradient(135deg, ${brandColors.atomicOrange}, ${brandColors.electricBlue})`
            }}
          >
            Register for Free Webinars
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}