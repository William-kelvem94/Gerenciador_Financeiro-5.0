import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Psychology,
  Send,
  Mic,
  MicOff,
  TrendingUp,
  AttachMoney,
  Lightbulb,
  Analytics,
  School,
  AutoAwesome,
  Clear,
  Share,
} from '@mui/icons-material';

// Componente de Mensagem
const MessageBubble = ({ message, theme }: { message: Message; theme: any }) => (
  <Fade in timeout={500}>
    <Box
      display="flex"
      justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
      mb={2}
    >
      <Box display="flex" alignItems="flex-start" maxWidth="80%">
        {message.sender === 'ai' && (
          <Avatar
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              mr: 1,
              width: 32,
              height: 32,
            }}
          >
            <Psychology fontSize="small" />
          </Avatar>
        )}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            bgcolor: message.sender === 'user' 
              ? theme.palette.primary.main 
              : theme.palette.background.paper,
            color: message.sender === 'user' 
              ? theme.palette.primary.contrastText 
              : theme.palette.text.primary,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.text}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
            {message.timestamp.toLocaleTimeString()}
          </Typography>
        </Paper>
        {message.sender === 'user' && (
          <Avatar
            sx={{ 
              bgcolor: theme.palette.secondary.main, 
              ml: 1,
              width: 32,
              height: 32,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              U
            </Typography>
          </Avatar>
        )}
      </Box>
    </Box>
  </Fade>
);

// Componente de Sugestões
const SuggestionsGrid = ({ 
  quickSuggestions, 
  theme, 
  handleSuggestionClick, 
  showSuggestions 
}: { 
  quickSuggestions: Suggestion[]; 
  theme: any; 
  handleSuggestionClick: (suggestion: Suggestion) => void;
  showSuggestions: boolean;
}) => (
  <Fade in={showSuggestions}>
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2} display="flex" alignItems="center">
          <AutoAwesome sx={{ mr: 1, color: theme.palette.primary.main }} />
          Sugestões Rápidas
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={2}>
          {quickSuggestions.map((suggestion) => (
            <Box key={suggestion.id} sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '280px' }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    bgcolor: theme.palette.primary.main + '10',
                  },
                }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.primary.main + '20',
                      color: theme.palette.primary.main,
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {suggestion.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {suggestion.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {suggestion.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'chart' | 'suggestion' | 'analysis';
  data?: any;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'budget' | 'investment' | 'saving' | 'analysis';
}

const AiPage: React.FC = () => {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Estados
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou sua assistente financeira com IA. Como posso te ajudar hoje? Posso analisar seus gastos, sugerir melhorias no orçamento, ou responder perguntas sobre finanças pessoais.',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Sugestões rápidas
  const quickSuggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Analisar Gastos',
      description: 'Analisar meus gastos do último mês',
      icon: <Analytics />,
      category: 'analysis',
    },
    {
      id: '2',
      title: 'Melhorar Orçamento',
      description: 'Como posso otimizar meu orçamento?',
      icon: <TrendingUp />,
      category: 'budget',
    },
    {
      id: '3',
      title: 'Dicas de Economia',
      description: 'Dicas para economizar mais dinheiro',
      icon: <Lightbulb />,
      category: 'saving',
    },
    {
      id: '4',
      title: 'Investimentos',
      description: 'Sugestões de investimentos para iniciantes',
      icon: <AttachMoney />,
      category: 'investment',
    },
  ];

  // Scroll automático para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular resposta da IA
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay

    // Respostas baseadas em palavras-chave
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('gastos') || lowerMessage.includes('despesas')) {
      return 'Analisando seus gastos... Baseado nos seus dados, vejo que você gastou R$ 3.200 no último mês. Suas principais categorias de gasto foram:\n\n• Alimentação: R$ 850 (26.5%)\n• Transporte: R$ 420 (13.1%)\n• Moradia: R$ 1.200 (37.5%)\n• Lazer: R$ 280 (8.7%)\n\nRecomendo reduzir gastos com alimentação em 15% para otimizar seu orçamento.';
    }
    
    if (lowerMessage.includes('orçamento')) {
      return 'Para otimizar seu orçamento, sugiro a regra 50-30-20:\n\n• 50% para necessidades (moradia, alimentação, transporte)\n• 30% para desejos (lazer, compras não essenciais)\n• 20% para poupança e investimentos\n\nSeu orçamento atual está gastando 65% em necessidades. Vamos trabalhar para equilibrar melhor.';
    }
    
    if (lowerMessage.includes('economia') || lowerMessage.includes('economizar')) {
      return '💡 Aqui estão 5 dicas para economizar mais:\n\n1. **Planeje refeições**: Evite delivery e cozinhe mais em casa\n2. **Revise assinaturas**: Cancele serviços não utilizados\n3. **Compare preços**: Use apps de comparação antes de comprar\n4. **Transporte inteligente**: Use transporte público ou carona\n5. **Meta de economia**: Defina um valor mensal para poupar\n\nImplementando essas dicas, você pode economizar até R$ 300/mês!';
    }
    
    if (lowerMessage.includes('investir') || lowerMessage.includes('investimento')) {
      return '📈 Para iniciantes em investimentos, recomendo:\n\n**Reserva de Emergência** (Primeiro passo)\n• 3-6 meses de gastos em poupança/CDB\n\n**Investimentos Iniciais:**\n• Tesouro Direto (baixo risco)\n• CDB/LCI/LCA (médio risco)\n• Fundos de Índice (longo prazo)\n\n**Dica:** Comece investindo 10% da renda e aumente gradualmente. Diversifique sempre!';
    }
    
    return 'Entendi sua pergunta! Como assistente financeira, posso te ajudar com análises de gastos, planejamento orçamentário, dicas de economia e sugestões de investimento. Pode me fazer perguntas mais específicas sobre suas finanças que terei prazer em ajudar! 😊';
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const aiResponse = await simulateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Usar sugestão rápida
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
  };

  // Limpar conversa
  const handleClearChat = () => {
    setMessages([{
      id: '1',
      text: 'Conversa limpa! Como posso te ajudar agora?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    }]);
    setShowSuggestions(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom display="flex" alignItems="center">
            <Psychology sx={{ mr: 2, color: theme.palette.primary.main }} />
            Assistente Financeira IA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sua consultora financeira pessoal com inteligência artificial
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Tooltip title="Limpar conversa">
            <IconButton onClick={handleClearChat}>
              <Clear />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compartilhar">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sugestões Rápidas */}
      <SuggestionsGrid 
        quickSuggestions={quickSuggestions} 
        theme={theme} 
        handleSuggestionClick={handleSuggestionClick} 
        showSuggestions={showSuggestions} 
      />

      {/* Chat Container */}
      <Card elevation={2} sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            bgcolor: theme.palette.background.default,
          }}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} theme={theme} />
          ))}
          
          {isLoading && (
            <Box display="flex" justifyContent="flex-start" mb={2}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    mr: 1,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Psychology fontSize="small" />
                </Avatar>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: '20px 20px 20px 5px',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Analisando...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Divider />
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              placeholder="Digite sua pergunta sobre finanças..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              maxRows={3}
              variant="outlined"
              size="small"
              disabled={isLoading}
            />
            
            <Tooltip title={isListening ? "Parar gravação" : "Gravar áudio"}>
              <IconButton
                color={isListening ? "error" : "default"}
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? <MicOff /> : <Mic />}
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              sx={{ minWidth: 48, height: 48 }}
            >
              <Send />
            </Button>
          </Box>
          
          <Box display="flex" justifyContent="center" mt={1}>
            <Typography variant="caption" color="text.secondary">
              A IA pode cometer erros. Sempre consulte um profissional para decisões importantes.
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Features Info */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mt: 3 }}>
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Analytics sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Análise Inteligente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Análise detalhada dos seus gastos e receitas
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Lightbulb sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Dicas Personalizadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sugestões baseadas no seu perfil financeiro
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Planejamento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajuda na criação de metas e orçamentos
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <School sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Educação Financeira
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aprenda sobre investimentos e economia
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default AiPage;
