import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 text-accent text-xs font-badge font-semibold tracking-wider uppercase mb-8">
            OUR MISSION
          </span>

          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-8">
            Built by Founders,{" "}
            <span className="text-gradient">For Founders</span>
          </h2>

          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border mb-10">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
              "Founded by <span className="font-semibold text-primary">Sanket</span> to empower early stage founders, NextIgnition solves real startup challenges with mentorship, AI, and a global community."
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe every great idea deserves a chance to become reality. That's why we built NextIgnition to remove the barriers between brilliant founders and the resources they need to succeed. Whether you're just starting out or scaling up, we're here to help you move smarter and faster.
            </p>
          </div>

          <a
            href="https://app.nextignition.com/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group"
          >
            Join Our Mission
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
