#!/bin/bash
echo "🚀 Will Finance 5.0 - Setup Automático"
echo "======================================"

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências!"
    exit 1
fi

# 2. Configurar banco
echo "🗄️ Configurando banco de dados..."
npm run db:setup

if [ $? -ne 0 ]; then
    echo "❌ Erro ao configurar banco!"
    exit 1
fi

# 3. Verificar se o sistema está pronto
echo "✅ Sistema configurado com sucesso!"
echo ""
echo "🎯 Para iniciar o sistema, execute:"
echo "npm run dev"
echo ""
echo "🌐 Acesse: http://localhost:5173"
echo "👤 Email: demo@willfinance.com"
echo "🔑 Senha: cyberpunk2077"
