import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function TestApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Will Finance 5.0 - Test</h1>
      <p>If you see this, React is working correctly!</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
