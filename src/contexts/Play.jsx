import { createContext, useContext, useState } from "react";

const Context = createContext();

export const PlayProvider = ({ children }) => {
  const [play, setPlay] = useState(false);
  const [end, setEnd] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  // Camera consent: default to disabled so we can focus on keys-only
  // null previously triggered a consent prompt; set false to bypass it
  const [cameraEnabled, setCameraEnabled] = useState(false);
  // Memory mode: when true, show the memory screen instead of the game
  const [inMemory, setInMemory] = useState(false);
  // Mode selection: true after user picks keys or hand gesture
  const [modeChosen, setModeChosen] = useState(false);
  // Control mode: 'hand' or 'keys' after user selection
  const [controlMode, setControlMode] = useState(null);
  // REMOVED: audioMuted state

  const resetToStart = () => {
    // Return to the starting state of the game
    setPlay(false);
    setEnd(false);
    setHasScroll(false);
    setInMemory(false);
    setModeChosen(false);
    setControlMode(null);
    // Leave cameraEnabled as-is; user can re-enable via overlay if needed
  };

  return (
    <Context.Provider
      value={{
        play,
        setPlay,
        end,
        setEnd,
        hasScroll,
        setHasScroll,
        cameraEnabled,
        setCameraEnabled,
        inMemory,
        setInMemory,
        modeChosen,
        setModeChosen,
        controlMode,
        setControlMode,
        resetToStart,
        // REMOVED: audioMuted, setAudioMuted
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const usePlay = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("usePlay must be used within a PlayProvider");
  }
  return context;
}
