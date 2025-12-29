import { Check, ArrowRight } from "lucide-react";

const differentiators = [
  "All in One Platform Everything you need in one place",
  "AI Powered Smart matching and tools",
  "Expert Network Access to top mentors and advisors",
  "Global Community Connect with entrepreneurs worldwide",
  "Proven Results Real startups, real success stories",
  "Free to Start No credit card required",
  "Secure & Private Your data is protected",
  "Mobile & Web Access anywhere, anytime",
];

const WhyChooseSection = () => {
  return (
    <section id="why-choose" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 text-accent text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            WHY CHOOSE NEXTIGNITION
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            The Complete{" "}
            <span className="text-gradient">Startup Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to turn your startup idea into reality, all in one powerful platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-3xl p-6 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden card-reveal"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl" style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 8s ease infinite'
                }}></div>
              </div>
              
              <div className="relative z-10 flex items-start gap-3 p-2">
                <div className="w-6 h-6 rounded-lg bg-primary/10 group-hover:bg-primary flex items-center justify-center flex-shrink-0 transition-all duration-300">
                  <Check className="w-4 h-4 text-primary group-hover:text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 leading-relaxed">
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://app.nextignition.com/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

