import { useNavigate } from "react-router-dom";
import "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/styles/globals.css";
import "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/index.css";
import { Nav } from "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/components/Nav";
import { About } from "/Users/tanishadalwadi/red-threadtheroy/Cinematic Landing Page Design/src/components/About";

function AboutMake() {
  const navigate = useNavigate();

  return (
    <div className="make-page">
      <Nav
        currentPage="about"
        onNavigate={(page) => {
          if (page === "home") navigate("/");
          if (page === "about") navigate("/about");
        }}
        onPlayClick={() => navigate("/instructions")}
      />
      <div className="make-container">
        <About />
      </div>
    </div>
  );
}

export default AboutMake;