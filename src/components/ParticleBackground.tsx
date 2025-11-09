// src/components/ParticleBackground.tsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 2 },
            },
          },
          particles: {
            number: { value: 90, density: { enable: true, area: 800 } },
            color: { value: ["#ffffff", "#ffd700"] }, // white + gold
            opacity: {
              value: 0.6,
              random: true,
              animation: { enable: true, speed: 0.5, minimumValue: 0.2 },
            },
            size: { value: { min: 1, max: 3 }, random: true },
            move: {
              enable: true,
              speed: 0.8,
              direction: "none",
              random: false,
              straight: false,
              outModes: { default: "out" },
            },
            links: {
              enable: true,
              distance: 130,
              color: "#ffd700",
              opacity: 0.25,
              width: 1,
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticleBackground;
