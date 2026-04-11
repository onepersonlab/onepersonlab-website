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
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-mint-400 to-mint-500 flex items-center justify-center"
              aria-hidden="true"
            >
              <span 
                className="text-navy-900 font-bold text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                1
              </span>
            </div>
            <span 
              className="text-white font-semibold text-xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              OnePersonLab
            </span>
          </div>
          
          <p 
            className="text-white/60 text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Everyone is a scientist. Every scientist is a team.
          </p>
        </div>
        
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <a 
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            GitHub
          </a>
          <a 
            href="https://twitter.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Twitter
          </a>
          <a 
            href="mailto:contact@onepersonlab.io"
            className="text-white/70 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Contact
          </a>
          <a 
            href="https://onepersonlab.io/blog"
            className="text-white/70 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Blog
          </a>
        </div>
        
        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-8">
          <a 
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-mint-400/20 flex items-center justify-center transition-colors"
            aria-label="GitHub"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <a 
            href="https://twitter.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-mint-400/20 flex items-center justify-center transition-colors"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.427 8.59 8.116 11.06h-6.596l-4.945-6.469-5.688 6.469H1.69l7.873-9.067L1.35 2.25h6.694l4.26 5.649 4.74-5.649zM5.018 4.358l8.937 12.048h1.965l-8.937-12.048H5.018z" />
            </svg>
          </a>
          <a 
            href="https://discord.gg/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-mint-400/20 flex items-center justify-center transition-colors"
            aria-label="Discord"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.884-.608 1.27a18.27 18.27 0 00-4.423 0a12.64 12.64 0 00-.617-1.27a.077.077 0 00-.079-.037A19.736 19.736 0 001.925 4.37a.07.07 0 00-.031.027C.417 6.966-.127 9.696.013 12.398a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.083-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.132c.126-.094.252-.192.374-.292a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.072 0a.072.072 0 01.078.01c.121.1.248.198.374.292a.077.077 0 01-.006.133a12.342 12.342 0 01-1.874.891a.075.075 0 00-.042.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.031-.054c.229-2.753-.138-5.47-.974-8.032a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
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