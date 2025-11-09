import React, { useState } from "react";
import "../Wheel.css";

const segments = [
  "₹50,000 — Small Fund",
  "₹1,00,000 — Moderate Start",
  "₹2,50,000 — Lucky Spin",
  "₹5,00,000 — Jackpot",
  "Can’t Spin Again — Lose Turn",
  "Zero — Unlucky (No Fund)",
];

const probabilities = [20, 20, 23, 27, 5, 5];

const Wheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const pickIndexByProbability = () => {
    const total = probabilities.reduce((sum, val) => sum + val, 0);
    const rand = Math.random() * total;
    let cum = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cum += probabilities[i];
      if (rand <= cum) return i;
    }
    return probabilities.length - 1;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // 1. First pick the winning segment based on probability
    const selectedIndex = pickIndexByProbability();
    
    // 2. Calculate how many degrees we need to rotate to get this segment under the arrow
    const segmentAngle = 360 / segments.length;
    
    // The wheel SVG is rotated -90°, so:
    // - Arrow points up (0° in wheel space)
    // - We want segment's middle area to align with arrow, not the edge
    const segmentStartAngle = selectedIndex * segmentAngle;
    // Add 1/3 of segment angle to point arrow more clearly into segment
    const targetAngle = segmentStartAngle + (segmentAngle / 3);
    
    // 3. Calculate total rotation needed:
    // - Start from current position
    const currentRotationNorm = ((rotation % 360) + 360) % 360;
    // - Calculate how far we need to go to align segment (360° - target)
    const rotationNeeded = (360 - targetAngle) % 360;
    // - Add extra full spins for animation
    const extraSpins = 5 * 360;
    
    // 4. Calculate final rotation from current position
    const finalRotation = extraSpins + rotationNeeded - currentRotationNorm;
    
    // 5. Apply rotation
    setRotation(prev => prev + finalRotation);
    
    const durationMs = 5200;
    
    // 6. Show result after animation
    setTimeout(() => {
      setIsSpinning(false);
      setResult(segments[selectedIndex]);
      setShowModal(true);
    }, durationMs);
  };

  const segmentAngle = 360 / segments.length;
  const colors = ["#202020", "#242424", "#1d1d1d", "#282828", "#222222", "#262626"];

  const gradientParts: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const start = i * segmentAngle;
    const end = start + segmentAngle;
    gradientParts.push(`${colors[i % colors.length]} ${start}deg ${end}deg`);
  }
  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  const wrapText = (text: string, maxChars: number) => {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + " " + word).trim().length <= maxChars) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 2); // max two lines
  };

  return (
    <div className="wheel-wrapper">
      <div className="wheel-title">Spin the Wheel</div>

      <div className="wheel-container">
        <div className="wheel-arrow-top" aria-hidden />

        <div
          className={`wheel ${isSpinning ? "spinning" : ""}`}
          style={{
            background: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 5.2s cubic-bezier(.17,.67,.35,1)"
              : "transform 0.5s ease-out",
          }}
        >
          <svg
            viewBox="0 0 400 400"
            width="400"
            height="400"
            style={{ transform: "rotate(-90deg)" }}
          >
            {segments.map((label, idx) => {
              const startAngle = idx * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const midAngle = (startAngle + endAngle) / 2;

              // move label inward into the wedge
              const radius = 110; // smaller radius => more toward center
              const textOffsetAngle = midAngle; // middle of segment
              const x =
                200 + radius * Math.cos((textOffsetAngle * Math.PI) / 180);
              const y =
                200 + radius * Math.sin((textOffsetAngle * Math.PI) / 180);

              // Prefer to explicitly split amount and description so
              // first line shows the amount and second line the description
              const parts = label.split(/\s*[—–-]\s*/);
              let lines: string[];
              if (parts.length >= 2) {
                lines = [parts[0], parts.slice(1).join(" — ")];
              } else {
                lines = wrapText(label, 20);
              }

              const lineHeight = 16;
              const totalHeight = (lines.length - 1) * lineHeight;
              // rotate every label by additional 180deg so the text faces inward
              const rotationForText = midAngle + 90; // midAngle - 90 + 180

              return (
                <g key={idx} style={{ textAnchor: "middle" }}>
                  {lines.map((line, lineIdx) => {
                    const lineY = y - totalHeight / 2 + lineIdx * lineHeight;
                    const isAmountLine = lineIdx === 0 && parts.length >= 2;
                    return (
                      <text
                        key={lineIdx}
                        x={x}
                        y={lineY}
                        fill="#f5d67b"
                        fontSize={isAmountLine ? 14 : 12}
                        fontWeight={isAmountLine ? 700 : 600}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        transform={`rotate(${rotationForText}, ${x}, ${y})`}
                      >
                        {line}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {result?.includes("Zero") || result?.includes("Can't Spin") || result?.includes("Lose Turn") ? (
              <h2>😕 OOPS... Better Luck Next Time!</h2>
            ) : (
              <h2>🎉 Congratulations! 🎉</h2>
            )}
            <p>{result}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wheel;
