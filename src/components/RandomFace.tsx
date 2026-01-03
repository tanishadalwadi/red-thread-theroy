import React, { useState } from "react";
// Safely detect dev mode without requiring vite client types
const isDev = typeof import.meta !== "undefined" && (import.meta as any)?.env?.DEV === true;

type Props = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoaded?: (url: string) => void;
  seed?: number; // used to vary fallback image URL deterministically
};

export function RandomFace({ size = 96, className, style, onLoaded, seed }: Props) {
  const [loading, setLoading] = useState(true);

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    background: "linear-gradient(180deg, #111 0%, #222 100%)",
    ...style,
  };

  // Use Picsum with seed for deterministic, rate-limit-friendly fallbacks
  const fallbackSeed = String(seed ?? Math.floor(Math.random() * 100000));
  const pravatarUrl = `https://i.pravatar.cc/${size}?u=${fallbackSeed}`;
  const picsumUrl = `https://picsum.photos/seed/${fallbackSeed}/${size}/${size}`;
  const [fallbackSrc, setFallbackSrc] = useState<string>(pravatarUrl);

  return (
    <div className={className} style={containerStyle}>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#aaa",
            fontSize: 12,
          }}
        >
          Loading…
        </div>
      )}
      <img
        src={fallbackSrc}
        alt={"Portrait"}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onLoad={() => {
          const final = fallbackSrc;
          if (isDev) {
            console.log("[RandomFace] image loaded", {
              type: "fallback",
              src: final,
            });
          }
          onLoaded?.(final);
          setLoading(false);
        }}
        onError={() => {
          if (fallbackSrc === pravatarUrl) {
            // Try Picsum as secondary fallback if Pravatar fails
            if (isDev) console.warn("[RandomFace] pravatar failed, switching to picsum", { src: pravatarUrl });
            setFallbackSrc(picsumUrl);
            return;
          }
          if (isDev) {
            console.warn("[RandomFace] image error", {
              type: "fallback",
              src: fallbackSrc,
            });
          }
          setLoading(false);
        }}
      />
    </div>
  );
}