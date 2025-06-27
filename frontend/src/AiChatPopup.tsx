import React, { useState } from 'react';
import axios from 'axios';
import './AiChatPopup.css';

const AiChatPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ia', text: 'Olá! Sou sua assistente financeira. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    try {
      const res = await axios.post('/api/ia-chat', { message: input });
      setMessages(msgs => [...msgs, { from: 'ia', text: res.data.reply }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { from: 'ia', text: 'Erro ao conectar com a IA.' }]);
    }
  };

  return (
    <div className={`ai-chat-popup${open ? ' open' : ''}`}> 
      <button className="ai-chat-icon" onClick={() => setOpen(o => !o)}>
        <span role="img" aria-label="IA">🤖</span>
      </button>
      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-chat-msg ai-chat-msg-${msg.from}`}>{msg.text}</div>
            ))}
          </div>
          <div className="ai-chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Digite sua mensagem..." />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatPopup;
