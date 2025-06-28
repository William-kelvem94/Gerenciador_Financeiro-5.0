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

export function MatrixRain({ intensity = 'medium', className = '' }: Readonly<MatrixRainProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animationRef = useRef<number>();

  // Caracteres Matrix originais + financeiros
  const financialChars = [
    // Números (bias alto - Matrix usa muitos números)
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    
    // Katakana Matrix original
    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
    'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
    
    // Símbolos financeiros
    '$', '€', '£', '¥', '₿', '%', '+', '-', '=',
    
    // Letras (algumas)
    'A', 'B', 'C', 'D', 'E', 'F', 'Z', 'X', 'Y'
  ];

  // Cores Matrix mais originais
  const cyberpunkColors = [
    '#00FF41', // Verde Matrix clássico (principal)
    '#00FF41', // Verde Matrix (duplicado para maior frequência)
    '#00FF41', // Verde Matrix (triplicado)
    '#39FF14', // Verde neon
    '#00FFFF', // Cyan neon
    '#FFFFFF', // Branco (pontos de destaque)
    '#80FF00', // Verde limão
    '#00FF80', // Verde aqua
  ];

  const intensitySettings = {
    low: { dropCount: 30, speed: 0.8 },
    medium: { dropCount: 60, speed: 1.2 },
    high: { dropCount: 120, speed: 1.8 }
  };

  const getRandomChar = useCallback(() => {
    return financialChars[Math.floor(Math.random() * financialChars.length)];
  }, []);

  const getRandomColor = useCallback(() => {
    return cyberpunkColors[Math.floor(Math.random() * cyberpunkColors.length)];
  }, []);

  const createDrop = useCallback((canvas: HTMLCanvasElement): Drop => {
    const charCount = Math.floor(Math.random() * 25) + 15; // 15-40 caracteres por coluna (Matrix style)
    const characters = Array.from({ length: charCount }, () => getRandomChar());
    
    return {
      x: Math.floor(Math.random() * (canvas.width / 12)) * 12, // Colunas mais próximas
      y: Math.random() * -500, // Começar acima da tela
      speed: (Math.random() * 3 + 2) * intensitySettings[intensity].speed,
      characters,
      opacity: Math.random() * 0.7 + 0.3, // Mais opaco
      color: getRandomColor()
    };
  }, [intensity, getRandomChar, getRandomColor]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear com rastro mais sutil (Matrix original)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar drops
    dropsRef.current.forEach((drop, index) => {
      // Atualizar posição
      drop.y += drop.speed;

      // Desenhar caracteres da coluna
      drop.characters.forEach((char, charIndex) => {
        const y = drop.y + (charIndex * 14); // Espaçamento menor para densidade Matrix original
        
        if (y > 0 && y < canvas.height + 100) {
          // Efeito de fade - caracteres mais antigos ficam mais transparentes
          const fadeOpacity = Math.max(0, 1 - (charIndex * 0.1));
          
          // Efeito Matrix original - sem blur excessivo
          ctx.shadowColor = drop.color;
          ctx.shadowBlur = 3; // Glow sutil como no Matrix original
          ctx.fillStyle = drop.color;
          ctx.globalAlpha = drop.opacity * fadeOpacity;
          ctx.font = 'bold 13px "Courier New", monospace'; // Fonte Matrix original
          ctx.textAlign = 'center';
          
          // Desenhar caractere principal
          ctx.fillText(char, drop.x, y);
          
          // Efeito de brilho no primeiro caractere (como Matrix original)
          if (charIndex === 0) {
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = drop.opacity * 0.9; // Mais brilhante
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
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen',
        zIndex: 1
      }}
    />
  );
}
