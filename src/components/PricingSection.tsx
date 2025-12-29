import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Start your journey at no cost",
    price: "$0",
    period: "forever",
    features: [
      "Core features access",
      "AI powered expert matching",
      "Community feed access",
      "Limited consultations (3 per month)",
      "AI tools (limited usage)",
      "Webinar access",
      "Basic messaging",
      "In app support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "Unlock advanced features",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Free, plus:",
      "Unlimited consultations",
      "Advanced AI analytics",
      "Enhanced startup visibility",
      "Priority booking with experts",
      "Marketplace access",
      "Investor pitch ranking",
      "Pitch performance metrics",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    badge: "Most Popular",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            SIMPLE PRICING
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Start Free,{" "}
            <span className="text-gradient">Upgrade When Ready</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get access to all core features for free. Upgrade to Pro when you're ready to accelerate your growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 md:p-10 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-primary to-navy border-2 border-primary text-primary-foreground"
                  : "bg-card border border-border"
              } card-hover`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-display font-bold mb-2 ${
                  plan.highlighted ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                <p className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-display font-bold ${
                  plan.highlighted ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  /{plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li 
                    key={feature} 
                    className="group flex items-start gap-3 p-2.5 rounded-lg bg-background/30 hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      plan.highlighted 
                        ? "bg-accent/20 group-hover:bg-accent" 
                        : "bg-primary/20 group-hover:bg-primary"
                    }`}>
                      <Check className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300 ${
                        plan.highlighted 
                          ? "text-accent group-hover:text-accent-foreground" 
                          : "text-primary group-hover:text-primary-foreground"
                      }`} />
                    </div>
                    <span className={`text-sm font-medium leading-relaxed group-hover:text-primary transition-colors duration-300 ${
                      plan.highlighted ? "text-primary-foreground/90" : "text-foreground"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="https://app.nextignition.com/(auth)/register"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 group ${
                  plan.highlighted
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent"
                    : "bg-primary text-primary-foreground hover:bg-primary-dark shadow-brand"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
