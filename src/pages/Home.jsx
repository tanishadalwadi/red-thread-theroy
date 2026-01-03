import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontFamily: "DM Serif Display", color: "#fff", margin: 0 }}>Red Thread Theory</h1>
      <p style={{ fontFamily: "Inter", color: "#cfd8dc", maxWidth: 720 }}>
        A cinematic, interactive journey. Start on the home page, explore the about
        section, upload a picture to personalize, then dive into the 3D experience.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link to="/about" style={{ color: "#ff1744", fontFamily: "Inter" }}>About</Link>
        <Link to="/upload" style={{ color: "#ff1744", fontFamily: "Inter" }}>Upload</Link>
        <Link to="/play" style={{ color: "#fff", background: "#ff1744", padding: "10px 14px", borderRadius: 8, textDecoration: "none", fontFamily: "Inter", fontWeight: 600 }}>Play</Link>
      </div>
    </div>
  );
}