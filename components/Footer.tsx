'use client'

import Button from '@/components/ui/Button'
const footerLinks = {
  company: [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  resources: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'User Roles', href: '#roles' },
    { label: 'AI Tools', href: '#ai-tools' },
    { label: 'Webinars', href: '#webinars' },
    { label: 'Community', href: '#community' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-blue text-white">
      <div className="container-custom py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Next Ignition</h3>
            <p className="text-white/80 mb-6 max-w-md">
              Turning startup ideas into reality. Connect with experts, get mentorship, build your MVP, and raise funding—all on one platform.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <label htmlFor="newsletter" className="block text-sm font-semibold mb-2">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="newsletter"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-atomic-orange focus:border-transparent"
                />
                <Button variant="secondary" size="md">
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-atomic-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-atomic-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-atomic-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Next Ignition. All rights reserved.
          </p>
          <p className="text-white/60 text-sm">
            Founded by <span className="text-atomic-orange font-semibold">Sanket</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

