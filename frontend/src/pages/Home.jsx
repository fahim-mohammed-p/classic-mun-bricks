import React from 'react';
import Hero from '../components/Hero';
import CompanyIntro from '../components/CompanyIntro';
import WhyChooseUs from '../components/WhyChooseUs';
import FactoryPreview from '../components/FactoryPreview';
import ProjectsPreview from '../components/ProjectsPreview';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
  return (
    <main>
      <Hero />
      <CompanyIntro />
      <WhyChooseUs />
      <FactoryPreview />
      <ProjectsPreview />
      <FinalCTA />
    </main>
  );
};

export default Home;
