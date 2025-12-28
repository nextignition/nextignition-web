import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Sign Up & Create Your Profile",
    description: "Choose your role Founder, Expert, Investor, or Agency and complete your profile in minutes.",
  },
  {
    step: "02",
    title: "Post Your Startup Idea or Challenge",
    description: "Share what you're working on or what help you need. Our community is here to support you.",
  },
  {
    step: "03",
    title: "Get AI-Matched with Experts",
    description: "Our AI analyzes your needs and matches you with the most relevant experts and resources.",
  },
  {
    step: "04",
    title: "Book, Learn & Grow",
    description: "Schedule consultations, join webinars, and take action to accelerate your startup journey.",
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
                <div className="bg-card rounded-2xl p-8 md:p-10 border border-border card-hover relative overflow-hidden group">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl font-display font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
                        {item.step}
                      </span>
                      <div className="w-12 h-px bg-primary/30 group-hover:w-20 transition-all duration-300"></div>
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
            href="https://nextignition-app.vercel.app/(auth)/register"
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
