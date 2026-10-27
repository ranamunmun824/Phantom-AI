import React, { useEffect, useRef } from 'react';

interface GhostOrbProps {
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GhostOrb: React.FC<GhostOrbProps> = ({ isThinking = false, size = 'md', className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dimension = size === 'sm' ? 80 : size === 'lg' ? 220 : 140;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Dust & ectoplasm particles
    const particles = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * dimension,
      y: Math.random() * dimension,
      radius: Math.random() * 2 + 0.6,
      speedY: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.7 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, dimension, dimension);
      time += isThinking ? 0.05 : 0.015;

      const centerX = dimension / 2;
      const centerY = dimension / 2;
      const baseRadius = dimension * 0.32;

      // Draw outer atmospheric aura
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.2,
        centerX,
        centerY,
        baseRadius * 1.5
      );

      if (isThinking) {
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.85)');
        grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.45)');
        grad.addColorStop(0.8, 'rgba(239, 68, 68, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.75)');
        grad.addColorStop(0.4, 'rgba(147, 51, 234, 0.3)');
        grad.addColorStop(0.8, 'rgba(56, 189, 248, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();

      // Deform orb perimeter using harmonic sines
      const points = 32;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const deform1 = Math.sin(angle * 3 + time) * 4;
        const deform2 = Math.cos(angle * 2 - time * 1.5) * 3;
        const r = baseRadius + deform1 + deform2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Draw floating spectral dust particles
      particles.forEach((p) => {
        p.y -= p.speedY * (isThinking ? 2 : 1);
        if (p.y < 0) p.y = dimension;

        const currentOpacity = (Math.sin(time + p.phase) * 0.5 + 0.5) * p.opacity;
        ctx.fillStyle = isThinking
          ? `rgba(244, 114, 182, ${currentOpacity})`
          : `rgba(216, 180, 254, ${currentOpacity})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central pupil / core singularity
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 0.4
      );
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.5, 'rgba(233, 213, 255, 0.6)');
      coreGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.35 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimension, isThinking]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label="Spectral Ghost Orb Visualization"
    >
      <canvas
        ref={canvasRef}
        width={dimension}
        height={dimension}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
};
