import { Linkedin, Twitter, Instagram, ArrowRight } from "lucide-react";
import logoSecondary from "@/assets/logo-secondary.png";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "AI Tools", href: "#ai-tools" },
    { label: "Webinars", href: "#" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/nextignition-official/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/next_ignition?s=11", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/next.ignition?igsh=ZnZ4N2ZmdHJvMHpo&utm_source=qr", label: "Instagram" },
];

const Footer = () => {
  return (
    <footer className="bg-navy text-navy-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-navy-foreground/10">
        <div className="container py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">
                Stay in the Loop
              </h3>
              <p className="text-navy-foreground/70">
                Get startup tips, platform updates, and exclusive content delivered to your inbox.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3.5 rounded-xl bg-navy-foreground/10 border border-navy-foreground/20 text-navy-foreground placeholder:text-navy-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-80"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <img src={logoSecondary} alt="NextIgnition Logo" className="h-10 w-auto" />
            </a>
            <p className="text-navy-foreground/70 mb-6 max-w-sm leading-relaxed">
              Founded to empower early stage founders, NextIgnition solves real startup challenges with mentorship, AI, and a global community.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 rounded-xl bg-navy-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-navy-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-navy-foreground/70 hover:text-navy-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-navy-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-navy-foreground/70 hover:text-navy-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-navy-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-navy-foreground/70 hover:text-navy-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-navy-foreground/60">
            © 2025 NextIgnition. All rights reserved.
          </p>
          <a
            href="https://app.nextignition.com/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors group"
          >
            Launch App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
