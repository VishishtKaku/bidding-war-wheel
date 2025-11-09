import React from "react";
import ParticlesBackground from "./components/ParticleBackground";
import Wheel from "./components/Wheel";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <ParticlesBackground />
      <div className="content">
        <h1 className="event-title">BIDDING WARS</h1>
        <Wheel />
      </div>
    </div>
  );
};

export default App;

