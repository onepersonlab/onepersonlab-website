export function ContactSection() {
  return (
    <section 
      id="contact" 
      className="min-h-[60vh] py-24 px-6 bg-navy-800 relative"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 to-mint-500">Developer</span>
          </h2>
          <p className="text-white/60" style={{ fontFamily: 'var(--font-body)' }}>
            Get in touch with the creator of OnePersonLab
          </p>
        </div>

        {/* Developer Card */}
        <div className="bg-navy-900/50 border border-white/10 rounded-xl p-8 mb-8">
          {/* Name */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Hengjie Yu
            </h3>
            <p className="text-mint-400 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
              Ph.D. | AI for Science Researcher
            </p>
          </div>

          {/* Research Interests */}
          <div className="mb-8">
            <h4 className="text-white/80 font-semibold mb-3 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Research Interests
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {['Explainable AI', 'AI Agents', 'Nanobio Interface', 'Biomolecular'].map((topic) => (
                <span 
                  key={topic}
                  className="px-4 py-2 rounded-lg bg-mint-400/10 border border-mint-400/30 text-mint-400 text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Personal Website */}
          <div className="text-center mb-8">
            <a 
              href="https://yuhengjie.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-mint-400 transition-colors"
          {/* Email Section */}
          <div className="border-t border-white/10 pt-8">
            <h4 className="text-white/80 font-semibold mb-4 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              Email
            </h4>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              {/* Email 1 - real image */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <img 
                  src="/email1.svg" 
                  alt="Email address" 
                  className="h-5 select-none"
                  draggable="false"
                />
              </div>

              {/* Email 2 - real image */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <img 
                  src="/email2.svg" 
                  alt="Email address" 
                  className="h-5 select-none"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
                  >
                    yuhengjie@westlake.edu.cn
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center">
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-white/50 hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to top
          </a>
        </div>
      </div>
    </section>
  );
}