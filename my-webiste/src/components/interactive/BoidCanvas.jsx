import { useRef, useEffect, useCallback } from "react";
import Boid from "../../utils/boid";
import ColorManager from "../../utils/colorManager";

function BoidCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const boidsRef = useRef([]);
  const colorManagerRef = useRef(new ColorManager());
  const frameCountRef = useRef(0);
  const debugModeRef = useRef(false);

  const initBoids = useCallback((width, height, count = 100) => {
    const boids = [];

    for (let i = 0; i < count; i++) {
      boids.push(
        new Boid(Math.random() * width, Math.random() * height, width, height),
      );
    }
    boidsRef.current = boids;
  }, []);

  const addBoidsGradually = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (boidsRef.current.length < 75 && frameCountRef.current % 120 === 0) {
      const newBoid = new Boid(
        canvas.width / 2 + Math.random() * 50 - 25,
        canvas.height / 2 + Math.random() * 50 - 25,
        canvas.width,
        canvas.height,
      );

      boidsRef.current.push(newBoid);
    }
  }, []);

  const drawBoid = useCallback((ctx, boid) => {
    const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
    const speed = boid.velocity.magnitude();

    try {
      const color = colorManagerRef.current.getSpeedColor(speed, boid.maxSpeed);
      const rgbColor = color.to("srgb");

      ctx.save();
      ctx.translate(boid.position.x, boid.position.y);
      ctx.rotate(angle);

      ctx.fillStyle = rgbColor.toString();
      ctx.shadowBlur = 10;
      ctx.shadowColor = rgbColor.toString();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-15, 5);
      ctx.lineTo(-15, -5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } catch {
      ctx.save();
      ctx.translate(boid.position.x, boid.position.y);
      ctx.rotate(angle);

      ctx.fillStyle = "#558cf4";

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-15, 5);
      ctx.lineTo(-15, -5);
      ctx.closePath();
      ctx.fill();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const boids = boidsRef.current;

    frameCountRef.current += 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    addBoidsGradually();

    for (const boid of boids) {
      boid.flock(boids);
      boid.update();
      boid.edges();
      drawBoid(ctx, boid);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [drawBoid, addBoidsGradually]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (boidsRef.current.length === 0) {
        initBoids(canvas.width, canvas.height);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) [cancelAnimationFrame(animationRef.current)];
    };
  }, [animate, initBoids]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "d") {
        debugModeRef.current = !debugModeRef.current;
        console.log("Debug Mode:", debugModeRef.current);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  return <canvas ref={canvasRef} className="boid-canvas" />;
}

export default BoidCanvas;
