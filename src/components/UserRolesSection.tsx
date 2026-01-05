import { Flame, Compass, LineChart, Building, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: Compass,
    role: "Founder",
    tagline: "Turn your idea into a successful startup",
    description: "Share your startup challenges and get expert advice. Get matched with mentors who understand your industry. Track your growth and milestones. Upload pitch decks and videos. Connect with investors. Access AI tools to refine your pitch. Join webinars to learn from successful founders.",
    benefits: ["Expert mentorship on demand", "AI powered matching", "Funding opportunities", "Growth tracking tools", "Professional network"],
    cta: "Join as Founder",
    color: "primary",
  },
  {
    icon: Flame,
    role: "Expert",
    tagline: "Share your knowledge and build your reputation",
    description: "Share your expertise with founders. Earn income through consultations. Build your professional reputation. Gain visibility in the startup ecosystem. Set your own rates and availability. Host webinars and events. Get matched with relevant startups.",
    benefits: ["Monetize your expertise", "Flexible scheduling", "Build your brand", "Network with founders and investors", "Showcase your achievements"],
    cta: "Join as Expert",
    color: "accent",
  },
  {
    icon: LineChart,
    role: "Investor",
    tagline: "Discover promising startups and make informed decisions",
    description: "Stealth access to startup profiles. Browse AI summarized pitch decks. Filter by industry, stage, and location. Connect directly with founders. Track investment opportunities. Access detailed startup analytics. Join exclusive investor events.",
    benefits: ["Early access to startups", "AI powered pitch summaries", "Efficient deal flow", "Direct founder connections", "Investment analytics"],
    cta: "Join as Investor",
    color: "navy",
  },
  {
    icon: Building,
    role: "Co-founder",
    tagline: "Find your perfect co-founder match",
    description: "Connect with potential co-founders who complement your skills. Find technical, business, or creative partners. Build your founding team. Share equity and responsibilities. Access co-founder matching tools. Join co-founder networking events.",
    benefits: ["Co-founder matching", "Skill complement matching", "Equity planning tools", "Team building resources", "Networking opportunities"],
    cta: "Join as Co-founder",
    color: "primary",
  },
];

const UserRolesSection = () => {
  return (
    <section id="roles" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-navy/10 text-navy text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            FOR EVERYONE
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            One Platform,{" "}
            <span className="text-gradient">Four Powerful Roles</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're building, advising, investing, or finding a co-founder NextIgnition has a place for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <div
              key={role.role}
              className="group bg-background rounded-3xl p-8 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden card-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated gradient mesh background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                role.color === "primary" ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" :
                role.color === "accent" ? "bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" :
                "bg-gradient-to-br from-navy/10 via-navy/5 to-transparent"
              }`} style={{
                backgroundSize: '200% 200%',
                animation: 'gradient 8s ease infinite'
              }}></div>
              
              {/* Corner decoration */}
              <div className={`absolute -top-1 -right-1 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                role.color === "primary" ? "bg-primary/20" :
                role.color === "accent" ? "bg-accent/20" :
                "bg-navy/20"
              }`}></div>
              
              <div className="relative z-10">
                <div className="relative w-16 h-16 mb-6">
                  {/* Icon background with rotation */}
                  <div className={`absolute inset-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    role.color === "primary" ? "bg-primary/10 group-hover:bg-primary group-hover:rotate-12" :
                    role.color === "accent" ? "bg-accent/10 group-hover:bg-accent group-hover:rotate-12" :
                    "bg-navy/10 group-hover:bg-navy group-hover:rotate-12"
                  }`} style={{
                    transform: 'perspective(1000px) rotateY(0deg)',
                  }}>
                    <role.icon className={`w-8 h-8 transition-all duration-500 ${
                      role.color === "primary" ? "text-primary group-hover:text-primary-foreground group-hover:scale-110" :
                      role.color === "accent" ? "text-accent group-hover:text-accent-foreground group-hover:scale-110" :
                      "text-navy group-hover:text-navy-foreground group-hover:scale-110"
                    }`} />
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${
                    role.color === "primary" ? "bg-primary/30" :
                    role.color === "accent" ? "bg-accent/30" :
                    "bg-navy/30"
                  }`}></div>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                    {role.role}
                  </h3>
                  <p className={`text-sm font-medium ${
                    role.color === "primary" ? "text-primary" :
                    role.color === "accent" ? "text-accent" :
                    "text-navy"
                  }`}>
                    {role.tagline}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {role.description}
                </p>

                <ul className="space-y-2">
                  {role.benefits.map((benefit) => (
                    <li 
                      key={benefit} 
                      className="group flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20"
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300 shadow-sm ${
                        role.color === "primary" ? "bg-primary" :
                        role.color === "accent" ? "bg-accent" :
                        "bg-navy"
                      }`}></div>
                      <span className={`text-sm font-medium group-hover:text-primary transition-colors duration-300 ${
                        role.color === "primary" ? "text-foreground" :
                        role.color === "accent" ? "text-foreground" :
                        "text-foreground"
                      }`}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons - All aligned horizontally */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 md:mt-16">
          {roles.map((role) => (
            <a
              key={role.role}
              href="https://app.nextignition.com/(auth)/register"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto sm:min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 group ${
                role.color === "primary" 
                  ? "bg-primary text-primary-foreground hover:bg-primary-dark shadow-brand" 
                  : role.color === "accent"
                  ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent"
                  : "bg-navy text-navy-foreground hover:bg-navy/90 shadow-lg"
              }`}
            >
              {role.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRolesSection;
