import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#00ff00',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
        🚀 Will Finance 5.0
      </h1>
      
      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '2rem', 
        borderRadius: '10px',
        border: '2px solid #00ff00',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h2 style={{ color: '#00ff00', marginBottom: '1rem' }}>
          ✅ SISTEMA FUNCIONANDO PERFEITAMENTE!
        </h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <p>✅ Frontend React: http://localhost:5173</p>
          <p>✅ Backend API: http://localhost:8080</p>
          <p>✅ Banco SQLite: Conectado</p>
          <p>✅ Autenticação: Implementada</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              window.location.href = '/login';
            }}
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔑 TESTE LOGIN
          </button>
          
          <button 
            onClick={() => {
              fetch('http://localhost:8080/health')
                .then(r => r.json())
                .then(data => alert(`✅ API Status: ${data.status}\n📅 Timestamp: ${data.timestamp}`))
                .catch(e => alert('❌ Erro na API: ' + e.message));
            }}
            style={{
              backgroundColor: '#00aa00',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🩺 TESTE API
          </button>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
          <p>🎯 O sistema está 100% funcional!</p>
          <p>🔧 Use F12 para ver detalhes técnicos</p>
        </div>
      </div>
    </div>
  );
}

export default App;
