import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with NextIgnition?",
    answer: "Simply sign up for a free account, choose your role (Founder, Expert, Investor, or Agency), and complete your profile. You'll immediately have access to our community, AI tools, and expert matching features.",
  },
  {
    question: "Is NextIgnition really free?",
    answer: "Yes! Our core features are completely free, including AI powered expert matching, community access, limited consultations, and AI tools. We offer a Pro plan for advanced features like unlimited consultations, premium analytics, and marketplace access.",
  },
  {
    question: "How does the AI expert matching work?",
    answer: "Our AI analyzes your startup's needs, industry, stage, and specific challenges. It then matches you with experts who have relevant experience and availability, ensuring you get the most valuable guidance possible.",
  },
  {
    question: "Can I switch between roles?",
    answer: "Absolutely! NextIgnition allows you to seamlessly switch between Founder, Expert, Investor, and Agency roles with a single click. Many of our users wear multiple hats and need this flexibility.",
  },
  {
    question: "How do consultations work?",
    answer: "Browse matched experts, view their profiles and availability, then book a session directly through the platform. You'll receive reminders and can join video calls right from NextIgnition.",
  },
  {
    question: "What AI tools are included?",
    answer: "Free users get access to our Startup Summary Generator, Profile Summarizer, and Pitch Deck Summarizer with limited usage. Pro users get unlimited access plus advanced analytics and insights.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface-muted">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-display md:text-hero font-display font-bold text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you don't see your question here, reach out to our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-background rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
