import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import IntroSection from './components/IntroSection'
import ReposSection from './components/ReposSection'
import PapersSection from './components/PapersSection'
import ProjectsSection from './components/ProjectsSection'
import Footer from './components/Footer'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-deep-ink relative overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        className="fixed inset-0 grid-bg opacity-50 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-bright-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      <Navbar />
      
      <main>
        <HeroSection />
        <IntroSection />
        <ReposSection />
        <PapersSection />
        <ProjectsSection />
      </main>
      
      <Footer />
    </div>
  )
}

export default App