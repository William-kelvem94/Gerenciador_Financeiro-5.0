import { Controller, Post, Body } from '@nestjs/common';

@Controller('ia-chat')
export class IaChatController {
  @Post()
  async chat(@Body() body: { message: string }) {
    // Aqui você pode integrar com o modelo de IA local, ou usar uma resposta mock
    // Exemplo simples:
    const userMsg = body.message?.toLowerCase() || '';
    let reply = 'Desculpe, não entendi. Pode reformular?';
    if (userMsg.includes('gasto') || userMsg.includes('economia')) {
      reply = 'Sugestão: analise seus maiores gastos do mês e defina um limite para cada categoria.';
    } else if (userMsg.includes('saldo')) {
      reply = 'Seu saldo atual está disponível na tela principal do sistema.';
    } else if (userMsg.includes('olá') || userMsg.includes('oi')) {
      reply = 'Olá! Como posso te ajudar com seu financeiro hoje?';
    } else if (userMsg.includes('meta')) {
      reply = 'Definir metas de economia é uma ótima prática! Quer ajuda para criar uma?';
    }
    return { reply };
  }
}
