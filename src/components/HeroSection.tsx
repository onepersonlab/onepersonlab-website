import { useEffect, useState } from 'react';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16"
      role="banner"
      aria-label="Hero section"
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 animate-gradient transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
        aria-hidden="true"
      />
      
      {/* Glowing accent orb */}
      <div 
        className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-mint-400/10 blur-3xl transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      <div 
        className={`absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mint-400/5 blur-2xl transition-opacity duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* First tagline */}
        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight opacity-0 ${isVisible ? 'animate-fade-in-up animation-delay-300' : ''}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Everyone is a{' '}
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500"
          >
            scientist
          </span>
        </h1>
        
        {/* Second tagline */}
        <h2 
          className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white/90 mt-4 leading-tight opacity-0 ${isVisible ? 'animate-fade-in-up animation-delay-800' : ''}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Every scientist is a{' '}
          <span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500"
          >
            team
          </span>
        </h2>
        
        {/* Subtitle */}
        <p 
          className={`text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto opacity-0 ${isVisible ? 'animate-fade-in animation-delay-1300' : ''}`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Building the future of solo research. One person, infinite possibilities.
        </p>
        
        {/* CTA Button */}
        <div 
          className={`mt-12 opacity-0 ${isVisible ? 'animate-fade-in animation-delay-1800' : ''}`}
        >
          <a
            href="#agents"
            className="inline-flex items-center gap-2 px-8 py-4 bg-mint-400 hover:bg-mint-500 text-navy-900 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-mint-400/25 focus-visible:ring-2 focus-visible:ring-mint-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <span>Explore</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 ${isVisible ? 'animate-fade-in animation-delay-1800' : ''}`}
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}