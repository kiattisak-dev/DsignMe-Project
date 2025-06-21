import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChoose from '../components/WhyChoose';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Services />
      <WhyChoose />
      {/* <About /> */}
      {/* <Contact /> */}
    </>
  );
};

export default HomePage;