import React from 'react';
import Hero from './components/Hero';
import Offers from './components/Offers';
import ProductCategories from './components/ProductCategories';
import FeaturedDrinks from './components/FeaturedDrinks';
import Categories from './components/Categories';
import BestSellers from './components/BestSellers';
import ComboPacks from './components/ComboPacks';
import WhyChoose from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <Offers />
      <ProductCategories />
      <FeaturedDrinks />
      <Categories />
      <BestSellers />
      <ComboPacks />
      <WhyChoose />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
