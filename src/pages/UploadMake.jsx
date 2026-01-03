import { useNavigate } from "react-router-dom";
import "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/styles/globals.css";
import "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/index.css";
import { CharacterUpload } from "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/components/CharacterUpload";
import { usePlay } from "../contexts/Play";

function UploadMake() {
  const navigate = useNavigate();
  const { controlMode } = usePlay();

  return (
    <div
      className="make-page"
      onClick={(e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const btn = target.closest("button");
        if (!btn) return;
        const label = (btn.textContent || "").toLowerCase();
        const isDisabled = btn.matches(":disabled");
        if (label.includes("continue") && !isDisabled) {
          navigate("/game");
        }
      }}
    >
      <div className="make-container w-full">
        <CharacterUpload
          controlMethod={
            controlMode === "hand"
              ? "gesture"
              : "keyboard"
          }
          onBack={() => navigate("/instructions")}
          onBackToHome={() => navigate("/")}
          onSkip={() => navigate("/game")}
        />
      </div>
    </div>
  );
}

export default UploadMake;
