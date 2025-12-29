import { Waypoints, Network, CalendarClock, Wand2, Radio, Repeat2, ArrowRight, TrendingUp, ShieldCheck, Gauge, ChevronRight, MessageSquare, HelpCircle } from "lucide-react";

const features = [
  {
    icon: Waypoints,
    title: "AI Powered Expert Matching",
    description: "Find the perfect expert for your needs. Our intelligent matching algorithm analyzes your startup needs and matches you with relevant experts, filtered by industry, expertise, and availability.",
  },
  {
    icon: Network,
    title: "Business Only Community Feed",
    description: "Connect with like minded entrepreneurs in a professional environment. Real time updates from founders and experts, filter by Industry, Startup Stage, and Location. No spam, only business content.",
  },
  {
    icon: CalendarClock,
    title: "Founder Expert Booking System",
    description: "Schedule consultations seamlessly. Browse available experts, book 1 on 1 sessions, manage your calendar, set session duration and topics with automatic reminders and confirmations.",
  },
  {
    icon: Wand2,
    title: "AI Tools Suite",
    description: "Powerful AI tools to accelerate your startup. Startup Summary Generator transforms ideas into investor ready summaries. Profile Summarizer optimizes profiles for maximum visibility. Pitch Deck Summarizer extracts key highlights automatically.",
  },
  {
    icon: Radio,
    title: "Webinars & Events",
    description: "Learn from industry leaders. Live webinars with experts, recorded sessions library, networking events, interactive Q&A sessions, and auto reminders for registered events.",
  },
  {
    icon: Repeat2,
    title: "Switch Role Feature",
    description: "One account, multiple roles. Seamlessly switch between Founder, Expert, Investor, and Agency roles with one click. Maintain separate profiles for each role and access role specific features instantly.",
  },
  {
    icon: MessageSquare,
    title: "Real Time Messaging & Notifications",
    description: "Stay connected and informed. In app messaging system, internal email notifications, real time updates, push notifications, and never miss important updates.",
  },
  {
    icon: HelpCircle,
    title: "In App Support & Feedback",
    description: "Get help when you need it. 24/7 in app support, quick feedback system, help center with FAQs, direct contact with support team, and community driven solutions.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            CORE FEATURES
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Launch & Scale</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built for founders who want to move fast. Access powerful tools, connect with experts, and grow your startup all in one platform.
          </p>
        </div>

        {/* Feature count badge */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="h-px w-12 bg-border"></div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">8 Core Features</span>
          <div className="h-px w-12 bg-border"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-3xl p-8 md:p-10 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden card-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                {/* Number and line section - matching HowItWorks style */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="relative h-px flex-1">
                    <div className="absolute left-0 w-12 h-px bg-primary/30 group-hover:w-full transition-all duration-500"></div>
                    <div className="absolute left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700 delay-100"></div>
                  </div>
                </div>
                
                {/* Title and description */}
                <h3 className="text-xl font-display font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Features Banner */}
        <div className="mt-16 md:mt-20 relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-navy-foreground mb-4">
                Unlock Pro Features
              </h3>
              <ul className="grid md:grid-cols-2 gap-3 text-navy-foreground/90">
                <li className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-accent" />
                  Premium AI Analytics
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Enhanced Visibility
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  Priority Booking
                </li>
                <li className="flex items-center gap-2">
                  <Waypoints className="w-5 h-5 text-accent" />
                  Marketplace Access
                </li>
              </ul>
            </div>
            <a
              href="https://app.nextignition.com/(auth)/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-accent transition-all duration-300 group whitespace-nowrap"
            >
              Get Early Access
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
