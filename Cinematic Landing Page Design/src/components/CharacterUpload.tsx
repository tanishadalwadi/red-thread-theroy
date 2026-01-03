import { motion } from "motion/react";
import { Camera, User, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePhoto } from "../../../src/contexts/PhotoContext";

interface CharacterUploadProps {
  controlMethod: "keyboard" | "gesture";
  onBack: () => void;
  onBackToHome: () => void;
  onSkip?: () => void;
}

export function CharacterUpload({
  controlMethod,
  onBack,
  onBackToHome,
  onSkip,
}: CharacterUploadProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"none" | "camera" | "file">(
    "none"
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setPhoto } = usePhoto();

  const startCamera = async () => {
    try {
      setCameraError(null);
      setUploadMethod("camera");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
      });
      // Store the stream and render the video by flipping the UI state first
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setCameraError(
            "Camera access denied. Please allow camera access to continue."
          );
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError("Unable to access camera.");
        }
      }
      setUploadMethod("none");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      // Clear srcObject to release element
      // @ts-ignore - srcObject exists on HTMLVideoElement
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setUploadMethod("none");
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        // Also store as Blob URL in PhotoContext for memory-only use in game
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              setPhoto(blobUrl);
              // eslint-disable-next-line no-console
              console.log("Upload: setPhoto from camera capture", {
                blobUrl,
                size: blob.size,
                type: blob.type,
              });
            } else {
              // eslint-disable-next-line no-console
              console.log("Upload: camera capture produced no blob");
            }
          }, "image/png");
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log("Upload: failed to create Blob URL from camera", err);
        }
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // UI preview keeps current data URL approach
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setUploadMethod("file");
        setCameraError(null);
      };
      reader.readAsDataURL(file);

      // Store temporary selfie via Blob URL in PhotoContext (memory-only)
      try {
        const blobUrl = URL.createObjectURL(file);
        setPhoto(blobUrl);
        // eslint-disable-next-line no-console
        console.log("Upload: setPhoto with Blob URL", {
          name: file.name,
          size: file.size,
          type: file.type,
          blobUrl,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("Upload: failed to create Blob URL", err);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraError(null);
    setUploadMethod("none");
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // When camera is active and we have a stream, attach it to the video element
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      // @ts-ignore - srcObject exists on HTMLVideoElement
      video.srcObject = streamRef.current;
      video.muted = true;
      video.setAttribute("playsinline", "true");
      const play = async () => {
        try {
          await video.play();
        } catch {}
      };
      play();
    }
  }, [isCameraActive]);

  // Center card: use symmetric vertical padding so content centers cleanly
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-8 py-12 md:py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#081124] to-[#050d1f]" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 150 }).map((_, i) => {
          const size = Math.random() * 2.5;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                boxShadow: `0 0 ${size * 3}px ${
                  size * 0.5
                }px rgba(255,255,255,0.6)`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Shooting stars */}
        {[1, 2, 3].map((n) => (
          <motion.div
            key={n}
            className="absolute"
            style={{ top: `${10 + n * 15}%`, left: `${70 + n * 5}%` }}
            animate={{
              x: [0, 300],
              y: [0, 150],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 4 + n * 2,
              ease: "easeOut",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-white"
              style={{
                boxShadow:
                  "0 0 20px 4px rgba(255,255,255,0.9), -100px 0 40px 10px rgba(255,255,255,0.3)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl"
      >
        {/* Removed top Back/Home nav buttons to prevent header area from clipping */}

        {/* Main Card */}
        {/* Spacing fix: increase top padding on the main card so header/controls never clip */}
        <div
          /* Reduce vertical padding; keep visual polish */
          className="relative pt-12 md:pt-14 px-8 md:px-10 pb-10 md:pb-12 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 overflow-hidden md:overflow-visible"
          style={{
            boxShadow:
              "0 20px 60px 0 rgba(31, 38, 135, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-12"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3B3B] to-transparent" />

          <div
            className="relative z-10 min-h-[520px] md:min-h-[560px]"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <h2
                className="mb-3"
                style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900 }}
              >
                Create Your <span className="text-[#FF3B3B]">Character</span>
              </h2>
              <p className="text-white/70 text-lg">
                Upload your image to begin your journey through Threadscape
              </p>
              <div className="mt-4 inline-block px-4 py-2 rounded-full bg-white/5 border border-white/20 text-sm text-white/60">
                {controlMethod === "keyboard"
                  ? "⌨️ Keyboard Controls"
                  : "✋ Hand Gesture Controls"}
              </div>
            </motion.div>

            {/* Upload Area + Actions in two-column desktop layout */}
            <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 md:mb-0"
            >
              {/* Hidden canvas for capturing photo */}
              <canvas ref={canvasRef} style={{ display: "none" }} />
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!isCameraActive && !capturedImage ? (
                <div className="space-y-4">
                  {/* Camera option + upload alternative */}
                  <motion.div
                    onClick={startCamera}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") startCamera();
                    }}
                    className="relative p-8 md:p-10 rounded-2xl border-2 border-dashed border-white/30 hover:border-[#FF3B3B]/50 focus:outline-none focus:ring-2 focus:ring-[#FF3B3B]/30 transition-all duration-300 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FF3B3B]/20 to-[#FF3B3B]/5 border border-[#FF3B3B]/30 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Camera size={28} className="text-[#FF3B3B]" />
                      </motion.div>
                      <h3 className="mb-2 text-white">Open Camera</h3>
                      <p className="text-white/60 text-sm">
                        Click to open camera
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadClick();
                          }}
                          className="ml-2 underline decoration-dotted underline-offset-4 text-white/70 hover:text-white"
                        >
                          or upload a photo
                        </button>
                      </p>
                    </div>
                  </motion.div>

                  {/* Error message */}
                  {cameraError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
                    >
                      <p className="text-sm text-red-300 text-center">
                        {cameraError}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : isCameraActive ? (
                // Camera is active - Show video preview
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <div className="relative aspect-square w-full max-w-md md:max-w-lg mx-auto rounded-2xl overflow-hidden border-2 border-[#FF3B3B]/50">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Camera overlay guide */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Corner guides */}
                      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#FF3B3B]/60 rounded-tl-lg" />
                      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#FF3B3B]/60 rounded-tr-lg" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#FF3B3B]/60 rounded-bl-lg" />
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#FF3B3B]/60 rounded-br-lg" />

                      {/* Center text */}
                      <div className="absolute top-8 left-0 right-0 text-center">
                        <div className="inline-block px-4 py-2 rounded-full backdrop-blur-xl bg-black/40 border border-white/20">
                          <p className="text-white text-sm">
                            Position your face in the frame
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Capture button */}
                  <div className="flex justify-center gap-4 mt-6">
                    <motion.button
                      onClick={stopCamera}
                      className="px-6 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      onClick={capturePhoto}
                      className="relative px-8 py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-[#FF3B3B]/90 to-[#ff1f1f]/90 border border-[#FF3B3B]/50 text-white overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        boxShadow: "0 4px 16px 0 rgba(255, 59, 59, 0.4)",
                      }}
                    >
                      <Camera size={20} className="inline mr-2" />
                      <span
                        style={{
                          fontFamily: "Orbitron, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Capture Photo
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                // Photo captured - Show preview
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-[#FF3B3B]/50">
                    <img
                      src={capturedImage!}
                      alt="Captured selfie"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <motion.button
                    onClick={retakePhoto}
                    className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={16} />
                    Retake Photo
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 flex-wrap md:self-start"
            >
              {/* Back Button */}
              <motion.button
                onClick={onBack}
                className="flex-1 px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className="text-xl"
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Back
                </span>
              </motion.button>

              {/* Skip Selfie Button */}
              <motion.button
                onClick={onSkip}
                className="flex-1 px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className="text-xl"
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Skip Selfie
                </span>
              </motion.button>

              {/* Continue Button */}
              <motion.button
                disabled={!capturedImage}
                className={`flex-1 px-6 py-4 rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                  capturedImage
                    ? "bg-gradient-to-r from-[#FF3B3B]/90 to-[#ff1f1f]/90 border border-[#FF3B3B]/50 text-white cursor-pointer"
                    : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                }`}
                whileHover={capturedImage ? { scale: 1.03, y: -2 } : {}}
                whileTap={capturedImage ? { scale: 0.98 } : {}}
                style={{
                  boxShadow: capturedImage
                    ? "0 8px 32px 0 rgba(255, 59, 59, 0.4)"
                    : "none",
                }}
              >
                {capturedImage && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    }}
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span
                  className="relative z-10 text-xl"
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Continue
                </span>
              </motion.button>
            </motion.div>

            {/* Disabled-state helper text */}
            {!capturedImage && (
              <p className="mt-2 text-center md:text-left text-white/60 text-sm">
                Enable Continue by taking a selfie or uploading a photo
              </p>
            )}
            </div>

            {/* Info badges */}
            {/* Footer badges: nudge down slightly for clearer separation from card edge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pb-6 md:pb-8 flex items-center justify-center gap-4 text-sm text-white/70"
            >
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Your character</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div>Secure upload</div>
            </motion.div>
          </div>
        </div>

        {/* Bottom constellation decoration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <svg
            width="200"
            height="80"
            viewBox="0 0 200 80"
            className="mx-auto opacity-30"
          >
            <defs>
              <filter id="upload-constellation-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[
              { x: 40, y: 40 },
              { x: 80, y: 30 },
              { x: 100, y: 50 },
              { x: 120, y: 30 },
              { x: 160, y: 40 },
            ].map((point, i) => (
              <g key={i} filter="url(#upload-constellation-glow)">
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill={i === 2 ? "#FF3B3B" : "#fff"}
                />
              </g>
            ))}

            <line
              x1="40"
              y1="40"
              x2="80"
              y2="30"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="80"
              y1="30"
              x2="100"
              y2="50"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="50"
              x2="120"
              y2="30"
              stroke="rgba(255, 59, 59, 0.4)"
              strokeWidth="1"
            />
            <line
              x1="120"
              y1="30"
              x2="160"
              y2="40"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
