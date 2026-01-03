import { useState } from 'react';
import { Hero } from './components/Hero';
import { ConstellationStory } from './components/ConstellationStory';
import { About } from './components/About';
import { Nav } from './components/Nav';
import { PlayModal } from './components/PlayModal';
import { CharacterUpload } from './components/CharacterUpload';
import './styles/globals.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [showCharacterUpload, setShowCharacterUpload] = useState(false);
  const [controlMethod, setControlMethod] = useState<'keyboard' | 'gesture'>('keyboard');

  const handleControlMethodSelected = (method: 'keyboard' | 'gesture') => {
    setControlMethod(method);
    setIsPlayModalOpen(false);
    setShowCharacterUpload(true);
  };

  const handleBackToModal = () => {
    setShowCharacterUpload(false);
    setIsPlayModalOpen(true);
  };

  const handleBackToHome = () => {
    setShowCharacterUpload(false);
    setIsPlayModalOpen(false);
    setCurrentPage('home');
  };

  return (
    <div className="bg-[#081124] text-white antialiased">
      {/* Navigation */}
      {!showCharacterUpload && (
        <Nav currentPage={currentPage} onNavigate={setCurrentPage} onPlayClick={() => setIsPlayModalOpen(true)} />
      )}
      
      {/* Page Content */}
      {!showCharacterUpload && (
        <>
          {currentPage === 'home' ? (
            <>
              {/* Hero with parallax */}
              <Hero onPlayClick={() => setIsPlayModalOpen(true)} />
              
              {/* Constellation story with parallax */}
              <ConstellationStory />
            </>
          ) : (
            <About />
          )}
        </>
      )}

      {/* Play Modal */}
      <PlayModal 
        isOpen={isPlayModalOpen} 
        onClose={() => setIsPlayModalOpen(false)}
        onSelectControl={handleControlMethodSelected}
      />

      {/* Character Upload */}
      {showCharacterUpload && (
        <CharacterUpload 
          controlMethod={controlMethod}
          onBack={handleBackToModal}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}