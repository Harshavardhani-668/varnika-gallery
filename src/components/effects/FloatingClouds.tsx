import { memo, useMemo } from "react";

interface FloatingCloudProps {
  count?: number;
}

const cloudPaths = [
  "M20 40C10 40 5 30 15 25C15 15 25 10 35 15C40 5 55 5 60 15C70 10 80 15 75 25C85 25 85 35 75 40H20Z",
  "M15 35C8 35 5 28 12 24C12 16 20 12 28 16C32 8 44 8 48 16C56 12 64 16 60 24C68 24 68 32 60 35H15Z",
  "M25 50C12 50 8 38 18 32C18 20 30 15 42 20C48 8 68 8 75 20C85 15 97 20 92 32C105 32 105 42 92 50H25Z",
  "M12 32C6 32 4 26 10 22C10 16 16 13 22 16C25 10 35 10 38 16C44 13 50 16 47 22C53 22 53 28 47 32H12Z",
  "M18 38C10 38 7 30 14 26C14 18 22 14 30 18C34 10 46 10 50 18C58 14 66 18 62 26C70 26 70 34 62 38H18Z",
  "M10 28C5 28 3 23 8 20C8 15 13 12 18 14C20 9 28 9 30 14C35 12 40 14 38 20C43 20 43 25 38 28H10Z",
];

const cloudColors = [
  "rgba(251, 209, 211, 0.5)",
  "rgba(159, 129, 205, 0.4)",
  "rgba(235, 178, 214, 0.5)",
  "rgba(184, 230, 184, 0.4)",
  "rgba(255, 182, 193, 0.5)",
  "rgba(221, 160, 221, 0.4)",
];

const FloatingClouds = memo(({ count = 6 }: FloatingCloudProps) => {
  const clouds = useMemo(
    () =>
      Array.from({ length: Math.min(count, 6) }, (_, i) => ({
        id: i,
        path: cloudPaths[i],
        color: cloudColors[i],
        top: `${15 + i * 12}%`,
        duration: `${25 + i * 3}s`,
        delay: `${-i * 5}s`,
        width: 80 + Math.random() * 60,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {clouds.map((cloud) => (
        <svg
          key={cloud.id}
          className="absolute opacity-60"
          style={{
            top: cloud.top,
            left: "-200px",
            width: `${cloud.width}px`,
            height: `${cloud.width * 0.5}px`,
            animation: `cloudFloat ${cloud.duration} linear infinite`,
            animationDelay: cloud.delay,
            willChange: "transform",
          }}
          viewBox="0 0 120 60"
          fill="none"
        >
          <path d={cloud.path} fill={cloud.color} />
        </svg>
      ))}
    </div>
  );
});

FloatingClouds.displayName = "FloatingClouds";
export default FloatingClouds;