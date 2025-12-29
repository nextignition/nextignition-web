import { TrendingUp, Target, Award, BarChart3, ArrowRight } from "lucide-react";

const trackingFeatures = [
  {
    icon: TrendingUp,
    title: "Milestone Tracking",
    description: "Set and track your startup milestones from idea to launch and beyond.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Define your goals and monitor progress with visual dashboards.",
  },
  {
    icon: Award,
    title: "Achievement Badges",
    description: "Earn badges as you complete milestones and reach important goals.",
  },
  {
    icon: BarChart3,
    title: "Performance Insights",
    description: "Get actionable insights from your growth metrics and analytics.",
  },
];

const trackableItems = [
  "Funding progress",
  "Mentor sessions completed",
  "Network growth",
  "Pitch improvements",
  "Milestone achievements",
];

const GrowthTrackingSection = () => {
  return (
    <section id="growth-tracking" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            GROWTH TRACKING
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Monitor Your{" "}
            <span className="text-gradient">Progress</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Track your startup journey with comprehensive dashboards, milestone tracking, and performance insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {trackingFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-3xl p-8 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden card-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl" style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 8s ease infinite'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-all duration-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="bg-card rounded-3xl p-8 md:p-12 border-2 border-border/30">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold text-foreground mb-3">
                What You Can Track
              </h3>
              <p className="text-muted-foreground">Monitor every aspect of your startup journey</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
              {trackableItems.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative"
                >
                  <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-background to-background/50 border-2 border-border/30 hover:border-primary/50 transition-all duration-500 overflow-hidden">
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Number indicator */}
                    <div className="relative mb-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-2xl font-display font-bold text-primary/30 group-hover:text-primary/60 transition-colors duration-300">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="h-px flex-1 bg-border/50 group-hover:bg-primary/30 transition-colors duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-relaxed">
                        {item}
                      </p>
                    </div>
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthTrackingSection;

