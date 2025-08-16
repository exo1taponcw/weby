import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { ChevronRight, Zap } from 'lucide-react';

const HeroSection = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = [
    "Lightning-fast compute",
    "Affordable scalability", 
    "Enterprise-grade security"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const scrollToPlans = () => {
    const element = document.getElementById('plans');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="dark-container w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="display-huge neon-text">
                  Unleash Next-Level Performance
                </h1>
                <p className="display-medium">
                  Power Your Projects with{' '}
                  <span className="text-[var(--brand-primary)]">LoyalHOOD VPS</span>
                </p>
              </div>

              {/* Dynamic Typing Effect */}
              <div className="h-16 flex items-center">
                <div className="flex items-center space-x-3">
                  <Zap className="w-8 h-8 text-[var(--brand-primary)]" />
                  <span className="heading-2 text-[var(--brand-primary)] transition-all duration-500">
                    {phrases[currentPhrase]}
                  </span>
                </div>
              </div>

              <p className="body-large max-w-2xl">
                Experience the future of VPS hosting with hyper-speed processing, 
                AI-powered optimization, and enterprise-grade security. Deploy your 
                projects in under 30 seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <a 
                  href="https://loyalhood.xyz/discord" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary dark-button-animate group"
                >
                  Join Discord
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button 
                  onClick={scrollToPlans}
                  className="btn-secondary dark-button-animate"
                >
                  View Plans
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-[var(--border-subtle)]">
                <div className="text-center">
                  <div className="heading-2 text-[var(--brand-primary)]">99.9%</div>
                  <div className="body-small text-[var(--text-muted)]">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="heading-2 text-[var(--brand-primary)]">&lt;30s</div>
                  <div className="body-small text-[var(--text-muted)]">Deploy Time</div>
                </div>
                <div className="text-center">
                  <div className="heading-2 text-[var(--brand-primary)]">24/7</div>
                  <div className="body-small text-[var(--text-muted)]">Support</div>
                </div>
              </div>
            </div>

            {/* Right Side - Spline 3D Animation */}
            <div className="relative h-[700px] w-full overflow-visible">
              <div className="absolute inset-0 bg-gradient-radial from-[var(--brand-primary)]/20 to-transparent opacity-50"></div>
              <Spline 
                scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,209,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,209,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>
    </section>
  );
};

export default HeroSection;