import { memo, useMemo } from "react";

interface SparkleProps {
  count?: number;
}

const SparkleParticles = memo(({ count = 20 }: SparkleProps) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 4,
        delay: `${Math.random() * 4}s`,
        duration: `${2 + Math.random() * 3}s`,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold/40 animate-sparkle-pulse"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
});

SparkleParticles.displayName = "SparkleParticles";
export default SparkleParticles;