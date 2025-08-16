import React, { useEffect, useState } from 'react';
import { Zap, Coffee, Heart, Code, Rocket } from 'lucide-react';

const EasterEggs = () => {
  const [konamiSequence, setKonamiSequence] = useState([]);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showCoffeeAnimation, setShowCoffeeAnimation] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);

  // Konami Code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKonamiSequence(prev => {
        const newSequence = [...prev, event.code].slice(-10);
        
        // Check if konami code matches
        if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
          setMatrixRain(true);
          setTimeout(() => setMatrixRain(false), 10000); // Stop after 10 seconds
          return [];
        }
        
        return newSequence;
      });

      // Easter egg for typing "coffee"
      if (event.key.toLowerCase() === 'c') {
        document.addEventListener('keydown', coffeeSequence);
      }
    };

    const coffeeSequence = (event) => {
      const word = 'coffee';
      let currentIndex = 0;
      
      const checkCoffee = (e) => {
        if (e.key.toLowerCase() === word[currentIndex]) {
          currentIndex++;
          if (currentIndex === word.length) {
            setShowCoffeeAnimation(true);
            setTimeout(() => setShowCoffeeAnimation(false), 3000);
            document.removeEventListener('keydown', checkCoffee);
          }
        } else {
          currentIndex = 0;
          document.removeEventListener('keydown', checkCoffee);
        }
      };
      
      return checkCoffee;
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [konamiCode]);

  // Logo click counter easter egg
  const handleLogoClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 10) {
        setShowSecretMessage(true);
        setTimeout(() => setShowSecretMessage(false), 5000);
        return 0;
      }
      return newCount;
    });
  };

  // Add click listener to logo
  useEffect(() => {
    const logo = document.querySelector('.dark-logo');
    if (logo) {
      logo.addEventListener('click', handleLogoClick);
      logo.style.cursor = 'pointer';
    }

    return () => {
      if (logo) {
        logo.removeEventListener('click', handleLogoClick);
      }
    };
  }, []);

  return (
    <>
      {/* Secret Message Modal */}
      {showSecretMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border-2 border-[var(--brand-primary)] p-8 rounded-lg max-w-md mx-4 text-center">
            <div className="mb-4">
              <Rocket className="w-16 h-16 text-[var(--brand-primary)] mx-auto animate-bounce" />
            </div>
            <h3 className="heading-2 mb-4 text-[var(--brand-primary)]">
              🎉 Secret Unlocked! 🎉
            </h3>
            <p className="body-medium text-[var(--text-secondary)] mb-4">
              You found the hidden easter egg! You're clearly a true developer at heart. 
              Thanks for exploring our website! 
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Code className="w-4 h-4 text-[var(--brand-primary)]" />
              <span>Keep coding, keep exploring!</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Coffee Animation */}
      {showCoffeeAnimation && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="bg-[var(--bg-secondary)] border-2 border-[var(--brand-primary)] p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8 text-yellow-500 animate-pulse" />
              <div>
                <p className="body-small font-semibold text-[var(--brand-primary)]">
                  ☕ Coffee Mode Activated!
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Productivity +100%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matrix Rain Effect */}
      {matrixRain && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          <div className="matrix-rain">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="matrix-column"
                style={{
                  left: `${i * 2}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              >
                {[...Array(20)].map((_, j) => (
                  <span
                    key={j}
                    className="matrix-char"
                    style={{
                      animationDelay: `${j * 0.1}s`
                    }}
                  >
                    {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  </span>
                ))}
              </div>
            ))}
          </div>
          
          {/* Matrix overlay message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/90 border-2 border-[var(--brand-primary)] p-8 rounded-lg text-center">
              <h2 className="display-medium mb-4 text-[var(--brand-primary)] animate-pulse">
                MATRIX MODE ACTIVATED
              </h2>
              <p className="body-large text-green-400">
                🕶️ Welcome to the real world, Neo...
              </p>
              <p className="body-small text-[var(--text-muted)] mt-2">
                Konami Code detected! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Click counter hint */}
      {clickCount > 0 && clickCount < 10 && (
        <div className="fixed top-20 left-4 z-50 opacity-75">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-2 rounded">
            <p className="text-xs text-[var(--text-muted)]">
              Logo clicks: {clickCount}/10 🤔
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EasterEggs;