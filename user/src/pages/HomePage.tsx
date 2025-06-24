import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChoose from '../components/WhyChoose';
import ImageSlider from '../components/ImageSlider';

const HomePage: React.FC = () => {
  return (
    <>
    <ImageSlider />
      <Hero />
      <Services />
      <WhyChoose />
      {/* <About /> */}
      {/* <Contact /> */}
    </>
  );
};

export default HomePage;