import React, { useEffect, useRef } from 'react';

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - mix of financial symbols, numbers, and code
    const characters = [
      // Financial symbols
      '$', '€', '£', '¥', '₹', '₽', '₿', '%', '+', '-', '=',
      // Numbers
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      // Alphanumeric
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      // Code-like symbols
      '{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '|', ';', ':',
      '.', ',', '?', '!', '@', '#', '&', '*', '^', '~', '`',
    ];

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    // Color variations for different types of data
    const colors = [
      'rgba(0, 255, 65, 0.8)',    // Classic green
      'rgba(0, 200, 255, 0.6)',   // Cyan (accent color)
      'rgba(255, 215, 0, 0.4)',   // Gold (financial)
      'rgba(255, 100, 100, 0.3)', // Red (losses)
      'rgba(100, 255, 100, 0.5)', // Light green (profits)
    ];

    const draw = () => {
      // Create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Fira Code', 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Select random character
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Select color based on character type
        let color = colors[0]; // default green
        if (['$', '€', '£', '¥', '₹', '₽', '₿'].includes(char)) {
          color = colors[2]; // gold for currency
        } else if (['+', '='].includes(char)) {
          color = colors[4]; // light green for profits
        } else if (['-'].includes(char)) {
          color = colors[3]; // red for losses
        } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(char)) {
          color = colors[1]; // cyan for numbers
        }

        ctx.fillStyle = color;
        ctx.fillText(char, i * fontSize, drops[i]);

        // Reset drop randomly or when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
};
