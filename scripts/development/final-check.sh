#!/bin/bash

# 🎯 Will Finance 5.0 - Verificação Final Completa
# Script que valida toda a organização e funcionalidade

echo "🎯 Will Finance 5.0 - Verificação Final da Organização"
echo "======================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Função para executar verificação
check_item() {
    local description="$1"
    local condition="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if eval "$condition"; then
        echo -e "${GREEN}✅ $description${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ $description${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

echo "🔍 VERIFICANDO ORGANIZAÇÃO DOS ARQUIVOS"
echo "======================================="

# Verificar estrutura de pastas
check_item "Pasta client/ existe" "[ -d 'client' ]"
check_item "Pasta server/ existe" "[ -d 'server' ]"
check_item "Pasta docs/ existe" "[ -d 'docs' ]"
check_item "Pasta scripts/ existe" "[ -d 'scripts' ]"
check_item "Pasta docs/guides/ existe" "[ -d 'docs/guides' ]"
check_item "Pasta docs/reports/ existe" "[ -d 'docs/reports' ]"
check_item "Pasta scripts/development/ existe" "[ -d 'scripts/development' ]"
check_item "Pasta scripts/setup/ existe" "[ -d 'scripts/setup' ]"
check_item "Pasta scripts/production/ existe" "[ -d 'scripts/production' ]"

echo ""
echo "🔧 VERIFICANDO SCRIPTS ORGANIZADOS"
echo "=================================="

# Verificar scripts movidos
check_item "start-dev.sh movido para development/" "[ -f 'scripts/development/start-dev.sh' ]"
check_item "health-check.sh movido para development/" "[ -f 'scripts/development/health-check.sh' ]"
check_item "setup.sh movido para setup/" "[ -f 'scripts/setup/setup.sh' ]"
check_item "validate-system.sh movido para development/" "[ -f 'scripts/development/validate-system.sh' ]"

echo ""
echo "📚 VERIFICANDO DOCUMENTAÇÃO ORGANIZADA"  
echo "====================================="

# Verificar documentação movida
check_item "Relatórios movidos para docs/reports/" "[ -d 'docs/reports' ] && [ $(ls docs/reports/*.md 2>/dev/null | wc -l) -gt 0 ]"
check_item "README.md principal atualizado" "[ -f 'README.md' ]"

echo ""
echo "🎨 VERIFICANDO CSS CORRIGIDO"
echo "============================"

# Verificar CSS sem warnings
check_item "CSS principal sem @tailwind" "! grep -q '@tailwind' client/src/index.css"
check_item "Global CSS criado" "[ -f 'client/src/styles/global.css' ]"
check_item "Themes CSS existe" "[ -f 'client/src/styles/themes.css' ]"

echo ""
echo "🔨 VERIFICANDO BUILDS"
echo "===================="

# Verificar se builds funcionam
if cd client && npm run build > /dev/null 2>&1; then
    check_item "Frontend compila sem erros" "true"
else
    check_item "Frontend compila sem erros" "false"
fi

# Voltar para raiz
cd ..

if cd server && npm run build > /dev/null 2>&1; then
    check_item "Backend compila sem erros" "true"
else
    check_item "Backend compila sem erros" "false"
fi

# Voltar para raiz
cd ..

echo ""
echo "⚙️ VERIFICANDO DEPENDÊNCIAS"
echo "==========================="

# Verificar node_modules
check_item "Dependencies client/ instaladas" "[ -d 'client/node_modules' ]"
check_item "Dependencies server/ instaladas" "[ -d 'server/node_modules' ]"
check_item "package.json principal existe" "[ -f 'package.json' ]"

echo ""
echo "🔐 VERIFICANDO ARQUIVOS DE CONFIGURAÇÃO"
echo "======================================="

# Verificar configurações
check_item "tsconfig.json existe" "[ -f 'tsconfig.json' ]"
check_item ".env.example existe" "[ -f '.env.example' ]"
check_item ".gitignore existe" "[ -f '.gitignore' ]"
check_item "docker-compose.yml existe" "[ -f 'docker-compose.yml' ]"

echo ""
echo "🧹 VERIFICANDO LIMPEZA DE ERROS"
echo "==============================="

# Verificar tipos TypeScript
check_item "AuthCallback.tsx sem comentários" "! grep -q '// import' client/src/components/auth/AuthCallback.tsx"
check_item "types/index.ts sem 'any'" "! grep -q ': any' client/src/types/index.ts"

echo ""
echo "======================================"
echo "📊 RESUMO DA VERIFICAÇÃO FINAL"
echo "======================================"
echo ""
echo "📈 Total de verificações: $TOTAL_CHECKS"
echo -e "✅ Verificações passaram: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "❌ Verificações falharam: ${RED}$FAILED_CHECKS${NC}"

# Calcular porcentagem
PERCENTAGE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))

echo ""
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 PARABÉNS! Sistema 100% organizado e funcional!${NC}"
    echo -e "${GREEN}🚀 Pronto para desenvolvimento e produção!${NC}"
    echo ""
    echo "📝 PRÓXIMOS PASSOS:"
    echo "   1. Execute: ./scripts/development/start-dev.sh"
    echo "   2. Acesse: http://localhost:5173"
    echo "   3. Teste todas as funcionalidades"
    echo "   4. Deploy quando necessário"
else
    echo -e "${YELLOW}⚠️  Organização: ${PERCENTAGE}% completa${NC}"
    echo -e "${YELLOW}🔧 Algumas verificações falharam. Revise os itens acima.${NC}"
fi

echo ""
echo "======================================"
echo "🎯 Will Finance 5.0 - Verificação Concluída"
echo "======================================"

exit $FAILED_CHECKS
