import React, { useState } from 'react';
import { Check, Zap, Crown } from 'lucide-react';
import { vpsPlans } from '../data/mock';

const VPSPlans = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handleJoinDiscord = () => {
    window.open('https://loyalhood.xyz/discord', '_blank');
  };

  return (
    <section id="plans" className="py-20 bg-black">
      <div className="dark-container">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="display-large mb-6">
              Choose Your <span className="text-[var(--brand-primary)]">Power</span>
            </h2>
            <p className="body-large text-[var(--text-secondary)] max-w-3xl mx-auto">
              Unleash next-level performance with our cutting-edge VPS hosting solutions. 
              Each plan is optimized for maximum efficiency and reliability.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {vpsPlans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card relative group ${plan.popular ? 'popular' : ''}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[var(--brand-primary)] text-black px-4 py-2 text-sm font-semibold flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="heading-1 mb-2">{plan.name}</h3>
                  <p className="body-medium text-[var(--text-muted)] mb-4">{plan.subtitle}</p>
                  <div className="text-center">
                    <span className="display-medium text-[var(--brand-primary)]">{plan.price}</span>
                  </div>
                </div>

                {/* Plan Specs */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                    <span className="body-medium text-[var(--text-secondary)]">Disk:</span>
                    <span className="body-medium font-semibold">{plan.disk}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                    <span className="body-medium text-[var(--text-secondary)]">RAM:</span>
                    <span className="body-medium font-semibold">{plan.ram}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                    <span className="body-medium text-[var(--text-secondary)]">CPU:</span>
                    <span className="body-medium font-semibold">{plan.cpu}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
                    <span className="body-medium text-[var(--text-secondary)]">Panel:</span>
                    <span className="body-medium font-semibold">{plan.panel}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
                      <span className="body-small">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleJoinDiscord}
                  className={`w-full transition-all duration-300 ${
                    plan.popular 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  } ${hoveredPlan === plan.id ? 'glow-effect' : ''}`}
                >
                  <Zap className="w-5 h-5" />
                  Join Discord
                </button>

                {/* Hover Animation Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-primary)]/5 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="body-large text-[var(--text-secondary)] mb-6">
              Need a custom solution? Let's discuss your requirements.
            </p>
            <button
              onClick={handleJoinDiscord}
              className="btn-primary dark-button-animate"
            >
              Talk to Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VPSPlans;