import { motion } from 'framer-motion'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { icon: Github, url: "https://github.com/onepersonlab", label: "GitHub" },
    { icon: Twitter, url: "https://twitter.com/onepersonlab", label: "Twitter" },
    { icon: Mail, url: "mailto:team@onepersonlab.io", label: "Email" },
  ]

  const footerLinks = [
    { name: "About Us", href: "#intro" },
    { name: "GitHub", href: "#repos" },
    { name: "Papers", href: "#papers" },
    { name: "Projects", href: "#projects" },
  ]

  return (
    <footer className="relative py-16 px-6 border-t border-bright-cyan/10">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-teal/20 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#00ffc8' }} />
                      <stop offset="100%" style={{ stopColor: '#f5a623' }} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#footerGrad)" strokeWidth="4"/>
                  <circle cx="35" cy="40" r="8" fill="#00ffc8"/>
                  <circle cx="65" cy="40" r="8" fill="#f5a623"/>
                  <circle cx="50" cy="65" r="8" fill="#00ffc8"/>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-soft-white">
                OnePersonLab
              </span>
            </div>
            <p className="text-muted-gray text-sm leading-relaxed max-w-md">
              Multi-agent collaboration platform for scientific research. We believe AI can extend everyone's research capabilities,
              making one scientist's creativity become a team's productivity.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-soft-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-gray hover:text-bright-cyan transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-muted-gray text-sm">
            <span>© 2026 OnePersonLab.</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart className="w-4 h-4 text-amber-gold hidden sm:inline" />
            <span className="hidden sm:inline">and AI Agents.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-ocean-teal/50 flex items-center justify-center text-muted-gray hover:text-bright-cyan hover:bg-ocean-teal transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer