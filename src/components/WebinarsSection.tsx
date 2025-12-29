import { Video, Calendar, Users, FileText, ArrowRight } from "lucide-react";

const eventFeatures = [
  "Auto reminders via email and app",
  "Calendar integration",
  "Recorded sessions library",
  "Downloadable materials",
  "Event replays",
  "Speaker profiles",
  "Event chat and networking",
  "Post event resources",
];

const webinarTopics = [
  "Fundraising Strategies for Startups",
  "Product Market Fit: Finding Your Niche",
  "Growth Hacking Techniques",
  "Legal Essentials for Startups",
  "Scaling Your Team Effectively",
  "Investor Pitch Best Practices",
  "Marketing on a Startup Budget",
  "Industry Specific Insights",
];

const WebinarsSection = () => {
  return (
    <section id="webinars" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 text-accent text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            FREE WEBINARS
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Learn from Industry Leaders{" "}
            <span className="text-gradient">All Free</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Access expert knowledge through free webinars and events. Weekly sessions with industry experts, interactive Q&A, and recorded sessions library.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-3xl p-8 border-2 border-border/30 card-hover">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Video className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-3">Live Webinars</h3>
            <p className="text-muted-foreground leading-relaxed">
              Weekly sessions with industry experts, interactive Q&A sessions, real time learning, and expert insights and tips.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border-2 border-border/30 card-hover">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-3">Expert Led Workshops</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hands on learning experiences, practical skills development, step by step guidance, and actionable takeaways.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-8 border-2 border-border/30 card-hover">
            <div className="w-14 h-14 rounded-xl bg-navy/10 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-navy" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-3">Networking Sessions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect with peers, meet industry experts, build your network, share experiences, and find collaborators.
            </p>
          </div>
        </div>

        <div className="relative mb-12">
          <div className="bg-card rounded-3xl p-8 md:p-12 border-2 border-border/30">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold text-foreground mb-3">Event Features</h3>
              <p className="text-muted-foreground">Everything you need for seamless event participation</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {eventFeatures.map((feature, index) => (
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
                        {feature}
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

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 border-2 border-primary/20 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-display font-bold text-foreground mb-3">Upcoming Webinar Topics</h3>
              <p className="text-muted-foreground">Learn from industry leaders on these key topics</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              {webinarTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-xl p-5 bg-background/80 border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                >
                  {/* Number badge */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent/10 group-hover:bg-accent flex items-center justify-center transition-all duration-300">
                    <span className="text-xs font-bold text-accent group-hover:text-accent-foreground">{index + 1}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="pr-8">
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-300 leading-relaxed">
                      {topic}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent transition-all duration-300"></div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/50 text-foreground font-medium text-sm border-2 border-border/40">
                <FileText className="w-4 h-4 text-primary" />
                And many more...
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://app.nextignition.com/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-accent transition-all duration-300 group"
          >
            Register for Free Webinars
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WebinarsSection;

