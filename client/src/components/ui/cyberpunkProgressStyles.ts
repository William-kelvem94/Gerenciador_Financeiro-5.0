export const cyberpunkProgressStyles = `
  @keyframes scan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes data-stream {
    0% { transform: translateX(-100%) scaleY(1); }
    50% { transform: translateX(0%) scaleY(0.8); }
    100% { transform: translateX(100%) scaleY(1); }
  }
  
  .animate-scan {
    animation: scan 2s infinite linear;
  }
  
  .animate-data-stream {
    animation: data-stream 1.5s infinite ease-in-out;
  }
`;
