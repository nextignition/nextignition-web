import { Building2, Heart, CreditCard, ShoppingBag, Briefcase, Users, GraduationCap, Coffee, Home, Zap, ArrowRight } from "lucide-react";

const industries = [
  { name: "Tech Startups", icon: Building2 },
  { name: "Healthcare & Biotech", icon: Heart },
  { name: "FinTech", icon: CreditCard },
  { name: "E-commerce & Retail", icon: ShoppingBag },
  { name: "SaaS & B2B", icon: Briefcase },
  { name: "Consumer Products", icon: Users },
  { name: "Education & EdTech", icon: GraduationCap },
  { name: "Food & Beverage", icon: Coffee },
  { name: "Real Estate & PropTech", icon: Home },
  { name: "Energy & CleanTech", icon: Zap },
];

const IndustryCommunitySection = () => {
  return (
    <section id="industry-community" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            INDUSTRY COMMUNITY
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Connect with Your{" "}
            <span className="text-gradient">Industry</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join specialized communities for your sector. Connect with founders, experts, and investors in your industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {industries.map((industry, index) => (
            <div
              key={industry.name}
              className="group relative bg-card rounded-2xl p-6 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden card-reveal"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl" style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 8s ease infinite'
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-all duration-500">
                  <industry.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-all duration-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {industry.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-card rounded-3xl p-8 md:p-12 border-2 border-border/30 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-display font-bold text-foreground mb-3">
                What You Get in Each Community
              </h3>
              <p className="text-muted-foreground">Everything you need to grow within your industry</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              {[
                "Industry specific discussion forums",
                "Filter content by your industry",
                "Connect with founders in your sector",
                "Access to industry experts",
                "Sector specific resources and guides",
                "Industry news and updates",
                "Networking events by industry",
                "Job opportunities in your sector",
                "Partnership opportunities",
                "Industry trend insights",
              ].map((benefit, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-xl p-5 bg-background/80 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  {/* Number badge */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent/10 group-hover:bg-accent flex items-center justify-center transition-all duration-300">
                    <span className="text-xs font-bold text-accent group-hover:text-accent-foreground">{index + 1}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="pr-8">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://app.nextignition.com/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group"
          >
            Join Your Industry Community Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default IndustryCommunitySection;

