import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
// Inicializar serviço de backup automático
import './services/storageService.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
