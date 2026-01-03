import React, { useState } from "react";
import Portal from "./components/Portal.tsx";
import Viewer360 from "./components/Viewer360.tsx";

const App: React.FC = () => {
  const [activated, setActivated] = useState(false);
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "radial-gradient(circle at 50% 30%, #1e1b4b, #0b1020)" }}>
      {!activated ? (
        <Portal onActivate={() => setActivated(true)} />
      ) : (
        <Viewer360 />
      )}
    </div>
  );
};

export default App;