'use client';

import { useEffect, useRef } from 'react';

interface CrtStaticProps {
  className?: string;
}

export default function CrtStatic({ className = '' }: CrtStaticProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const resize = () => {
      // Scale down canvas dimensions for a blockier, pixelated 90s aesthetic
      // and much higher performance.
      canvas.width = Math.floor(canvas.clientWidth / 3.5) || 160;
      canvas.height = Math.floor(canvas.clientHeight / 3.5) || 120;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      
      offset = (offset + 1.5) % h;

      for (let y = 0; y < h; y++) {
        // Create a moving noise band representing typical CRT sync interference
        const isInBand1 = Math.abs(y - offset) < 15;
        const isInBand2 = Math.abs(y - (offset - h/2)) < 10;
        const inInterference = isInBand1 || isInBand2;

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          
          // Generate raw white/black static
          let val = Math.random() * 255;
          
          if (inInterference) {
            // Stronger white/black contrast in sync interference bands
            val = Math.random() > 0.5 ? 245 : 10;
          } else {
            // Normal static grain, slightly tinted gray-blue
            val = 50 + Math.random() * 160;
          }

          data[idx] = val;         // R
          data[idx + 1] = val;     // G
          data[idx + 2] = val + 10; // B (slightly cool phosphor blue tint)
          data[idx + 3] = 255;     // A
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none z-30 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
