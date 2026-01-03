import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function VideoGrid({
  videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  gridSize = 10,
  spacing = 0.75,
  tileScale = 0.5,
  rotateSpeed = 0.15,
  pulseAmplitude = 0.075,
  interactive = true,
  shape = "rect",
  shapeMaskSize = 150,
  ...props
}) {
  const groupRef = useRef();
  // Create the HTMLVideoElement
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = videoSrc;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true; // allow autoplay
    v.playsInline = true;
    // Try to autoplay; some browsers require user gesture
    v.play().catch(() => {});
    return v;
  }, [videoSrc]);

  // Create VideoTexture
  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }, [video]);

  // Heart mask helper (implicit heart curve)
  // Proper heart: two circular lobes + tapered bottom
  const inHeart = (nx, ny) => {
    const x = nx;
    const y = ny;

    // Tunable params for heart proportions
    const lobeOffsetX = 0.55;  // horizontal offset of lobes
    const lobeCenterY = 0.30;  // vertical placement of lobes
    const lobeRadius = 0.58;   // size of lobes

    // Circles for the top lobes
    const left =
      (x + lobeOffsetX) * (x + lobeOffsetX) +
        (y - lobeCenterY) * (y - lobeCenterY) <=
      lobeRadius * lobeRadius;
    const right =
      (x - lobeOffsetX) * (x - lobeOffsetX) +
        (y - lobeCenterY) * (y - lobeCenterY) <=
      lobeRadius * lobeRadius;

    // Tapered bottom to the point
    // As y goes down, allowed |x| shrinks linearly to 0
    const bottom = y < lobeCenterY && Math.abs(x) <= 1.6 * (y + 1.0);

    return left || right || bottom;
  };

  // Heart mask from Hheart.jsx (parametric curve drawn to canvas)
  const heartMask = useMemo(() => {
    if (shape !== "heart") return null;

    const maskSize = shapeMaskSize;
    const canvas = document.createElement("canvas");
    canvas.width = maskSize;
    canvas.height = maskSize;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, maskSize, maskSize);
    ctx.fillStyle = "black";
    ctx.beginPath();

    const centerX = maskSize / 2;
    const centerY = maskSize / 2 + maskSize * 0.035; // matches demo bias
    const size = maskSize / 30; // scale roughly equivalent to demo

    for (let t = 0; t < Math.PI * 2; t += 0.01) {
      const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
      const y =
        centerY -
        size *
          (13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    const data = ctx.getImageData(0, 0, maskSize, maskSize).data;
    return { data, size: maskSize };
  }, [shape, shapeMaskSize]);

  // Build tiles with per-material UV cropping
  const tiles = useMemo(() => {
    const tileRepeatX = 1 / gridSize;
    const tileRepeatY = 1 / gridSize;
    const arr = [];
    const geometry = new THREE.PlaneGeometry(tileScale, tileScale);
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Sample mask to keep only pixels inside the heart
        if (shape === "heart" && heartMask) {
          const mx = Math.floor((x / gridSize) * heartMask.size);
          const my = Math.floor((y / gridSize) * heartMask.size);
          const idx = (my * heartMask.size + mx) * 4;
          const brightness = heartMask.data[idx]; // red channel
          if (brightness >= 128) continue;
        }

        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        mat.transparent = true;
        mat.map.repeat.set(tileRepeatX, tileRepeatY);
        // Flip Y so top-left tile uses top-left of video
        mat.map.offset.set(x * tileRepeatX, 1 - (y + 1) * tileRepeatY);

        const mesh = new THREE.Mesh(geometry, mat);
        mesh.position.x = (x - (gridSize - 1) / 2) * spacing;
        mesh.position.y = (y - (gridSize - 1) / 2) * spacing;
        mesh.position.z = 0;
        arr.push(mesh);
      }
    }
    return { geometry, arr };
  }, [texture, gridSize, spacing, tileScale, shape, heartMask]);

  // Animate rotation and pulsing scale
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * rotateSpeed;
    const s = 1 + Math.sin(t * 2.0) * pulseAmplitude;
    groupRef.current.scale.setScalar(s);
  });

  // Cleanup resources on unmount
  useEffect(() => {
    return () => {
      tiles.arr.forEach((m) => m.material.dispose());
      tiles.geometry.dispose();
      texture.dispose();
      try {
        video.pause();
        video.src = "";
        video.load?.();
      } catch {}
    };
  }, [tiles, texture, video]);

  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      onPointerDown={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }}
      onWheel={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        const dur = video.duration || 0;
        if (dur > 0) {
          const delta = Math.sign(e.deltaY) * 0.25; // scrub by 0.25s per wheel notch
          let next = (video.currentTime || 0) + delta;
          next = Math.max(0, Math.min(dur - 0.01, next));
          video.currentTime = next;
        }
      }}
    >
      {tiles.arr.map((mesh, i) => (
        <primitive object={mesh} key={i} />
      ))}
    </group>
  );
}




