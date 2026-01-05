import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Sign Up & Create Your Profile",
    description: "Choose your role and build your professional profile in minutes. Select role: Founder, Expert, Investor, or Co-founder. Complete your profile with skills and experience. Set your preferences and goals.",
  },
  {
    step: "02",
    title: "Post Your Startup Idea or Challenge",
    description: "Share what you're working on or need help with. Post your startup idea or business challenge. Describe your needs and goals. Set visibility preferences.",
  },
  {
    step: "03",
    title: "Get Matched with Experts & Resources (AI Powered)",
    description: "Our AI finds the perfect experts and resources for you. AI analyzes your needs and matches you with relevant experts. Browse curated expert profiles. Access relevant resources and tools.",
  },
  {
    step: "04",
    title: "Book Consults, Join Webinars, and Grow Your Startup",
    description: "Take action and accelerate your growth. Schedule 1 on 1 consultations with experts. Join live webinars and events. Track your progress and milestones.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 text-accent text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            SIMPLE PROCESS
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            From Idea to Launch in{" "}
            <span className="text-gradient">Four Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting started is easy. Our streamlined process helps you connect with the right people and resources quickly.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-[calc(100%-6rem)] bg-gradient-to-b from-primary via-primary/50 to-transparent hidden lg:block"></div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`relative ${index % 2 === 1 ? "lg:mt-24" : ""}`}
              >
                <div className="bg-card rounded-3xl p-8 md:p-10 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden group card-reveal" style={{ animationDelay: `${index * 150}ms` }}>
                  {/* Animated background mesh */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl" style={{
                      backgroundSize: '200% 200%',
                      animation: 'gradient 8s ease infinite'
                    }}></div>
                  </div>
                  
                  {/* Corner accent with animation */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                        {item.step}
                      </span>
                      <div className="relative h-px flex-1">
                        <div className="absolute left-0 w-12 h-px bg-primary/30 group-hover:w-full transition-all duration-500"></div>
                        <div className="absolute left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700 delay-100"></div>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://app.nextignition.com/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group"
          >
            Start Your Journey Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
