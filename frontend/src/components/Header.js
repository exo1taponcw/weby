import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="dark-header">
      <div className="dark-logo">
        LoyalHOOD
      </div>
      
      <nav className="dark-nav">
        <a 
          href="#home" 
          className="dark-nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          Home
        </a>
        <a 
          href="#plans" 
          className="dark-nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('plans');
          }}
        >
          Plans
        </a>
        <a 
          href="#features" 
          className="dark-nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('features');
          }}
        >
          Features
        </a>
        <a 
          href="#status" 
          className="dark-nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('status');
          }}
        >
          Status
        </a>
        <a 
          href="https://loyalhood.xyz/discord" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Join Discord
        </a>
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black border-b border-gray-800 md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            <a 
              href="#home" 
              className="dark-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
            >
              Home
            </a>
            <a 
              href="#plans" 
              className="dark-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('plans');
              }}
            >
              Plans
            </a>
            <a 
              href="#features" 
              className="dark-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >
              Features
            </a>
            <a 
              href="#status" 
              className="dark-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('status');
              }}
            >
              Status
            </a>
            <a 
              href="https://loyalhood.xyz/discord" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary text-center"
            >
              Join Discord
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;