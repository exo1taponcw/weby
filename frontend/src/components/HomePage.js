import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import VPSPlans from './VPSPlans';
import FeaturesSection from './FeaturesSection';
import ResourceMonitor from './ResourceMonitor';
import Footer from './Footer';
import FloatingSidebar from './FloatingSidebar';
import BackgroundMusicPlayer from './BackgroundMusicPlayer';
import EasterEggs from './EasterEggs';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <VPSPlans />
      <FeaturesSection />
      <ResourceMonitor />
      <Footer />
      <FloatingSidebar />
      <BackgroundMusicPlayer />
      <EasterEggs />
    </div>
  );
};

export default HomePage;