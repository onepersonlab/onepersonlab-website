import { HeroSection } from './components/HeroSection';
import { ReposSection } from './components/ReposSection';
import { PapersSection } from './components/PapersSection';
import { ProjectsSection } from './components/ProjectsSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-navy-900">
      <HeroSection />
      <ReposSection />
      <PapersSection />
      <ProjectsSection />
      <Footer />
    </div>
  );
}

export default App;