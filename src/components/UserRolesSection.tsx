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
    role: "Agency",
    tagline: "Offer solutions and integrate with founders",
    description: "Showcase your services. Connect with founders who need your solutions. Integrate with startup workflows. Build your client base. Get featured in marketplace. Access to qualified leads. Direct booking system.",
    benefits: ["Qualified leads", "Direct integration", "Service marketplace", "Client management tools", "Growth opportunities"],
    cta: "Join as Agency",
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
            Whether you're building, advising, investing, or serving startups NextIgnition has a place for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <div
              key={role.role}
              className="group bg-background rounded-2xl p-8 border border-border card-hover relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                role.color === "primary" ? "bg-gradient-to-br from-primary/5 to-transparent" :
                role.color === "accent" ? "bg-gradient-to-br from-accent/5 to-transparent" :
                "bg-gradient-to-br from-navy/5 to-transparent"
              }`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  role.color === "primary" ? "bg-primary/10 group-hover:bg-primary" :
                  role.color === "accent" ? "bg-accent/10 group-hover:bg-accent" :
                  "bg-navy/10 group-hover:bg-navy"
                }`}>
                  <role.icon className={`w-8 h-8 transition-colors duration-300 ${
                    role.color === "primary" ? "text-primary group-hover:text-primary-foreground" :
                    role.color === "accent" ? "text-accent group-hover:text-accent-foreground" :
                    "text-navy group-hover:text-navy-foreground"
                  }`} />
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

                <ul className="space-y-2 mb-8">
                  {role.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        role.color === "primary" ? "bg-primary" :
                        role.color === "accent" ? "bg-accent" :
                        "bg-navy"
                      }`}></div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://app.nextignition.com/(auth)/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                    role.color === "primary" ? "text-primary hover:text-primary-dark" :
                    role.color === "accent" ? "text-accent hover:text-accent/80" :
                    "text-navy hover:text-navy-muted"
                  }`}
                >
                  {role.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRolesSection;
