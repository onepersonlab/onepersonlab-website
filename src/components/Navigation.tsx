import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'vision', label: 'Our Vision', href: '#' },
  { id: 'repos', label: 'Agents', href: '#repos' },
  { id: 'papers', label: 'Papers', href: '#papers' },
  { id: 'skills', label: 'Skills & Templates', href: '#skills' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState('vision');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero section
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);

      // Determine active section
      const sections = ['repos', 'papers', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection('vision');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveSection(id);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            className="flex items-center gap-2 text-white font-semibold hover:text-mint-400 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
            onClick={(e) => handleClick(e, '#', 'vision')}
          >
            <img 
              src="/favicon.svg" 
              alt="OnePersonLab Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-lg">OnePersonLab</span>
          </a>

          {/* Nav tabs */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleClick(e, item.href, item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-mint-400 text-navy-900'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}