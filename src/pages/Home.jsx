import React, { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import DrinkCollection from '../components/DrinkCollection';
import ProductCategories from '../components/ProductCategories';
import Categories from '../components/Categories';
import BestSellers from '../components/BestSellers';
import ComboPacks from '../components/ComboPacks';
import GameArena from '../components/games/GameArena';
import WhyChoose from '../components/WhyChoose';
import Newsletter from '../components/Newsletter';

const DeferredSection = ({ minHeight, children }) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!ref.current || mounted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={ref}
      className="deferred-section"
      style={{ minHeight: mounted ? undefined : `${minHeight}px` }}
    >
      {mounted ? children : null}
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <DeferredSection minHeight={800}>
        <GameArena />
      </DeferredSection>
      <DeferredSection minHeight={760}>
        <DrinkCollection />
      </DeferredSection>
      <DeferredSection minHeight={920}>
        <ProductCategories />
      </DeferredSection>
      <DeferredSection minHeight={560}>
        <Categories />
      </DeferredSection>
      <DeferredSection minHeight={760}>
        <BestSellers />
      </DeferredSection>
      <DeferredSection minHeight={620}>
        <ComboPacks />
      </DeferredSection>
      <DeferredSection minHeight={560}>
        <WhyChoose />
      </DeferredSection>
      <DeferredSection minHeight={360}>
        <Newsletter />
      </DeferredSection>
    </>
  );
};

export default Home;
