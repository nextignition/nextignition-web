import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { JourneySection } from './components/JourneySection';
import { RolesSection } from './components/RolesSection';
import { AIToolsSection } from './components/AIToolsSection';
import { CommunitySection } from './components/CommunitySection';
import { WebinarSection } from './components/WebinarSection';
import { GrowthTrackingSection } from './components/GrowthTrackingSection';
import { SecuritySection } from './components/SecuritySection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { MissionSection } from './components/MissionSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { CookiePolicyPage } from './components/CookiePolicyPage';
import { ContactPage } from './components/ContactPage';
import { useEffect, useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'signup') {
        setCurrentPage('signup');
      } else if (hash === 'terms') {
        setCurrentPage('terms');
      } else if (hash === 'privacy') {
        setCurrentPage('privacy');
      } else if (hash === 'cookie-policy') {
        setCurrentPage('cookie-policy');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
      
      // Scroll to top when page changes
      window.scrollTo(0, 0);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Render based on current page
  if (currentPage === 'login') {
    return <LoginPage />;
  }

  if (currentPage === 'signup') {
    return <SignupPage />;
  }

  if (currentPage === 'terms') {
    return <TermsPage />;
  }

  if (currentPage === 'privacy') {
    return <PrivacyPage />;
  }

  if (currentPage === 'cookie-policy') {
    return <CookiePolicyPage />;
  }

  if (currentPage === 'contact') {
    return <ContactPage />;
  }

  return (
    <div className="min-h-screen relative">
      <HeroSection />
      <FeaturesSection />
      <JourneySection />
      <RolesSection />
      <AIToolsSection />
      <CommunitySection />
      <WebinarSection />
      <GrowthTrackingSection />
      <SecuritySection />
      <SuccessStoriesSection />
      <WhyChooseSection />
      <MissionSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}