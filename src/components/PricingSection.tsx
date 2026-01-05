import { ArrowRight } from "lucide-react";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            SIMPLE PRICING
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Pricing Plans{" "}
            <span className="text-gradient">Coming Soon</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We're putting the finishing touches on our pricing plans. Get started for free and stay tuned for exciting updates.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl p-12 md:p-16 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/20 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgxMDIsMTAyLDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3Zn+')] opacity-30"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
                <span>Coming Soon</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Pricing Plans Launching Soon
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                We're working on flexible pricing options that work for everyone. In the meantime, all core features are available for free.
              </p>
              <a
                href="https://app.nextignition.com/(auth)/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
