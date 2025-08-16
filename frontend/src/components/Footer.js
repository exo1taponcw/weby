import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] py-16">
      <div className="dark-container">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="heading-2 text-[var(--brand-primary)]">LoyalHOOD</h3>
              <p className="body-medium text-[var(--text-secondary)]">
                The future of VPS hosting. Unleash next-level performance with 
                cutting-edge technology and enterprise-grade security.
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>and lots of coffee</span>
                <span>☕</span>
                <span>by exo1tap</span>
                <span className="text-red-500">❤️</span>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="heading-3">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#plans" className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors">
                    VPS Hosting
                  </a>
                </li>
                <li>
                  <a href="#features" className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors">
                    Enterprise Solutions
                  </a>
                </li>
                <li>
                  <a href="#status" className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors">
                    Status Monitoring
                  </a>
                </li>
                <li>
                  <span className="body-medium text-[var(--text-secondary)]">
                    24/7 Support
                  </span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="heading-3">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://loyalhood.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2"
                  >
                    Main Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://host.loyalhood.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2"
                  >
                    Host Portal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://pm.loyalhood.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2"
                  >
                    Proxmox Panel
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <span className="body-medium text-[var(--text-secondary)]">
                    Documentation (Coming Soon)
                  </span>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-4">
              <h4 className="heading-3">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://loyalhood.xyz/discord" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2"
                  >
                    Discord Server
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://instagram.com/loyalhood" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2"
                  >
                    Instagram
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://youtube.com/loyalhood" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="body-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2"
                  >
                    YouTube
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
                <li>
                  <span className="body-medium text-[var(--text-secondary)]">
                    GitHub (Coming Soon)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[var(--border-subtle)] mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-[var(--text-muted)]">
                © {currentYear} LoyalHOOD. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-[var(--text-muted)]">
                  Privacy Policy (Coming Soon)
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  Terms of Service (Coming Soon)
                </span>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12 p-8 bg-black border border-[var(--brand-primary)]">
            <h3 className="heading-2 mb-4 text-[var(--brand-primary)]">
              Ready to Get Started?
            </h3>
            <p className="body-large text-[var(--text-secondary)] mb-6">
              Join our Discord community and start your VPS hosting journey today.
            </p>
            <a 
              href="https://loyalhood.xyz/discord" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary dark-button-animate"
            >
              Join Discord Now
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;