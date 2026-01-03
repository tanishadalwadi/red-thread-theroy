import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlay } from "../contexts/Play";
// Import cinematic components directly from the external folder
import { Hero } from "../../Cinematic Landing Page Design/src/components/Hero";
import { ConstellationStory } from "../../Cinematic Landing Page Design/src/components/ConstellationStory";
import { About } from "../../Cinematic Landing Page Design/src/components/About";
import { Nav } from "../../Cinematic Landing Page Design/src/components/Nav";
import { PlayModal } from "../../Cinematic Landing Page Design/src/components/PlayModal";
import { CharacterUpload } from "../../Cinematic Landing Page Design/src/components/CharacterUpload";
// Bring in the cinematic CSS so Tailwind utility classes render correctly
import "../../Cinematic Landing Page Design/src/index.css";
import "../../Cinematic Landing Page Design/src/styles/globals.css";

export default function CinematicLanding() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [showCharacterUpload, setShowCharacterUpload] = useState(false);
  const [controlMethod, setControlMethod] = useState("keyboard");
  const { setModeChosen, setControlMode, setPlay } = usePlay();
  const navigate = useNavigate();

  const handleControlMethodSelected = (method) => {
    setControlMethod(method);
    setModeChosen(true);
    setControlMode(method === "keyboard" ? "keys" : "hand");
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
    setCurrentPage("home");
  };

  const startGameAfterUpload = () => {
    // After upload, jump into the main game route
    setPlay(true);
    navigate("/");
  };

  return (
    <div className="bg-[#081124] text-white antialiased">
      {!showCharacterUpload && (
        <Nav
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onPlayClick={() => setIsPlayModalOpen(true)}
        />
      )}

      {!showCharacterUpload && (
        <>
          {currentPage === "home" ? (
            <>
              <Hero onPlayClick={() => setIsPlayModalOpen(true)} />
              <ConstellationStory />
            </>
          ) : (
            <About />
          )}
        </>
      )}

      <PlayModal
        isOpen={isPlayModalOpen}
        onClose={() => setIsPlayModalOpen(false)}
        onSelectControl={handleControlMethodSelected}
      />

      {showCharacterUpload && (
        <CharacterUpload
          controlMethod={controlMethod}
          onBack={handleBackToModal}
          onBackToHome={handleBackToHome}
          onSkip={() => navigate("/game")}
        />
      )}

      {showCharacterUpload && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 110 }}>
          <button
            onClick={startGameAfterUpload}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#FF3B3B",
              color: "#fff",
              border: "none",
              fontWeight: 600,
            }}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}