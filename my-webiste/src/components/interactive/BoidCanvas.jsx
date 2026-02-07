import { useRef, useEffect } from "react";

function BoidCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const boidsRef = useRef([]);
  return <canvas className="boid-canvas" />;
}

export default BoidCanvas;
