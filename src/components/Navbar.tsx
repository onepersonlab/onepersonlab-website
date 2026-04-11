import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#intro' },
    { name: 'Repos', href: '#repos' },
    { name: 'Papers', href: '#papers' },
    { name: 'Projects', href: '#projects' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-deep-ink/90 backdrop-blur-lg border-b border-bright-cyan/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#hero"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#00ffc8' }} />
                    <stop offset="100%" style={{ stopColor: '#f5a623' }} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#logoGrad)" strokeWidth="4"/>
                <circle cx="35" cy="40" r="8" fill="#00ffc8"/>
                <circle cx="65" cy="40" r="8" fill="#f5a623"/>
                <circle cx="50" cy="65" r="8" fill="#00ffc8"/>
                <line x1="35" y1="40" x2="65" y2="40" stroke="url(#logoGrad)" strokeWidth="2"/>
                <line x1="35" y1="40" x2="50" y2="65" stroke="url(#logoGrad)" strokeWidth="2"/>
                <line x1="65" y1="40" x2="50" y2="65" stroke="url(#logoGrad)" strokeWidth="2"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-soft-white">
              OnePersonLab
            </span>
          </motion.a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-muted-gray hover:text-bright-cyan transition-colors font-body text-sm tracking-wide"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.a
            href="https://github.com/onepersonlab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm hidden sm:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub
          </motion.a>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-soft-white p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar