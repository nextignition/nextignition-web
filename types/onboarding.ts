export interface OnboardingData {
  fullName: string;
  location: string;
  bio: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;

  // Founder/Co-founder specific
  ventureName?: string;
  ventureDescription?: string;
  ventureIndustry?: string;
  ventureStage?: string;

  // Investor specific
  investmentFirm?: string;
  investorType?: string;
  investmentFocus?: string;
  investmentRange?: string;
  portfolioSize?: string;

  // Expert specific
  expertiseAreas?: string[];
  yearsExperience?: number;
  hourlyRate?: number;

  skills?: Array<{
    name: string;
    level: string;
  }>;
}

export type OnboardingStep = 'personal' | 'role-specific' | 'skills' | 'review';
