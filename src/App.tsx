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
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { CookiePolicyPage } from './components/CookiePolicyPage';
import { ContactPage } from './components/ContactPage';
import { useEffect, useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Check hash immediately on mount and redirect if needed
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (hash === 'login') {
      // Redirect to app login page
      window.location.replace('https://app.nextignition.com/login');
      return;
    } else if (hash === 'signup') {
      // Redirect to app register page
      window.location.replace('https://app.nextignition.com/register');
      return;
    }

    // Handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'login') {
        // Redirect to app login page
        window.location.replace('https://app.nextignition.com/login');
        return;
      } else if (hash === 'signup') {
        // Redirect to app register page
        window.location.replace('https://app.nextignition.com/register');
        return;
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
    
    // Check initial hash (only if not login/signup)
    if (hash !== 'login' && hash !== 'signup') {
      handleHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Render based on current page
  // Note: login and signup now redirect to app.nextignition.com
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