import React from 'react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import CompanyIntro from '../components/CompanyIntro';
import WhyChooseUs from '../components/WhyChooseUs';
import ProductShowcase from '../components/ProductShowcase';
import HomeGallery from '../components/HomeGallery';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
  return (
    <main>
      <SEO
        title="Classic Mun Bricks | Strong Beyond Any Bricks"
        description="Compressed soil bricks made from laterite soil. Strong Beyond Any Bricks."
        canonicalUrl="https://www.classicmunbricks.com/"
        ogType="website"
        ogImage="https://www.classicmunbricks.com/logo.png"
      />
      <Hero />
      <CompanyIntro />
      <WhyChooseUs />
      <ProductShowcase />
      <HomeGallery />
      <FinalCTA />
    </main>
  );
};

export default Home;
