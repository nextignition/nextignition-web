import { ArrowRight, UsersRound, Bolt } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-background/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-xs font-badge font-semibold tracking-wider uppercase mb-8 animate-fade-in-up">
            <span>STARTUP LAUNCH MADE EASY</span>
          </div>

          {/* Headline */}
          <h1 className="text-hero md:text-[4rem] lg:text-[5rem] font-display font-bold text-primary-foreground leading-tight mb-8 animate-fade-in-up animation-delay-100">
            Turning Startup Ideas{" "}
            <span className="relative">
              into Reality
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 150 2 298 10" stroke="hsl(var(--accent))" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
            NextIgnition helps founders grow from idea to launch. Connect with experts, get mentorship, build your MVP, and raise funding all on one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
            <a
              href="https://nextignition-app.vercel.app/(auth)/register"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover:bg-accent/90 shadow-accent transition-all duration-300 group"
            >
              Join as Founder
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://nextignition-app.vercel.app/(auth)/register"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-background/10 backdrop-blur-sm border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-lg hover:bg-background/20 transition-all duration-300 group"
            >
              Join as Expert
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/70 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["SC", "MJ", "ER", "AK"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-xs font-semibold text-accent-foreground border-2 border-background/20"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-sm">
                <strong className="text-primary-foreground">2,500+</strong> founders joined
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UsersRound className="w-5 h-5" />
              <span className="text-sm">
                <strong className="text-primary-foreground">500+</strong> experts available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bolt className="w-5 h-5" />
              <span className="text-sm">
                <strong className="text-primary-foreground">AI powered</strong> matching
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
