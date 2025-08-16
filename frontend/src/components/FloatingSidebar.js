import React, { useState } from 'react';
import { MessageCircle, Instagram, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';

const FloatingSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const socialLinks = [
    {
      name: 'Discord',
      url: 'https://loyalhood.xyz/discord',
      icon: MessageCircle,
      color: 'hover:bg-indigo-500/20 hover:text-indigo-400',
      description: 'Join our community'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/loyalhood',
      icon: Instagram,
      color: 'hover:bg-pink-500/20 hover:text-pink-400',
      description: 'Follow us'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/loyalhood',
      icon: Youtube,
      color: 'hover:bg-red-500/20 hover:text-red-400',
      description: 'Watch tutorials'
    }
  ];

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
      <div className={`flex transition-all duration-300 ease-in-out ${
        isExpanded ? 'translate-x-0' : 'translate-x-40'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-active)] text-black 
                     p-3 rounded-l-lg transition-all duration-300 border-2 border-[var(--brand-primary)]
                     hover:shadow-[0_0_20px_rgba(0,255,209,0.5)] group"
        >
          {isExpanded ? (
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Social Links Panel */}
        <div className="bg-black/90 backdrop-blur-md border-l-0 border-2 border-[var(--brand-primary)] 
                        rounded-r-lg overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="text-center mb-4">
              <h3 className="text-sm font-semibold text-[var(--brand-primary)]">
                Connect With Us
              </h3>
            </div>
            
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
                           text-[var(--text-secondary)] ${link.color} group hover:scale-105`}
                title={link.description}
              >
                <link.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{link.name}</span>
                  <span className="text-xs opacity-70">{link.description}</span>
                </div>
              </a>
            ))}
            
            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
              <div className="text-center space-y-2">
                <div className="text-xs text-[var(--text-muted)]">System Status</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSidebar;