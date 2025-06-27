import React from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import CTASection from "../components/ui/CTASection";
import { logoPageData } from "../types/data";

const LogoPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        title={logoPageData.title}
        description={logoPageData.description}
        contactInfo={logoPageData.contactInfo}
      />
      <PortfolioSection portfolioImages={logoPageData.portfolioImages} />
      <ServicesSection services={logoPageData.services} />
      <ProcessSection process={logoPageData.process} />
      <CTASection
        title={logoPageData.ctaTitle}
        description={logoPageData.ctaDescription}
        buttonText={logoPageData.ctaButtonText}
      />
    </div>
  );
};

export default LogoPage;
