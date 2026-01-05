import { Shield, Lock, Eye, FileCheck, Database, ArrowRight } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "End to End Encryption",
    description: "Your data is protected with enterprise grade encryption standards.",
  },
  {
    icon: Lock,
    title: "Secure Data Storage",
    description: "All data is stored securely with regular backups and recovery systems.",
  },
  {
    icon: Eye,
    title: "Privacy Controls",
    description: "Control who sees your profile and manage data sharing preferences.",
  },
  {
    icon: FileCheck,
    title: "GDPR Compliant",
    description: "Fully compliant with international data protection regulations.",
  },
  {
    icon: Database,
    title: "Regular Security Audits",
    description: "Continuous security monitoring and regular audits to ensure protection.",
  },
];

const SecuritySection = () => {
  return (
    <section id="security" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            SECURITY & PRIVACY
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Your Data is{" "}
            <span className="text-gradient">Safe</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise grade security to protect your information and ensure your privacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-background rounded-3xl p-8 border-2 border-border/30 card-hover card-tilt card-shimmer relative overflow-hidden card-reveal"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl" style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 8s ease infinite'
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-all duration-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;




