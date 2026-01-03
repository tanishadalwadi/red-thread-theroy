import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

type PhotoContextValue = {
  photo: string | null;
  setPhoto: (url: string | null) => void;
};

const PhotoContext = createContext<PhotoContextValue | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photo, setPhotoState] = useState<string | null>(null);

  // Keep selfie in memory only; revoke previous Blob URL when replaced
  const setPhoto = (url: string | null) => {
    if (photo && photo.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(photo);
      } catch {}
    }
    setPhotoState(url);
  };

  // Revoke Blob URL on provider unmount
  useEffect(() => {
    return () => {
      if (photo && photo.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(photo);
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ photo, setPhoto }), [photo]);

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
};

export const usePhoto = (): PhotoContextValue => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhoto must be used within a PhotoProvider");
  return ctx;
};