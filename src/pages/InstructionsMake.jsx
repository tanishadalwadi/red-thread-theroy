import { useNavigate } from "react-router-dom";
import "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/styles/globals.css";
import "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/index.css";
import { PlayModal } from "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/components/PlayModal";
import { usePlay } from "../contexts/Play";

function InstructionsMake() {
  const navigate = useNavigate();
  const { setModeChosen, setControlMode } = usePlay();

  return (
    <div className="make-page">
      <PlayModal
        isOpen={true}
        onClose={() => navigate("/")}
        onSelectControl={(method) => {
          setModeChosen(true);
          setControlMode(method === "keyboard" ? "keys" : "hand");
          navigate("/upload");
        }}
      />
    </div>
  );
}

export default InstructionsMake;