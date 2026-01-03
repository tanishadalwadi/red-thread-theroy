import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useEffect } from "react";
import { Experience } from "./components/Experience";
import HomeBrain from "./components/HomeBrain";
import StartButton from "./components/StartButton";
import PreStartZoomRig from "./components/PreStartZoomRig.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { Overlay } from "./components/Overlay";
import { usePlay } from "./contexts/Play";
import Viewer360 from "./components/Viewer360.tsx";
import { usePhoto } from "./contexts/PhotoContext";
import * as THREE from "three";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import HomeMake from "./pages/HomeMake.jsx";
import AboutMake from "./pages/AboutMake.jsx";
import InstructionsMake from "./pages/InstructionsMake.jsx";
import UploadMake from "./pages/UploadMake.jsx";
import EndMake from "./pages/EndMake.jsx";
import SelfieSpotCountdown from "./components/SelfieSpotCountdown.jsx";
import GlobalAudio from "./components/GlobalAudio.jsx";

function App() {
  const { play, inMemory, modeChosen, setInMemory } = usePlay();
  const { photo } = usePhoto();
  const selfieTexture = useMemo(() => {
    if (!photo) return null;
    try {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(photo);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    } catch (e) {
      return null;
    }
  }, [photo]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("App: selfie present?", Boolean(photo));
  }, [photo]);

  // Debug/shortcut: press 'M' to enter the memory dome (portal view)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key || "").toLowerCase() === "m") {
        setInMemory(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setInMemory]);

  const effects = useMemo(
    () => (
      <EffectComposer multisampling={2} disableNormalPass>
        <Bloom intensity={0.6} luminanceThreshold={0.45} luminanceSmoothing={0.85} mipmapBlur />
        {/* Noise disabled to avoid flicker */}
      </EffectComposer>
    ),
    []
  );

  // Redirect to home on browser reloads
  function ReloadHomeGuard() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
      // Do not enforce reload redirect during development to avoid interfering with UX
      // Vite's HMR and dev reloads may be detected as 'reload' and cause unwanted redirects.
      if (import.meta.env && import.meta.env.DEV) return;
      try {
        const entries = performance.getEntriesByType("navigation");
        const navType = entries && entries.length ? entries[0].type : (performance.navigation && performance.navigation.type === 1 ? "reload" : "navigate");
        const isReload = navType === "reload";
        if (isReload && location.pathname !== "/") {
          navigate("/", { replace: true });
        }
      } catch (e) {
        // If detection fails, do nothing
      }
      // run once on initial mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  }

  return (
    <>
      <ReloadHomeGuard />
      <Routes>
      {/* Home */}
      <Route path="/" element={<HomeMake />} />
      {/* About */}
      <Route path="/about" element={<AboutMake />} />
      {/* Instructions */}
      <Route path="/instructions" element={<InstructionsMake />} />
      {/* Upload Picture */}
      <Route path="/upload" element={<UploadMake />} />
      {/* End Page (previous UI + animation) */}
      <Route path="/end" element={<EndMake />} />
      {/* Game - EXACTLY as written, no wrappers or changes */}
      <Route
        path="/game"
        element={
          <> 
            {/* Mount audio persistently for both portal and hand/keys modes */}
            <GlobalAudio src="/audio/experience.mp3" volume={0.5} loop />
            {inMemory ? (
              <>
                <Viewer360 photo={photo} />
                <SelfieSpotCountdown />
              </>
            ) : (
              // If not playing and no mode chosen (e.g., after a refresh), redirect to Home.
              !play && !modeChosen ? (
                <Navigate to="/" replace />
              ) : (
                <>
                  <Canvas
                    gl={{
                      alpha: false,
                      antialias: true,
                      powerPreference: "high-performance",
                      logarithmicDepthBuffer: true,
                    }}
                    dpr={[1, 1.5]}
                    style={{ background: "#020113" }}
                  >
                    <color attach="background" args={["#020113"]} />
                    <ErrorBoundary>
                      {/* Keep zoom rig mounted at all times to avoid camera gaps */}
                      <PreStartZoomRig />
                      {play ? (
                        <Experience />
                      ) : modeChosen ? (
                        <>
                          {/* Landing scene: brain + start button */}
                          <HomeBrain />
                          {/* Start button overlaid at the bottom of the Canvas */}
                          {!play && modeChosen && <StartButton />}
                        </>
                      ) : null}
                    </ErrorBoundary>
                    {play && effects}
                  </Canvas>
                  <Overlay />
                </>
              )
            )}
          </>
        }
      />
      </Routes>
    </>
  );
}

export default App;
