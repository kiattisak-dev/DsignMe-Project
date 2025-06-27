import React from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import CTASection from "../components/ui/CTASection";
import { advertisementPageData } from "../types/data";

const AdvertisementPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        title={advertisementPageData.title}
        description={advertisementPageData.description}
        contactInfo={advertisementPageData.contactInfo}
      />
      <PortfolioSection
        portfolioImages={advertisementPageData.portfolioImages}
      />
      <ServicesSection services={advertisementPageData.services} />
      <ProcessSection process={advertisementPageData.process} />
      <CTASection
        title={advertisementPageData.ctaTitle}
        description={advertisementPageData.ctaDescription}
        buttonText={advertisementPageData.ctaButtonText}
      />
    </div>
  );
};

export default AdvertisementPage;
