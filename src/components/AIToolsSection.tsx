import { BrainCircuit, UserRoundPen, FileSliders, ArrowRight } from "lucide-react";

const aiTools = [
  {
    icon: BrainCircuit,
    title: "Startup Summary Generator",
    description: "Transform your complex startup idea into a compelling, investor ready summary in seconds.",
    example: "\"Turn your 10 page plan into a punchy 2 paragraph pitch\"",
  },
  {
    icon: UserRoundPen,
    title: "Profile Summarizer",
    description: "Create optimized profiles that attract investors and increase your visibility in the ecosystem.",
    example: "\"Highlight your strengths for maximum impact\"",
  },
  {
    icon: FileSliders,
    title: "Pitch Deck Summarizer",
    description: "Get key highlights and actionable feedback on your pitch deck from our AI analysis.",
    example: "\"Know your deck's strengths and weaknesses\"",
  },
];

const AIToolsSection = () => {
  return (
    <section id="ai-tools" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-badge font-semibold tracking-wider uppercase mb-6">
            AI POWERED
          </span>
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Supercharge Your Startup with{" "}
            <span className="text-gradient">AI Tools</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Let AI handle the heavy lifting. Generate summaries, optimize profiles, and analyze pitch decks all built to help you move faster.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {aiTools.map((tool, index) => (
            <div
              key={tool.title}
              className="group relative bg-gradient-to-br from-card to-background rounded-2xl p-8 border border-border card-hover overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-6 shadow-brand">
                  <tool.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {tool.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {tool.description}
                </p>

                <p className="text-sm text-primary italic mb-6 px-4 py-3 bg-primary/5 rounded-lg">
                  {tool.example}
                </p>

                <a
                  href="https://nextignition-app.vercel.app/(auth)/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors group/link"
                >
                  Try it Now
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center">
          <a
            href="https://nextignition-app.vercel.app/(auth)/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark shadow-brand transition-all duration-300 group"
          >
            Access All AI Tools Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;
