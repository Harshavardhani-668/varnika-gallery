import { useState, useCallback, memo } from "react";

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  curveX: number;
}

const EMOJIS = ["🎁", "✨", "💖", "🎉"];
let emojiId = 0;

const EmojiFlow = memo(({ enabled = true }: { enabled?: boolean }) => {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      const id = ++emojiId;
      const emoji: FloatingEmoji = {
        id,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: e.clientX,
        y: e.clientY,
        rotation: Math.random() * 60 - 30,
        curveX: (Math.random() - 0.5) * 80,
      };
      setEmojis((prev) => [...prev, emoji]);
      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== id));
      }, 2000);
    },
    [enabled]
  );

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-auto"
      style={{ zIndex: 50 }}
      onClick={handleClick}
    >
      {emojis.map((e) => (
        <span
          key={e.id}
          className="fixed text-2xl select-none pointer-events-none"
          style={{
            left: e.x,
            top: e.y,
            transform: `rotate(${e.rotation}deg)`,
            animation: `emojiFloat 1.8s ease-out forwards`,
            "--curve-x": `${e.curveX}px`,
          } as React.CSSProperties}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
});

EmojiFlow.displayName = "EmojiFlow";
export default EmojiFlow;
