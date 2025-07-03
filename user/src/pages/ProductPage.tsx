import React from 'react';
import HeroSection from '../components/ui/HeroSection';
import PortfolioSection from '../components/ui/PortfolioSection';
import ServicesSection from '../components/ui/ServicesSection';
import ProcessSection from '../components/ui/ProcessSection';
import CTASection from '../components/ui/CTASection';
import { productPageData } from '../types/data';

const ProductPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        title={productPageData.title}
        description={productPageData.description}
        contactInfo={productPageData.contactInfo}
      />
      <PortfolioSection portfolioImages={productPageData.portfolioImages} />
      <ServicesSection services={productPageData.services} />
      <ProcessSection process={productPageData.process} />
      <CTASection
        title={productPageData.ctaTitle}
        description={productPageData.ctaDescription}
        buttonText={productPageData.ctaButtonText}
      />
    </div>
  );
};

export default ProductPage;