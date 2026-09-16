import React from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import HowItWorksSection from './components/HowItWorksSection/HowItWorksSection';
import DifferenceSection from './components/DifferenceSection/DifferenceSection';
import ContextBentoSection from './components/ContextBentoSection/ContextBentoSection';
import UseCasesSection from './components/UseCasesSection/UseCasesSection';
import TrustSection from './components/TrustSection/TrustSection';
import ExpertsSection from './components/ExpertsSection/ExpertsSection';
import ExpertInviteSection from './components/ExpertInviteSection/ExpertInviteSection';
import FinalCTASection from './components/FinalCTASection/FinalCTASection';
import useReveal from '../../../hooks/useReveal';
import usePageScroll from '../../../hooks/usePageScroll';
import './Landing.css';

export default function Landing() {
  useReveal();
  usePageScroll();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <DifferenceSection />
        <ContextBentoSection />
        <UseCasesSection />
        <TrustSection />
        <ExpertsSection />
        <ExpertInviteSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
