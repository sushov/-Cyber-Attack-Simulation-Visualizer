// src/NetworkCanvas.jsx
import React, { useEffect, useRef } from "react";

const ATTACK_LIFETIME_MS = 2600;

export default function NetworkCanvas({ servers, attacks, activeTargets }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      // Make canvas resolution match CSS size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrameId;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const now = Date.now();

      ctx.clearRect(0, 0, width, height);

      // Draw faint connections between servers (optional)
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
      servers.forEach((s1, i) => {
        for (let j = i + 1; j < servers.length; j++) {
          const s2 = servers[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 0.12) {
            ctx.beginPath();
            ctx.moveTo(s1.x * width, s1.y * height);
            ctx.lineTo(s2.x * width, s2.y * height);
            ctx.stroke();
          }
        }
      });
      ctx.restore();

      // Draw attacks (animated, fading)
      attacks.forEach((attack) => {
        const age = now - attack.startedAt;
        if (age > ATTACK_LIFETIME_MS) return;

        const t = age / ATTACK_LIFETIME_MS; // 0 -> 1
        const opacity = 1 - t;
        const lineWidth = 2 + (1 - t) * 3;

        const sx = attack.source.x * width;
        const sy = attack.source.y * height;
        const tx = attack.target.x * width;
        const ty = attack.target.y * height;

        // Animate beam drawing
        const progressX = sx + (tx - sx) * Math.min(1, t * 1.5);
        const progressY = sy + (ty - sy) * Math.min(1, t * 1.5);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(progressX, progressY);
        ctx.strokeStyle = hexToRgba(attack.color, opacity);
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = attack.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      });

      // Draw servers (nodes)
      servers.forEach((server) => {
        const x = server.x * width;
        const y = server.y * height;
        const isTarget = activeTargets.has(server.id);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, isTarget ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isTarget ? "#ef4444" : "#22c55e";
        ctx.shadowColor = isTarget ? "#ef4444" : "#22c55e";
        ctx.shadowBlur = isTarget ? 15 : 6;
        ctx.fill();

        // Outer ring
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.5)";
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [servers, attacks, activeTargets]);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} className="network-canvas" />
      <div className="canvas-label">Simulated Network Topology</div>
    </div>
  );
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
