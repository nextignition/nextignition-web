import { Sparkle, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "NextIgnition connected me with the perfect mentor who helped me refine my pitch. We closed our seed round within 3 months!",
    author: "Sarah Chen",
    role: "Founder, TechStart AI",
    avatar: "SC",
  },
  {
    quote: "The AI tools saved me hours of work. The pitch deck summarizer gave me insights I never would have caught myself.",
    author: "Marcus Johnson",
    role: "Co founder, GreenLogistics",
    avatar: "MJ",
  },
  {
    quote: "As an expert, I've been able to help dozens of founders while building my personal brand. The platform makes it effortless.",
    author: "Dr. Emily Rodriguez",
    role: "Startup Advisor",
    avatar: "ER",
  },
];

const stats = [
  { value: "500+", label: "Startups Funded" },
  { value: "1,200+", label: "MVPs Launched" },
  { value: "15,000+", label: "Mentorship Hours" },
  { value: "50+", label: "Countries" },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 text-accent text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            SUCCESS STORIES
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Trusted by Founders{" "}
            <span className="text-gradient">Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of founders and experts who are building the future together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="bg-background rounded-2xl p-8 border border-border card-hover relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Sparkle key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-8 relative z-10">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
