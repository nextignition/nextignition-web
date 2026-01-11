import { motion } from 'motion/react';
import { ArrowRight, Twitter, Linkedin, Instagram } from 'lucide-react';
import { brandColors } from '../utils/colors';
import logoImage from 'figma:asset/744162bc82319afa7a749a9a028b8441f984363d.png';
import { OrangeGlobe } from './OrangeGlobe';

export function Footer() {
  const productLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'AI Tools', href: '#ai-tools' },
    { label: 'Webinars', href: '#webinars' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const resourceLinks = [
    { label: 'Industry Community', href: '#community' },
    { label: 'Growth Tracking', href: '#growth' },
    { label: 'Security', href: '#security' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Why Choose Us', href: '#why-choose' },
  ];

  const companyLinks = [
    { label: 'About', href: '#about' },
    { label: 'Roles', href: '#roles' },
    { label: 'Contact', href: '#contact' },
    { label: 'After Signup', href: '#after-signup' },
    { label: 'FAQ', href: '#faq' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookie-policy' },
  ];

  return (
    <footer className="relative bg-[#1a1a1a] text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full"
          style={{ backgroundColor: brandColors.electricBlue }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full"
          style={{ backgroundColor: brandColors.atomicOrange }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-12 gap-6 lg:gap-12 relative">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-4 relative z-20"
          >
            <div className="flex items-center gap-2 mb-[32px] mt-[0px] mr-[0px] ml-[0px]">
              <img 
                src={logoImage} 
                alt="NextIgnition Logo" 
                className=""
                style={{ width: '50%' }}
              />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 relative z-20">
              <a
                href="https://x.com/next_ignition?s=11"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/nextignition-official/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/next.ignition?igsh=ZnZ4N2ZmdHJvMHpo&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors group"
              >
                <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-6 lg:col-span-2 relative z-20"
          >
            <h4 className="font-bold text-sm mb-4" style={{ color: brandColors.electricBlue }}>
              Product
            </h4>
            <ul className="space-y-3 relative z-20">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-6 lg:col-span-2 relative z-20"
          >
            <h4 className="font-bold text-sm mb-4" style={{ color: brandColors.atomicOrange }}>
              Resources
            </h4>
            <ul className="space-y-3 relative z-20">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-6 lg:col-span-2 relative z-20"
          >
            <h4 className="font-bold text-sm mb-4" style={{ color: brandColors.electricBlue }}>
              Company
            </h4>
            <ul className="space-y-3 relative z-20">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="col-span-6 lg:col-span-2 relative z-20"
          >
            <h4 className="font-bold text-sm mb-4" style={{ color: brandColors.atomicOrange }}>
              Legal
            </h4>
            <ul className="space-y-3 relative z-20">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-8 border-t border-gray-800 flex items-center justify-between relative"
        >
          {/* Orange Globe Background - Desktop */}
          <div className="hidden lg:block absolute w-[250px] h-[250px] lg:w-[600px] lg:h-[600px] bottom-0 right-1/2 translate-x-[-130%] translate-y-[50%] lg:right-0 z-0">
            <div className="w-full h-[400px]">
              <OrangeGlobe opacity={0.5} />
            </div>
          </div>

          {/* Orange Globe Background - Mobile */}
          <div className="block lg:hidden absolute w-[320px] h-[320px] bottom-0 left-1/2 -translate-x-[130%] translate-y-[20%] z-0">
            <div className="w-full h-[400px]">
              <OrangeGlobe opacity={0.6} />
            </div>
          </div>
          
          <p className="text-sm text-[rgb(255,255,255)] relative z-10">
            © 2026 NextIgnition. All rights reserved.
          </p>

          <a
            href="https://app.nextignition.com/register"
            className="px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-xl transition-all group flex items-center gap-2 relative z-10"
            style={{
              backgroundColor: brandColors.atomicOrange
            }}
          >
            Launch App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}