export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="py-12 px-6 bg-navy-900 border-t border-white/10"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        {/* Logo and tagline */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <a 
            href="/" 
            className="flex items-center gap-3 text-white font-semibold hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <img 
              src="/favicon.svg" 
              alt="OnePersonLab Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-xl">
              OnePersonLab
            </span>
          </a>
          
          <p 
            className="text-white/60 text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Everyone is a scientist. Every scientist is a team.
          </p>
        </div>
        
        {/* Links - only GitHub and Contact */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <a 
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/70 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          <a 
            href="#contact"
            className="flex items-center gap-2 text-white/70 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </a>
        </div>
        
        {/* Copyright */}
        <div 
          className="text-center text-white/40 text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          © {currentYear} OnePersonLab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}