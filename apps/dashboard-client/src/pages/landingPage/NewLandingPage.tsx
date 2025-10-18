import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PersonaSection } from '@/components/landing/PersonaSection';
import { OpenSourceSection } from '@/components/landing/OpenSourceSection';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { Footer } from '@/components/landing/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features Showcase */}
      <FeaturesSection />

      {/* Target Audience / Personas */}
      <PersonaSection />

      {/* Open Source & Community */}
      <OpenSourceSection />

      {/* Comparison Table */}
      <ComparisonSection />

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
