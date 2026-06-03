import HeroSection from '../../components/sections/HeroSection.jsx';
import StatsSection from '../../components/sections/StatsSection.jsx';
import LoanProductsSection from '../../components/sections/LoanProductsSection.jsx';
import HowItWorksSection from '../../components/sections/HowItWorksSection.jsx';
import CalculatorSection from '../../components/sections/CalculatorSection.jsx';
import TestimonialsSection from '../../components/sections/TestimonialsSection.jsx';
import CTASection from '../../components/sections/CTASection.jsx';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <LoanProductsSection />
      <HowItWorksSection />
      <CalculatorSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
