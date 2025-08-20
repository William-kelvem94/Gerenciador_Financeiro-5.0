import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<main style={{padding:'2rem',textAlign:'center'}}><h1>Bem-vindo ao Will Finance 5.0 Frontend 🚀</h1></main>} />
    </Routes>
  );
}

export default App;
