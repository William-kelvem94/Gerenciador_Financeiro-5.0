import React from 'react';

interface PhoenixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export function PhoenixLogo({ size = 'md', animate = false, className = '' }: PhoenixLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const animationClass = animate ? 'animate-phoenix-pulse' : '';

  return (
    <div className={`${sizeClasses[size]} ${animationClass} ${className} relative`}>
      {/* Glow effect background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 opacity-30 blur-xl animate-pulse"></div>
      
      {/* Circuit board background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g stroke="url(#circuitGrad)" strokeWidth="0.5" fill="none">
            <path d="M20 20 L80 20 L80 40 L60 40" opacity="0.6" />
            <path d="M40 60 L80 60 L80 80 L20 80" opacity="0.4" />
            <path d="M20 40 L40 40 L40 80" opacity="0.5" />
            <circle cx="25" cy="25" r="2" fill="url(#circuitGrad)" opacity="0.8" />
            <circle cx="75" cy="25" r="2" fill="url(#circuitGrad)" opacity="0.8" />
            <circle cx="75" cy="75" r="2" fill="url(#circuitGrad)" opacity="0.8" />
            <circle cx="25" cy="75" r="2" fill="url(#circuitGrad)" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Phoenix SVG - Based on your provided image */}
      <svg
        viewBox="0 0 200 200"
        className="relative z-10 w-full h-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="phoenixMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4500" />
            <stop offset="20%" stopColor="#FF6500" />
            <stop offset="40%" stopColor="#FF8500" />
            <stop offset="60%" stopColor="#FFA500" />
            <stop offset="80%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFF700" />
          </linearGradient>
          
          <linearGradient id="phoenixWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B22222" />
            <stop offset="30%" stopColor="#DC143C" />
            <stop offset="60%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          
          <linearGradient id="phoenixBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="25%" stopColor="#DC143C" />
            <stop offset="50%" stopColor="#FF4500" />
            <stop offset="75%" stopColor="#FF8C00" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>

          <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4500" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF8500" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.4" />
          </linearGradient>

          <filter id="phoenixGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <pattern id="diamondPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <polygon points="5,0 10,5 5,10 0,5" fill="url(#phoenixMainGrad)" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Phoenix Wings - Spread wide */}
        <g filter="url(#phoenixGlow)">
          {/* Left Wing */}
          <path
            d="M100 90 
               Q70 70 40 50 
               Q20 40 10 25 
               Q15 20 25 15 
               Q35 20 50 30 
               Q70 45 85 70 
               Q90 80 100 90"
            fill="url(#phoenixWingGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
            opacity="0.9"
          />
          
          {/* Right Wing */}
          <path
            d="M100 90 
               Q130 70 160 50 
               Q180 40 190 25 
               Q185 20 175 15 
               Q165 20 150 30 
               Q130 45 115 70 
               Q110 80 100 90"
            fill="url(#phoenixWingGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
            opacity="0.9"
          />
          
          {/* Wing Details/Feathers */}
          <path d="M50 40 Q45 35 40 30" stroke="url(#phoenixMainGrad)" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M55 50 Q50 45 45 40" stroke="url(#phoenixMainGrad)" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M60 60 Q55 55 50 50" stroke="url(#phoenixMainGrad)" strokeWidth="2" fill="none" opacity="0.8"/>
          
          <path d="M150 40 Q155 35 160 30" stroke="url(#phoenixMainGrad)" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M145 50 Q150 45 155 40" stroke="url(#phoenixMainGrad)" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M140 60 Q145 55 150 50" stroke="url(#phoenixMainGrad)" strokeWidth="2" fill="none" opacity="0.8"/>
        </g>

        {/* Phoenix Body - Diamond shaped like in the image */}
        <g filter="url(#phoenixGlow)">
          <path
            d="M100 60 
               L85 90 
               L100 130 
               L115 90 
               Z"
            fill="url(#phoenixBodyGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="2"
          />
          
          {/* Diamond pattern overlay */}
          <path
            d="M100 60 
               L85 90 
               L100 130 
               L115 90 
               Z"
            fill="url(#diamondPattern)"
          />
        </g>

        {/* Phoenix Head */}
        <g filter="url(#phoenixGlow)">
          <circle
            cx="100"
            cy="50"
            r="15"
            fill="url(#phoenixMainGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
          />
          
          {/* Eyes */}
          <circle cx="95" cy="47" r="3" fill="#FFD700" />
          <circle cx="105" cy="47" r="3" fill="#FFD700" />
          <circle cx="95" cy="47" r="1" fill="#8B0000" />
          <circle cx="105" cy="47" r="1" fill="#8B0000" />
        </g>

        {/* Phoenix Flame Crest - Multiple flames */}
        <g filter="url(#phoenixGlow)">
          <path
            d="M100 30 
               Q95 20 90 10 
               Q95 15 100 20 
               Q105 15 110 10 
               Q105 20 100 30"
            fill="url(#phoenixMainGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
          />
          
          <path
            d="M100 35 
               Q97 25 94 15 
               Q97 20 100 25 
               Q103 20 106 15 
               Q103 25 100 35"
            fill="url(#phoenixMainGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
            opacity="0.8"
          />
        </g>

        {/* Phoenix Tail Flames - Rising from body */}
        <g filter="url(#phoenixGlow)">
          <path
            d="M100 130 
               Q90 140 85 155 
               Q90 150 100 145 
               Q110 150 115 155 
               Q110 140 100 130"
            fill="url(#phoenixMainGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
          />
          
          <path
            d="M100 145 
               Q93 155 88 170 
               Q93 165 100 160 
               Q107 165 112 170 
               Q107 155 100 145"
            fill="url(#phoenixMainGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
            opacity="0.7"
          />
          
          <path
            d="M100 160 
               Q96 170 92 185 
               Q96 180 100 175 
               Q104 180 108 185 
               Q104 170 100 160"
            fill="url(#phoenixMainGrad)"
            stroke="url(#phoenixMainGrad)"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      </svg>
      
      {/* Animated flame particles */}
      {animate && (
        <>
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-orange-500 rounded-full animate-flame-particle-1 opacity-70"></div>
          <div className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full animate-flame-particle-2 opacity-60"></div>
          <div className="absolute -bottom-2 left-1 w-2 h-2 bg-yellow-500 rounded-full animate-flame-particle-3 opacity-80"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-flame-particle-4 opacity-50"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-flame-particle-5 opacity-90"></div>
          <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-red-400 rounded-full animate-flame-particle-6 opacity-40"></div>
        </>
      )}
      
      {/* Circuit data streams */}
      {animate && (
        <>
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-circuit-flow-1 opacity-30"></div>
            <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent animate-circuit-flow-2 opacity-30"></div>
          </div>
        </>
      )}
    </div>
  );
}
