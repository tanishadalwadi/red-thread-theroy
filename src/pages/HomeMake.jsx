import { useNavigate } from "react-router-dom";
import "../../Cinematic Landing Page Design/src/index.css";
import { Nav } from "../../Cinematic Landing Page Design/src/components/Nav";
import { Hero } from "../../Cinematic Landing Page Design/src/components/Hero";
import { ConstellationStory } from "../../Cinematic Landing Page Design/src/components/ConstellationStory";

function HomeMake() {
  const navigate = useNavigate();

  return (
    <div className="make-page">
      <Nav
        currentPage="home"
        onNavigate={(page) => {
          if (page === "home") navigate("/");
          if (page === "about") navigate("/about");
        }}
        onPlayClick={() => navigate("/instructions")}
      />
      <div className="make-container make-container--full">
        <Hero onPlayClick={() => navigate("/instructions")} />
        {/* <ConstellationStory /> */}
      </div>
    </div>
  );
}

export default HomeMake;
