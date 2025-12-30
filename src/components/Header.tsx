import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "AI Tools", href: "#ai-tools" },
  { label: "Community", href: "#industry-community" },
  { label: "Webinars", href: "#webinars" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

// Shorter labels for medium screens
const navLinksShort = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "AI Tools", href: "#ai-tools" },
  { label: "Pricing", href: "#pricing" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container">
        <nav className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="NextIgnition Logo" className="h-8 md:h-10 w-auto" />
          </a>

          {/* Medium Screen Navigation (fewer items) */}
          <div className="hidden md:flex lg:hidden items-center gap-3">
            {navLinksShort.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Navigation (full) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Medium Screen CTAs */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <a
              href="https://app.nextignition.com/(auth)/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group whitespace-nowrap"
            >
              Launch
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://app.nextignition.com/(auth)/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Log In
            </a>
            <a
              href="https://app.nextignition.com/(auth)/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group whitespace-nowrap"
            >
              Launch App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                <a
                  href="https://app.nextignition.com/(auth)/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center py-3 rounded-lg border border-border font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Log In
                </a>
                <a
                  href="https://app.nextignition.com/(auth)/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors"
                >
                  Launch App
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
