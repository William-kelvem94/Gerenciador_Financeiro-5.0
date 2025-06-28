import { useState } from 'react';
import { X, Send, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoenixLogo } from './PhoenixLogo';
import { n8nService } from '../services/n8nService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIChatbot({ isOpen, onToggle }: Readonly<ChatbotProps>) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '🔥 Olá! Sou a Fênix, sua assistente financeira IA. Como posso te ajudar hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Tentar usar a IA real primeiro
      const aiResponse = await n8nService.sendMessage(currentInput);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse ?? getBotResponse(currentInput),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Erro na IA:', error);
      
      // Fallback para resposta local
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(currentInput),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Respostas informais
    if (lowerInput.includes('oi') || lowerInput.includes('olá') || lowerInput.includes('hey')) {
      return '🔥 Oi! Sou a Fênix, sua assistente financeira pessoal! Estou aqui para ajudar com suas finanças. Como vai?';
    }
    
    if (lowerInput.includes('como vai') || lowerInput.includes('tudo bem')) {
      return '😊 Estou ótima, obrigada! Sempre pronta para ajudar você a organizar suas finanças. E você, como estão seus planos financeiros?';
    }
    
    if (lowerInput.includes('obrigado') || lowerInput.includes('obrigada') || lowerInput.includes('valeu')) {
      return '� De nada! É um prazer ajudar. Se precisar de mais alguma coisa sobre suas finanças, estarei aqui!';
    }
    
    // Respostas financeiras específicas
    if (lowerInput.includes('extrato') || lowerInput.includes('import')) {
      return '�📊 Posso te ajudar com a importação de extratos! Suporto Bradesco, Banco do Brasil, Itaú, Nubank, Santander, Inter, C6 Bank e mais. Quer que eu analise seu extrato? Vá em "Importar/Exportar" e envie seu arquivo!';
    }
    
    if (lowerInput.includes('gasto') || lowerInput.includes('despesa')) {
      return '💰 Vou analisar seus gastos! Com base nos dados do sistema, posso identificar padrões, categorias que mais consomem seu orçamento e sugerir otimizações. Quer uma análise detalhada das suas categorias de gastos?';
    }
    
    if (lowerInput.includes('investimento') || lowerInput.includes('aplicação')) {
      return '📈 Baseado no seu perfil financeiro e histórico, posso sugerir estratégias de investimento personalizadas. Vamos analisar sua reserva de emergência e perfil de risco primeiro?';
    }
    
    if (lowerInput.includes('orçamento') || lowerInput.includes('planejamento')) {
      return '🎯 Posso criar um orçamento personalizado baseado nos seus hábitos financeiros atuais! Vamos definir metas para cada categoria de gastos?';
    }
    
    if (lowerInput.includes('meta') || lowerInput.includes('objetivo')) {
      return '🏆 Que legal! Definir metas financeiras é fundamental. Posso ajudar você a criar metas realistas e acompanhar seu progresso. Qual é seu objetivo principal?';
    }
    
    if (lowerInput.includes('conta') || lowerInput.includes('banco')) {
      return '🏦 Posso ajudar você a organizar suas contas bancárias no sistema! Você pode adicionar múltiplas contas e eu vou consolidar todas as informações para um controle completo.';
    }
    
    return '🔥 Entendi! Como sua assistente financeira, posso ajudar com: análise de gastos, importação de extratos, planejamento de orçamento, definição de metas, sugestões de investimentos e muito mais. Sobre o que específico você gostaria de conversar?';
  };

  const quickActions = [
    { icon: TrendingUp, text: 'Analisar Gastos', action: () => setInputValue('Analise meus gastos este mês') },
    { icon: Zap, text: 'Importar Extrato', action: () => setInputValue('Como importar extrato bancário?') },
    { icon: Sparkles, text: 'Sugestões IA', action: () => setInputValue('Me dê sugestões de economia') }
  ];

  return (
    <>
      {/* Botão Flutuante da Fênix */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full shadow-lg flex items-center justify-center text-white hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 z-50 overflow-hidden border-2 border-orange-400"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 20px rgba(255, 140, 0, 0.5)' 
            : '0 0 15px rgba(255, 140, 0, 0.3)' 
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <PhoenixLogo size="sm" animate={true} />
          )}
        </motion.div>
        
        {/* Pulso suave */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-yellow-400/20 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-orange-500/40 rounded-xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Header com Fênix */}
            <div className="flex items-center justify-between p-4 border-b border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <PhoenixLogo size="md" animate={true} />
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 blur animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Fênix IA</h3>
                  <p className="text-orange-400 text-sm">Assistente Financeira Inteligente</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto h-80 space-y-4 scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-gray-800/30">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-2 max-w-xs">
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0 mt-1">
                        <PhoenixLogo size="sm" />
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-700/80 text-gray-100 border border-gray-600/50'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <PhoenixLogo size="sm" />
                    <div className="bg-gray-700/80 text-gray-100 px-4 py-3 rounded-2xl border border-gray-600/50">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Fênix está pensando</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-orange-500/20 bg-gray-800/30">
              <div className="flex space-x-2 mb-2">
                {quickActions.map((action) => (
                  <button
                    key={action.text}
                    onClick={action.action}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-orange-400 text-xs transition-all duration-200 hover:scale-105"
                  >
                    <action.icon className="h-3 w-3" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-orange-500/20 bg-gray-800/30">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pergunte sobre suas finanças..."
                  className="flex-1 bg-gray-700/70 text-white px-4 py-3 rounded-xl border border-gray-600/50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm placeholder-gray-400 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatbot;
