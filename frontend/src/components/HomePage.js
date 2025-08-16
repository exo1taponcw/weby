import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import VPSPlans from './VPSPlans';
import FeaturesSection from './FeaturesSection';
import ResourceMonitor from './ResourceMonitor';
import Footer from './Footer';
import FloatingSidebar from './FloatingSidebar';
import BackgroundMusicPlayer from './BackgroundMusicPlayer';

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
    </div>
  );
};

export default HomePage;