import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles, Target, Rocket, LineChart, Zap } from 'lucide-react';
import { useState } from 'react';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';
import { brandColors } from '../utils/colors';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const steps = [
    { icon: Target, label: 'Set Goals', color: brandColors.atomicOrange },
    { icon: Rocket, label: 'Build', color: brandColors.electricBlue },
    { icon: LineChart, label: 'Grow', color: brandColors.atomicOrange },
    { icon: Sparkles, label: 'Launch', color: brandColors.electricBlue },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-40 left-10 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: brandColors.atomicOrange }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: brandColors.electricBlue }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.12, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 2 === 0 ? brandColors.atomicOrange : brandColors.electricBlue,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="Next Ignition Logo"
              className="h-6 lg:h-8 cursor-pointer"
              onClick={() => window.location.hash = '#'}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <a
              href="https://app.nextignition.com/login"
              className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100 bg-white"
            >
              Log In
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Sign Up</h1>
                <p className="text-gray-600 mb-8">Start your startup journey today</p>

                <form className="space-y-5">
                  {/* Full Name Input */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 rounded border-gray-300 mt-1"
                      style={{ accentColor: brandColors.atomicOrange }}
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#terms" className="underline" style={{ color: brandColors.electricBlue }}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="underline" style={{ color: brandColors.electricBlue }}>
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all group flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${brandColors.atomicOrange}, ${brandColors.electricBlue})`
                    }}
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">Or sign up with</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social Signup Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                    <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X
                  </button>
                  <button className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                    <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                    </svg>
                    LinkedIn
                  </button>
                  <button className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Infographic Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative order-1 lg:order-2"
          >
            <div className="relative">
              {/* Journey Visualization */}
              <div className="relative h-[500px] flex items-center justify-center">
                {/* Vertical Progress Line */}
                <motion.div
                  className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full rounded-full"
                  style={{ backgroundColor: brandColors.electricBlue + '20' }}
                >
                  <motion.div
                    className="w-full rounded-full"
                    style={{ backgroundColor: brandColors.electricBlue }}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.div>

                {/* Steps */}
                <div className="relative w-full h-full">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6"
                      style={{ 
                        top: `${(index / (steps.length - 1)) * 85 + 5}%`,
                      }}
                    >
                      {index % 2 === 0 ? (
                        <>
                          <div className="text-right w-32">
                            <h3 className="font-bold text-lg whitespace-nowrap">{step.label}</h3>
                          </div>
                          <motion.div
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl relative z-20 flex-shrink-0"
                            style={{ backgroundColor: step.color }}
                            whileHover={{ scale: 1.1 }}
                            animate={{
                              boxShadow: [
                                `0 0 20px ${step.color}40`,
                                `0 0 40px ${step.color}60`,
                                `0 0 20px ${step.color}40`,
                              ]
                            }}
                            transition={{
                              boxShadow: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.3
                              }
                            }}
                          >
                            <step.icon className="w-10 h-10 text-white" />
                          </motion.div>
                          <div className="w-32"></div>
                        </>
                      ) : (
                        <>
                          <div className="w-32"></div>
                          <motion.div
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl relative z-20 flex-shrink-0"
                            style={{ backgroundColor: step.color }}
                            whileHover={{ scale: 1.1 }}
                            animate={{
                              boxShadow: [
                                `0 0 20px ${step.color}40`,
                                `0 0 40px ${step.color}60`,
                                `0 0 20px ${step.color}40`,
                              ]
                            }}
                            transition={{
                              boxShadow: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.3
                              }
                            }}
                          >
                            <step.icon className="w-10 h-10 text-white" />
                          </motion.div>
                          <div className="text-left w-32">
                            <h3 className="font-bold text-lg whitespace-nowrap">{step.label}</h3>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="mt-12 text-center"
              >
                <h2 className="text-3xl font-bold mb-4">Your Success Journey</h2>
                <p className="text-gray-600 text-lg">
                  Join thousands of founders transforming ideas into thriving businesses
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                  {[
                    { value: '10K+', label: 'Startups' },
                    { value: '95%', label: 'Success Rate' },
                    { value: '24/7', label: 'Support' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold" style={{ color: brandColors.atomicOrange }}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:hidden order-3 grid grid-cols-3 gap-4 mt-8"
          >
            {[
              { value: '10K+', label: 'Startups' },
              { value: '95%', label: 'Success Rate' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold" style={{ color: brandColors.atomicOrange }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}