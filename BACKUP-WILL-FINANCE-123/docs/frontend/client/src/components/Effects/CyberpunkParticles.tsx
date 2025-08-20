import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface CyberpunkParticlesProps {
  count?: number;
  speed?: number;
}

export const CyberpunkParticles: React.FC<CyberpunkParticlesProps> = ({ 
  count = 50, 
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const createParticle = (): Particle => {
      const maxLife = 300 + Math.random() * 200;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 50,
        vx: (Math.random() - 0.5) * speed * 0.5,
        vy: -Math.random() * speed * 2 - 1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: getRandomColor(),
        life: 0,
        maxLife,
      };
    };

    const getRandomColor = (): string => {
      const colors = [
        currentTheme.colors.primary,
        currentTheme.colors.secondary,
        currentTheme.colors.accent,
        currentTheme.colors.neon.glow,
        currentTheme.colors.neon.pulse,
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;

      // Fade out over time
      particle.opacity = Math.max(0, 1 - (particle.life / particle.maxLife));

      // Add some drift
      particle.vx += (Math.random() - 0.5) * 0.02;
      particle.vy += Math.random() * 0.01;

      // Reset particle if it's out of bounds or dead
      if (particle.y < -50 || particle.x < -50 || particle.x > canvas.width + 50 || particle.life >= particle.maxLife) {
        Object.assign(particle, createParticle());
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      
      // Create glow effect
      const glowSize = particle.size * 3;
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glowSize
      );
      
      gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${particle.color}${Math.floor(particle.opacity * 128).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');

      // Draw glow
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw core particle
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Only start animation if particles effect is enabled
    if (currentTheme.effects.particles) {
      initParticles();
      animate();
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, speed, currentTheme]);

  if (!currentTheme.effects.particles) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: 0.6,
        mixBlendMode: 'screen',
      }}
    />
  );
};

// Matrix-style digital rain effect
export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Matrix characters
    const chars = 'ラドクリフ上田ハネムーン01$€¥£₹₽₿アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨランリルレロワヲン';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const animate = () => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = currentTheme.colors.primary;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop randomly or when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Only start if this is matrix theme and particles are enabled
    if (currentTheme.id === 'matrix' && currentTheme.effects.particles) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme]);

  if (currentTheme.id !== 'matrix' || !currentTheme.effects.particles) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: 0.3,
      }}
    />
  );
};

// Cyberpunk grid overlay
export const CyberpunkGrid: React.FC = () => {
  const { currentTheme } = useTheme();

  if (!currentTheme.effects.scanlines) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(${hexToRgb(currentTheme.colors.primary)}, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(${hexToRgb(currentTheme.colors.primary)}, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity: 0.3,
      }}
    />
  );
};

// Utility function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ].join(', ');
};
