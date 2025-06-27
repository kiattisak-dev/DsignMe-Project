import React from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import CTASection from "../components/ui/CTASection";
import { visualPageData } from "../types/data";

const VisualPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        title={visualPageData.title}
        description={visualPageData.description}
        contactInfo={visualPageData.contactInfo}
      />
      <PortfolioSection portfolioImages={visualPageData.portfolioImages} />
      <ServicesSection services={visualPageData.services} />
      <ProcessSection process={visualPageData.process} />
      <CTASection
        title={visualPageData.ctaTitle}
        description={visualPageData.ctaDescription}
        buttonText={visualPageData.ctaButtonText}
      />
    </div>
  );
};

export default VisualPage;
