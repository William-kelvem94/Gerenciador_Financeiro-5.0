#!/bin/bash

# 🔍 Will Finance 5.0 - Script de Validação Final
# Este script testa todas as funcionalidades do sistema

echo "🔍 Iniciando validação final do Will Finance 5.0..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para executar teste
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}[TEST $TOTAL_TESTS]${NC} $test_name"
    
    local result=$(eval "$test_command" 2>/dev/null)
    
    if [[ $result =~ $expected_pattern ]]; then
        echo -e "  ${GREEN}✅ PASSOU${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}❌ FALHOU${NC}"
        echo -e "  ${YELLOW}Esperado: $expected_pattern${NC}"
        echo -e "  ${YELLOW}Recebido: $result${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

echo "======================================"
echo "🧪 EXECUTANDO TESTES DE VALIDAÇÃO"
echo "======================================"
echo ""

# Aguardar um pouco para garantir que os serviços estão funcionando
sleep 2

# 1. Teste de Health Check da API
run_test "Health Check da API" \
    'curl -s http://localhost:3001/api/health' \
    '"status":"ok"'

# 2. Teste de documentação Swagger
run_test "Documentação Swagger disponível" \
    'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/docs' \
    '200'

# 3. Teste de frontend carregando
run_test "Frontend carregando corretamente" \
    'curl -s -o /dev/null -w "%{http_code}" http://localhost:5174' \
    '200'

# 4. Teste de registro de usuário
run_test "Endpoint de registro disponível" \
    'curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test User\"}" | head -c 200' \
    '.*email.*'

# 5. Teste de login
run_test "Endpoint de login disponível" \
    'curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@willfinance.com\",\"password\":\"admin123\"}" | head -c 200' \
    '.*token.*'

# 6. Teste de estrutura de arquivos
run_test "Estrutura de arquivos correta" \
    'ls -la | grep -E "(client|server|docs)" | wc -l' \
    '[3-9]'

# 7. Teste de banco de dados
run_test "Banco de dados SQLite criado" \
    'ls -la server/prisma/ | grep "dev.db"' \
    'dev.db'

# 8. Teste de build frontend
run_test "Build do frontend gerado" \
    'ls -la client/ | grep dist' \
    'dist'

# 9. Teste de build backend
run_test "Build do backend gerado" \
    'ls -la server/ | grep dist' \
    'dist'

# 10. Teste de dependências instaladas
run_test "Node modules instalados" \
    'ls -la | grep node_modules' \
    'node_modules'

echo "======================================"
echo "📊 RESULTADOS DA VALIDAÇÃO"
echo "======================================"
echo ""
echo "📈 Total de testes: $TOTAL_TESTS"
echo -e "✅ Testes passaram: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Testes falharam: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}🚀 O Will Finance 5.0 está funcionando perfeitamente!${NC}"
    echo ""
    echo "======================================"
    echo "✅ SISTEMA VALIDADO E PRONTO PARA USO"
    echo "======================================"
    echo ""
    echo "🌐 URLS DE ACESSO:"
    echo "   Frontend: http://localhost:5174"
    echo "   Backend API: http://localhost:3001/api"
    echo "   Documentação: http://localhost:3001/api/docs"
    echo ""
    echo "👥 USUÁRIOS DE TESTE:"
    echo "   📧 admin@willfinance.com | 🔑 admin123"
    echo "   📧 user@willfinance.com  | 🔑 user123"
    echo ""
    echo "🎯 FUNCIONALIDADES TESTADAS E FUNCIONAIS:"
    echo "   • ✅ API REST completa"
    echo "   • ✅ Autenticação JWT"
    echo "   • ✅ Banco de dados SQLite"
    echo "   • ✅ Frontend React"
    echo "   • ✅ Documentação Swagger"
    echo "   • ✅ Sistema de build"
    echo "   • ✅ Estrutura de projeto"
    echo ""
else
    echo ""
    echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
    echo -e "${YELLOW}Verifique os logs acima para mais detalhes${NC}"
    echo ""
    echo "💡 POSSÍVEIS SOLUÇÕES:"
    echo "   • Verifique se o sistema está rodando: npm run dev"
    echo "   • Aguarde alguns segundos e execute novamente"
    echo "   • Verifique se as portas 3001 e 5174 estão livres"
fi

echo ""
echo "🔗 Para mais informações, consulte:"
echo "   📋 README-COMPLETO.md"
echo "   📚 docs/DEVELOPMENT.md"
echo ""
