import { useEffect, useMemo, useRef } from "react";

interface FloatingDecor {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
  background: string;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export default function HeroScene3D() {
  const rootRef = useRef<HTMLDivElement>(null);

  const decorations = useMemo<FloatingDecor[]>(
    () => [
      {
        id: 1,
        top: "18%",
        left: "72%",
        size: "120px",
        delay: "0s",
        duration: "10s",
        background: "linear-gradient(145deg, rgba(245, 198, 208, 0.25), rgba(200, 169, 106, 0.22))",
      },
      {
        id: 2,
        top: "54%",
        left: "12%",
        size: "96px",
        delay: "1.6s",
        duration: "12s",
        background: "linear-gradient(145deg, rgba(181, 216, 204, 0.20), rgba(212, 184, 224, 0.22))",
      },
      {
        id: 3,
        top: "70%",
        left: "68%",
        size: "84px",
        delay: "0.8s",
        duration: "11s",
        background: "linear-gradient(145deg, rgba(248, 232, 208, 0.24), rgba(200, 169, 106, 0.20))",
      },
    ],
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let frameId = 0;

    const setPointer = (x: number, y: number) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", clamp01(x).toFixed(4));
        root.style.setProperty("--pointer-y", clamp01(y).toFixed(4));
      });
    };

    const handlePointerMove = (event: MouseEvent) => {
      setPointer(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
    };

    const handlePointerLeave = () => {
      setPointer(0.5, 0.5);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.gamma !== "number" || typeof event.beta !== "number") {
        return;
      }

      const normalizedX = (event.gamma + 30) / 60;
      const normalizedY = (event.beta + 45) / 90;
      setPointer(normalizedX, normalizedY);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseout", handlePointerLeave, { passive: true });

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseout", handlePointerLeave);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
        "--pointer-x": "0.5",
        "--pointer-y": "0.5",
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,169,106,0.13),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(245,198,208,0.15),transparent_50%),radial-gradient(circle_at_50%_85%,rgba(181,216,204,0.12),transparent_55%)]" />

      <div
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{
          left: "calc(var(--pointer-x) * 100% - 8rem)",
          top: "calc(var(--pointer-y) * 100% - 8rem)",
          background: "radial-gradient(circle, rgba(200,169,106,0.22), rgba(245,198,208,0.08) 65%, transparent 100%)",
          transition: "left 160ms ease-out, top 160ms ease-out",
        }}
      />

      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          transform:
            "translate(-50%, -50%) perspective(900px) rotateX(calc((var(--pointer-y) - 0.5) * -10deg)) rotateY(calc((var(--pointer-x) - 0.5) * 12deg))",
          transformStyle: "preserve-3d",
          transition: "transform 180ms ease-out",
        }}
      >
        <div className="hero-depth-card hero-depth-card-back">
          <div className="hero-depth-ribbon" />
        </div>
        <div className="hero-depth-card hero-depth-card-main">
          <div className="hero-depth-ribbon" />
          <div className="hero-depth-ribbon hero-depth-ribbon-vertical" />
          <div className="hero-depth-shine" />
        </div>
        <div className="hero-depth-card hero-depth-card-front">
          <div className="hero-depth-ribbon" />
        </div>
      </div>

      {decorations.map((item) => (
        <div
          key={item.id}
          className="absolute rounded-3xl border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
          style={{
            top: item.top,
            left: item.left,
            width: item.size,
            height: item.size,
            background: item.background,
            animationName: "heroFloat",
            animationDuration: item.duration,
            animationDelay: item.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            backdropFilter: "blur(3px)",
            transform: "translate3d(calc((var(--pointer-x) - 0.5) * 16px), calc((var(--pointer-y) - 0.5) * 12px), 0)",
            transition: "transform 180ms ease-out",
          }}
        />
      ))}

      <div className="absolute top-[22%] left-[22%] text-[1.6rem] font-light tracking-[0.24em] opacity-45" style={{ animation: "heroPulse 4s ease-in-out infinite" }}>
        *
      </div>
      <div className="absolute top-[66%] left-[82%] text-[1.5rem] font-light tracking-[0.2em] opacity-40" style={{ animation: "heroPulse 4.6s ease-in-out infinite" }}>
        *
      </div>

      <style>{`
        .hero-depth-card {
          position: absolute;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.34);
          box-shadow: 0 20px 45px rgba(56, 43, 51, 0.14);
          overflow: hidden;
          backdrop-filter: blur(5px);
          transform-style: preserve-3d;
        }

        .hero-depth-card-main {
          width: 210px;
          height: 250px;
          margin-left: -105px;
          margin-top: -125px;
          background: linear-gradient(145deg, rgba(245, 198, 208, 0.75), rgba(212, 184, 224, 0.72));
          transform: translate3d(0, 0, 70px) rotate(-3deg);
        }

        .hero-depth-card-back {
          width: 178px;
          height: 210px;
          margin-left: -175px;
          margin-top: -88px;
          background: linear-gradient(145deg, rgba(181, 216, 204, 0.58), rgba(232, 213, 183, 0.50));
          transform: translate3d(-58px, -24px, -10px) rotate(-14deg);
        }

        .hero-depth-card-front {
          width: 170px;
          height: 196px;
          margin-left: 30px;
          margin-top: -28px;
          background: linear-gradient(145deg, rgba(248, 232, 208, 0.70), rgba(200, 169, 106, 0.44));
          transform: translate3d(72px, 18px, 42px) rotate(12deg);
        }

        .hero-depth-ribbon {
          position: absolute;
          inset: 42% 0 auto 0;
          height: 14%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.32), rgba(200, 169, 106, 0.48));
        }

        .hero-depth-ribbon-vertical {
          inset: 0 auto 0 43%;
          width: 14%;
          height: auto;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), rgba(200, 169, 106, 0.52));
        }

        .hero-depth-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(130deg, rgba(255, 255, 255, 0.58), transparent 42%);
          mix-blend-mode: soft-light;
        }

        @keyframes heroFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -16px, 0) rotate(3deg); }
        }

        @keyframes heroPulse {
          0%, 100% { transform: scale(1); opacity: 0.28; }
          50% { transform: scale(1.08); opacity: 0.5; }
        }

        @media (max-width: 900px) {
          .hero-depth-card-main {
            width: 170px;
            height: 205px;
            margin-left: -85px;
            margin-top: -102px;
          }

          .hero-depth-card-back {
            width: 145px;
            height: 175px;
            margin-left: -146px;
            margin-top: -70px;
            transform: translate3d(-50px, -18px, -6px) rotate(-14deg);
          }

          .hero-depth-card-front {
            width: 140px;
            height: 164px;
            margin-left: 22px;
            margin-top: -22px;
            transform: translate3d(58px, 14px, 34px) rotate(12deg);
          }
        }

        @media (max-width: 640px) {
          .hero-depth-card-main {
            width: 144px;
            height: 178px;
            margin-left: -72px;
            margin-top: -89px;
          }

          .hero-depth-card-back {
            width: 124px;
            height: 152px;
            margin-left: -126px;
            margin-top: -58px;
          }

          .hero-depth-card-front {
            width: 118px;
            height: 140px;
            margin-left: 14px;
            margin-top: -16px;
          }
        }
      `}</style>
    </div>
  );
}
