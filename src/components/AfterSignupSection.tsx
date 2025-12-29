import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Complete Your Profile",
    duration: "5 minutes",
    description: "Add your information, select your role, and set your preferences.",
  },
  {
    step: "02",
    title: "Explore the Platform",
    duration: "10 minutes",
    description: "Browse the community feed, check out available experts, and explore AI tools.",
  },
  {
    step: "03",
    title: "Make Your First Connection",
    duration: "Day 1",
    description: "Post your startup idea, get matched with experts, and book your first consultation.",
  },
  {
    step: "04",
    title: "Start Growing",
    duration: "Week 1",
    description: "Join webinars, use AI tools, build your network, and track your progress.",
  },
];

const AfterSignupSection = () => {
  return (
    <section id="after-signup" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            YOUR JOURNEY
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            What Happens{" "}
            <span className="text-gradient">After Signup?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Your journey starts here. Sign up is free and takes less than 2 minutes. No credit card required.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-[calc(100%-6rem)] bg-gradient-to-b from-primary via-primary/50 to-transparent hidden lg:block"></div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`relative ${index % 2 === 1 ? "lg:mt-24" : ""}`}
              >
                <div className="bg-card rounded-3xl p-8 md:p-10 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden group card-reveal" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl" style={{
                      backgroundSize: '200% 200%',
                      animation: 'gradient 8s ease infinite'
                    }}></div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-all duration-500">
                            {item.step}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {item.duration}
                          </span>
                        </div>
                        <div className="relative h-px">
                          <div className="absolute left-0 w-12 h-px bg-primary/30 group-hover:w-full transition-all duration-500"></div>
                          <div className="absolute left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700 delay-100"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
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

export default AfterSignupSection;

