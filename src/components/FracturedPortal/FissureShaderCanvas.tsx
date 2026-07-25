import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export const FissureShaderCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { shaderQuality, portalTheme } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for dynamic light shimmer
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const isMirror = portalTheme === 'lustrzany';

    // Light nodes corresponding to the centers of the 7 shards
    const lightNodes = [
      { xPct: 0.15, yPct: 0.28, color: isMirror ? '#020617' : '#a855f7', radiusPct: 0.22, intensity: 0.8 }, // CZATY
      { xPct: 0.48, yPct: 0.22, color: isMirror ? '#334155' : '#38bdf8', radiusPct: 0.28, intensity: 0.9 }, // ŚCIANA
      { xPct: 0.82, yPct: 0.25, color: isMirror ? '#0f172a' : '#f43f5e', radiusPct: 0.22, intensity: 0.85 }, // REELS
      { xPct: 0.16, yPct: 0.68, color: isMirror ? '#1e293b' : '#10b981', radiusPct: 0.20, intensity: 0.75 }, // GRUPY
      { xPct: 0.82, yPct: 0.65, color: isMirror ? '#0f172a' : '#06b6d4', radiusPct: 0.20, intensity: 0.8 }, // GRY
      { xPct: 0.40, yPct: 0.85, color: isMirror ? '#334155' : '#f59e0b', radiusPct: 0.22, intensity: 0.85 }, // WYDARZENIA
      { xPct: 0.78, yPct: 0.88, color: isMirror ? '#020617' : '#eab308', radiusPct: 0.20, intensity: 0.8 }  // PROFIL
    ];

    // Particles along ambient light field
    const particles = Array.from({ length: shaderQuality === 'high' ? 35 : 15 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * (isMirror ? 2.5 : 2) + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      color: isMirror ? '#ffffff' : lightNodes[Math.floor(Math.random() * lightNodes.length)].color
    }));

    let startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) * 0.001;

      // Lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Background canvas
      ctx.fillStyle = isMirror ? '#dbe4ee' : '#07090e';
      ctx.fillRect(0, 0, width, height);

      // 1. Render Diffused Shard Light Emitters underneath
      lightNodes.forEach(node => {
        const cx = node.xPct * width;
        const cy = node.yPct * height;
        const baseRadius = Math.min(width, height) * node.radiusPct;
        const pulse = Math.sin(elapsed * 1.2 + cx) * 0.08 + 1.0;
        const radius = baseRadius * pulse;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        if (isMirror) {
          grad.addColorStop(0, `${node.color}66`); 
          grad.addColorStop(0.5, `${node.color}22`);
          grad.addColorStop(1, 'transparent');
        } else {
          grad.addColorStop(0, `${node.color}55`); // 33% opacity
          grad.addColorStop(0.4, `${node.color}22`);
          grad.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Mouse Glow Light
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, isMirror ? 320 : 250);
      if (isMirror) {
        mouseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        mouseGrad.addColorStop(0.4, 'rgba(15, 23, 42, 0.15)');
        mouseGrad.addColorStop(1, 'transparent');
      } else {
        mouseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        mouseGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
        mouseGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = mouseGrad;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, isMirror ? 320 : 250, 0, Math.PI * 2);
      ctx.fill();

      // 3. Floating Ember Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (Math.sin(elapsed * 2 + p.x) * 0.3 + 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shaderQuality]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
