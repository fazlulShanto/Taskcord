import { ComparisonSection } from './components/ComparisonSection';
import { FAQSection } from './components/FAQSection';
import { FeaturesSection } from './components/FeaturesSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { LandingNav } from './components/LandingNav';
import { OpenSourceSection } from './components/OpenSourceSection';
import { PersonaSection } from './components/PersonaSection';
import { PricingSection } from './components/PricingSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';

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
