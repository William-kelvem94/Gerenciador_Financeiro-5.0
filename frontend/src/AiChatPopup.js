import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from 'axios';
import './AiChatPopup.css';
const AiChatPopup = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'ia', text: 'Olá! Sou sua assistente financeira. Como posso te ajudar hoje?' }
    ]);
    const [input, setInput] = useState('');
    const sendMessage = async () => {
        if (!input.trim())
            return;
        setMessages([...messages, { from: 'user', text: input }]);
        setInput('');
        try {
            const res = await axios.post('/api/ia-chat', { message: input });
            setMessages(msgs => [...msgs, { from: 'ia', text: res.data.reply }]);
        }
        catch (e) {
            setMessages(msgs => [...msgs, { from: 'ia', text: 'Erro ao conectar com a IA.' }]);
        }
    };
    return (_jsxs("div", { className: `ai-chat-popup${open ? ' open' : ''}`, children: [_jsx("button", { className: "ai-chat-icon", onClick: () => setOpen(o => !o), children: _jsx("span", { role: "img", "aria-label": "IA", children: "\uD83E\uDD16" }) }), open && (_jsxs("div", { className: "ai-chat-window", children: [_jsx("div", { className: "ai-chat-messages", children: messages.map((msg, i) => (_jsx("div", { className: `ai-chat-msg ai-chat-msg-${msg.from}`, children: msg.text }, i))) }), _jsxs("div", { className: "ai-chat-input", children: [_jsx("input", { value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === 'Enter' && sendMessage(), placeholder: "Digite sua mensagem..." }), _jsx("button", { onClick: sendMessage, children: "Enviar" })] })] }))] }));
};
export default AiChatPopup;
