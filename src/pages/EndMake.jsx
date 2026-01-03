import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { usePlay } from "../contexts/Play";
import { usePhoto } from "../contexts/PhotoContext";
import "../index.css";

function EndMake() {
  const navigate = useNavigate();
  const { resetToStart } = usePlay();
  const { setPhoto } = usePhoto();

  const restart = () => {
    try {
      resetToStart();
    } catch {}
    try {
      setPhoto(null);
    } catch {}
    try {
      navigate("/", { replace: true });
      window.setTimeout(() => {
        try {
          window.location.reload();
        } catch {}
      }, 50);
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <div className="end-page make-ui page-route-fade">
      {/* Video background matching cinematic home */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }} aria-hidden>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        >
          <source
            src="https://res.cloudinary.com/dbo5rxyp9/video/upload/v1764537628/unicorn-1764536100841_pcnjxf.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
          }}
        />
        {/* Deep space gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10,14,39,0.4), rgba(13,19,51,0.4), rgba(8,17,36,0.6))",
          }}
        />
        {/* Stars layer */}
        <div style={{ position: "absolute", inset: 0 }} aria-hidden>
          {Array.from({ length: 150 }).map((_, i) => {
            const size = Math.random() * 2.5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 5;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `${left}%`,
                  top: `${top}%`,
                  background: "white",
                  boxShadow: `0 0 ${size * 3}px ${
                    size * 0.5
                  }px rgba(255,255,255,0.6)`,
                }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                transition={{
                  duration: 4,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
          {/* Shooting star */}
          <motion.div
            style={{ position: "absolute", top: "15%", left: "70%" }}
            animate={{ x: [0, 300], y: [0, 150], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "easeOut",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: "white",
                boxShadow:
                  "0 0 20px 4px rgba(255,255,255,0.9), -100px 0 40px 10px rgba(255,255,255,0.3)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Initial flash: 0 - 0.8s */}
      <div aria-hidden className="end-flash" style={{ zIndex: 1 }} />

      {/* Radial burst: 0 - 1.5s */}
      <div aria-hidden className="end-burst" style={{ zIndex: 1 }} />

      {/* Main card enters at 0.8s */}
      <div
        className="glass-card anim-card-in"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* Logo appears at 1s */}
        <div
          className="anim-logo"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            className="brand-gradient-text"
            style={{ fontSize: 42, fontFamily: "DM Serif Display" }}
          >
            Threadscape
          </div>
        </div>
        {/* Logo underline at 1.3s */}
        <div className="brand-underline" />

        {/* Badge at 1.6s */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 18,
            fontFamily: "Inter",
          }}
        >
          <div className="badge make-status-pill">JOURNEY COMPLETE</div>
        </div>

        {/* Quote reveals at 2s */}
        <div className="anim-quote" style={{ marginTop: 26 }}>
          <div
            className="make-body"
            style={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              fontFamily: "Inter",
            }}
          >
            "We are born with an invisible red thread linking us to the people
            we're meant to meet.
          </div>
          <div
            className="make-body"
            style={{
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginTop: 6,
              fontFamily: "Inter",
            }}
          >
            No matter the path, the thread always leads us to them."
          </div>
          {/* Thank you text within same animation block */}
          <div style={{ marginTop: 22, textAlign: "center" }}>
            <div
              className="make-body"
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                fontFamily: "Inter",
              }}
            >
              Your journey has brought you here.
            </div>
            <div
              className="make-body"
              style={{
                color: "#ff5566",
                fontSize: 16,
                marginTop: 6,
                fontFamily: "Inter",
              }}
            >
              The thread has led you home.
            </div>
          </div>
        </div>

        {/* Divider at 2.5s */}
        <div className="quote-divider" style={{ marginTop: 22 }} />

        {/* Button appears at 4s */}
        <div
          className="anim-button"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 28,
            fontFamily: "Inter",
          }}
        >
          <button onClick={restart} className="cta-button">
            Begin Another Journey
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndMake;
