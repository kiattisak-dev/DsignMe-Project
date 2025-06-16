import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyChoose from '../components/WhyChoose';
import About from '../components/About';
import Contact from '../components/Contact';

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