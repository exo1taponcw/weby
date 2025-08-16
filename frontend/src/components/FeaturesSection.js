import React, { useState } from 'react';
import { Zap, Shield, Globe, Bot, Rocket, BarChart3 } from 'lucide-react';
import { features } from '../data/mock';

const FeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const getIcon = (iconName) => {
    const iconMap = {
      '⚡': Zap,
      '🛡️': Shield,
      '🌍': Globe,
      '🤖': Bot,
      '🚀': Rocket,
      '📊': BarChart3
    };
    
    const IconComponent = iconMap[iconName] || Zap;
    return <IconComponent className="w-8 h-8" />;
  };

  const handleFeatureHover = (featureId) => {
    setHoveredFeature(featureId);
    
    // Add interactive animation for specific features
    if (features.find(f => f.id === featureId)?.interactive) {
      // Trigger special effects for interactive features
      console.log(`Interactive feature ${featureId} hovered`);
    }
  };

  return (
    <section id="features" className="py-20 bg-[var(--bg-secondary)]">
      <div className="dark-container">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="display-large mb-6">
              Futuristic <span className="text-[var(--brand-primary)]">Technology</span>
            </h2>
            <p className="body-large text-[var(--text-secondary)] max-w-3xl mx-auto">
              Experience the next generation of VPS hosting with AI-powered optimization, 
              enterprise-grade security, and cutting-edge performance features.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-black border border-[var(--border-subtle)] p-8 
                          transition-all duration-500 hover:border-[var(--brand-primary)] 
                          hover:shadow-[0_0_30px_rgba(0,255,209,0.2)] cursor-pointer"
                onMouseEnter={() => handleFeatureHover(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Feature Icon */}
                <div className={`mb-6 transition-all duration-300 ${
                  hoveredFeature === feature.id 
                    ? 'text-[var(--brand-primary)] scale-110' 
                    : 'text-[var(--text-secondary)]'
                }`}>
                  {getIcon(feature.icon)}
                </div>

                {/* Feature Content */}
                <h3 className="heading-3 mb-4 group-hover:text-[var(--brand-primary)] transition-colors">
                  {feature.title}
                </h3>
                <p className="body-medium text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Interactive Indicator */}
                {feature.interactive && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      hoveredFeature === feature.id 
                        ? 'bg-[var(--brand-primary)] shadow-[0_0_10px_var(--brand-primary)]' 
                        : 'bg-[var(--text-muted)]'
                    }`}></div>
                  </div>
                )}

                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Interactive Feature Animations */}
                {feature.interactive && hoveredFeature === feature.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* AI Optimization Animation */}
                    {feature.id === 4 && (
                      <div className="absolute bottom-4 right-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Security Shield Animation */}
                    {feature.id === 2 && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 border-2 border-[var(--brand-primary)] rounded-full animate-ping opacity-20"></div>
                      </div>
                    )}
                    
                    {/* Performance Meter Animation */}
                    {feature.id === 1 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--brand-primary)] rounded-full animate-pulse" style={{width: '85%'}}></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Monitoring Dashboard Animation */}
                    {feature.id === 6 && (
                      <div className="absolute bottom-4 right-4">
                        <div className="grid grid-cols-3 gap-1">
                          {[...Array(9)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-1 h-1 bg-[var(--brand-primary)] rounded-full animate-pulse"
                              style={{animationDelay: `${i * 100}ms`}}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16 p-8 border border-[var(--border-subtle)] bg-black">
            <h3 className="heading-2 mb-4">
              Ready to Experience the Future?
            </h3>
            <p className="body-large text-[var(--text-secondary)] mb-6">
              Join thousands of developers and businesses who trust LoyalHOOD for their hosting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://loyalhood.xyz/discord" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary dark-button-animate"
              >
                Start Your Journey
              </a>
              <button 
                onClick={() => document.getElementById('status').scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                View Live Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;