import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyJournalSection from "../components/WhyJournalSection"; // Assuming you have a WhyJournalSection component
import FeaturesSection from "../components/FeaturesSection"; // Assuming you have a FeaturesSection component
import HowItWorksSection from "../components/HowItWorksSection"; // Assuming you have a HowItWorksSection component
import TestimonialsSection from "../components/TestimonialsSection"; // Assuming you have a TestimonialsSection component
import PromptsSection from "../components/PromptsSection"; // Assuming you have a PromptsSection component
import CtaSection from "../components/CtaSection"; // Assuming you have a CtaSection component
import FooterSection from "../components/FooterSection"; // Assuming you have a FooterSection component

export default function Landing() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <div id="whyJournal"><WhyJournalSection /></div>
      <div id="features"><FeaturesSection /></div>
      <div id="howItWorks"><HowItWorksSection /></div>
      <div id="testimonials"><TestimonialsSection /></div>
      <div id="prompts"><PromptsSection /></div>
      <CtaSection />
      <FooterSection />
    </div>
  );
}
