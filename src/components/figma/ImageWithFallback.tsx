import React, { useState } from "react";

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  fallback?: string;
};

const ImageWithFallback: React.FC<Props> = ({ src, fallback = "/vite.svg", style, ...rest }) => {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? fallback : (src as string)}
      onError={() => setErr(true)}
      style={style}
      {...rest}
    />
  );
};

export default ImageWithFallback;