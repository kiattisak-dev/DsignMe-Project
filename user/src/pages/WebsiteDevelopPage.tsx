import React from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import CTASection from "../components/ui/CTASection";
import { websiteDevelopPageData } from "../types/data";

const WebsiteDevelopPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        title={websiteDevelopPageData.title}
        description={websiteDevelopPageData.description}
        contactInfo={websiteDevelopPageData.contactInfo}
      />
      <PortfolioSection
        portfolioImages={websiteDevelopPageData.portfolioImages}
      />
      <ServicesSection services={websiteDevelopPageData.services} />
      <ProcessSection process={websiteDevelopPageData.process} />
      <CTASection
        title={websiteDevelopPageData.ctaTitle}
        description={websiteDevelopPageData.ctaDescription}
        buttonText={websiteDevelopPageData.ctaButtonText}
      />
    </div>
  );
};

export default WebsiteDevelopPage;
