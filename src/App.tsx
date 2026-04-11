import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ReposSection } from './components/ReposSection';
import { PapersSection } from './components/PapersSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-navy-900">
      <Navigation />
      <HeroSection />
      <ReposSection />
      <PapersSection />
      <SkillsSection />
      <Footer />
    </div>
  );
}

export default App;