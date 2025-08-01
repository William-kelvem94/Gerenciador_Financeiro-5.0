import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Cyberpunk loading animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-400/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-cyan-400 text-lg font-mono tracking-wider animate-pulse">
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {/* Cyberpunk grid effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full opacity-10">
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              return (
                <div
                  key={`grid-cell-${row}-${col}`}
                  className="border border-cyan-400/20"
                  style={{
                    animationDelay: `${(i * 0.1) % 2}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { LoadingScreen };
export default LoadingScreen;
