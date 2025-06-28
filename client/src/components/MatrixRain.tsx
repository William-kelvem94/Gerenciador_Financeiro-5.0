import React, { useEffect, useRef, useCallback } from 'react';

interface MatrixRainProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  characters: string[];
  opacity: number;
  color: string;
}

export function MatrixRain({ intensity = 'medium', className = '' }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animationRef = useRef<number>();

  // Caracteres financeiros e cyberpunk com bias para números e símbolos
  const financialChars = [
    // Números (bias alto - 40%)
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // duplicado para maior frequência
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // triplicado
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // quadruplicado
    
    // Símbolos financeiros (bias médio - 30%)
    '$', '€', '£', '¥', '₹', '₿', '%', '+', '-', '=',
    '$', '€', '£', '¥', '₹', '₿', '%', '+', '-', '=', // duplicado
    '$', '€', '£', '¥', '₹', '₿', '%', '+', '-', '=', // triplicado
    
    // Símbolos matemáticos e especiais (bias médio - 20%)
    '∑', '∆', '∏', '∞', '√', '±', '≤', '≥', '≠', '≈',
    '∑', '∆', '∏', '∞', '√', '±', '≤', '≥', '≠', '≈', // duplicado
    
    // Katakana e letras (bias baixo - 10%)
    'ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  // Cores cyberpunk vibrantes
  const cyberpunkColors = [
    '#00FFFF', // Cyan neon
    '#39FF14', // Verde neon
    '#FFD700', // Dourado
    '#FF4500', // Laranja neon
    '#FF0080', // Pink neon
    '#8A2BE2', // Roxo neon
    '#00FF41', // Verde Matrix clássico
    '#FFFF00', // Amarelo neon
  ];

  const intensitySettings = {
    low: { dropCount: 15, speed: 0.5 },
    medium: { dropCount: 25, speed: 0.8 },
    high: { dropCount: 40, speed: 1.2 }
  };

  const getRandomChar = useCallback(() => {
    return financialChars[Math.floor(Math.random() * financialChars.length)];
  }, []);

  const getRandomColor = useCallback(() => {
    return cyberpunkColors[Math.floor(Math.random() * cyberpunkColors.length)];
  }, []);

  const createDrop = useCallback((canvas: HTMLCanvasElement): Drop => {
    const charCount = Math.floor(Math.random() * 20) + 10; // 10-30 caracteres por coluna
    const characters = Array.from({ length: charCount }, () => getRandomChar());
    
    return {
      x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
      y: Math.random() * -500, // Começar acima da tela
      speed: (Math.random() * 2 + 1) * intensitySettings[intensity].speed,
      characters,
      opacity: Math.random() * 0.8 + 0.2,
      color: getRandomColor()
    };
  }, [intensity, getRandomChar, getRandomColor]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear com fade effect para rastro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar drops
    dropsRef.current.forEach((drop, index) => {
      // Atualizar posição
      drop.y += drop.speed;

      // Desenhar caracteres da coluna
      drop.characters.forEach((char, charIndex) => {
        const y = drop.y + (charIndex * 20);
        
        if (y > 0 && y < canvas.height + 100) {
          // Efeito de fade - caracteres mais antigos ficam mais transparentes
          const fadeOpacity = Math.max(0, 1 - (charIndex * 0.1));
          
          // Glow effect
          ctx.shadowColor = drop.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = drop.color;
          ctx.globalAlpha = drop.opacity * fadeOpacity;
          ctx.font = '14px "Courier New", monospace';
          ctx.textAlign = 'center';
          
          // Desenhar caractere principal
          ctx.fillText(char, drop.x, y);
          
          // Efeito de brilho adicional no primeiro caractere
          if (charIndex === 0) {
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = drop.opacity * 0.8;
            ctx.fillText(char, drop.x, y);
          }
        }
      });

      // Reset shadow
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Remover drop se saiu da tela
      if (drop.y > canvas.height + 200) {
        dropsRef.current[index] = createDrop(canvas);
      }

      // Ocasionalmente mudar cor para efeito dinâmico
      if (Math.random() < 0.002) {
        drop.color = getRandomColor();
      }

      // Ocasionalmente mudar caracteres para efeito dinâmico
      if (Math.random() < 0.01) {
        const randomIndex = Math.floor(Math.random() * drop.characters.length);
        drop.characters[randomIndex] = getRandomChar();
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [createDrop, getRandomColor, getRandomChar]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recriar drops para nova dimensão
    const dropCount = intensitySettings[intensity].dropCount;
    dropsRef.current = Array.from({ length: dropCount }, () => createDrop(canvas));
  }, [intensity, createDrop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resizeCanvas, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen' // Efeito de blend para cores mais vibrantes
      }}
    />
  );
}
