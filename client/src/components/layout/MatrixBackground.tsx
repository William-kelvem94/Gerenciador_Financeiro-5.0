import React, { useEffect, useRef } from 'react';

type Props = {
  density?: number; // columns per 1000px (higher = more characters)
  intensity?: number; // 0..1 alpha multiplier for brightness
  enabled?: boolean;
};

const MatrixBackground: React.FC<Props> = ({ density = 1.0, intensity = 0.92, enabled = true }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const resizeTimer = useRef<number | null>(null);
  const runningRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    const fontFamily = "'JetBrains Mono', monospace";
    const baseFontSize = 14; // px at device scale 1

    let widthPx = Math.max(300, window.innerWidth);
    let heightPx = Math.max(200, window.innerHeight);

    const setSize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      widthPx = Math.max(300, window.innerWidth);
      heightPx = Math.max(200, window.innerHeight);
      canvas.width = Math.floor(widthPx * dpr);
      canvas.height = Math.floor(heightPx * dpr);
      canvas.style.width = `${widthPx}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();

    const letters = 'abcdefghijklmnopqrstuvwxyz0123456789あいうえおカタカナアイウエオ!@#$%^&*()';

    const computeColumns = () => Math.max(8, Math.floor((widthPx / baseFontSize) * density));
    let columns = computeColumns();
    let drops: number[] = new Array(columns).fill(0).map(() => Math.random() * (heightPx / baseFontSize));

    const clearAlpha = 0.08 * Math.max(0.08, 1 - intensity * 0.6);

    const draw = () => {
      if (!runningRef.current || !enabled) return;

      // Slight fade for trail effect
      ctx.fillStyle = `rgba(0,0,0,${clearAlpha})`;
      ctx.fillRect(0, 0, widthPx, heightPx);

      ctx.fillStyle = `rgba(124, 252, 176, ${intensity})`;
      ctx.font = `${baseFontSize}px ${fontFamily}`;
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i] ?? 0;
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = i * baseFontSize;
        const y = drop * baseFontSize;
        ctx.fillText(text, x, y);
        const canvasH = heightPx;
        // Reset rarely to create varied streams; intensity influences reset chance
        if (y > canvasH && Math.random() > 0.97 + (1 - intensity) * 0.02) {
          drops[i] = 0;
        }
        drops[i] = (drops[i] || 0) + 0.6 + Math.random() * 0.9;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
      resizeTimer.current = window.setTimeout(() => {
        setSize();
        columns = computeColumns();
        drops = new Array(columns).fill(0).map(() => Math.random() * (heightPx / baseFontSize));
      }, 120);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        runningRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        if (!enabled) return;
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    // Start loop if enabled and page visible
    if (enabled && !document.hidden) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [density, intensity, enabled]);

  return <canvas ref={ref} className="matrix-canvas" aria-hidden />;
};

export default MatrixBackground;
