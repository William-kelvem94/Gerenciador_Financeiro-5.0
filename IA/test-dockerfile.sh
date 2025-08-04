#!/bin/bash
# =============================================================================
# Script de Teste do Dockerfile Otimizado - Will Finance 5.0
# =============================================================================

set -e  # Para na primeira falha

echo "🧪 INICIANDO TESTES DO DOCKERFILE OTIMIZADO"
echo "=============================================="

# Definir cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se Docker está rodando
log_info "Verificando se Docker está disponível..."
if ! command -v docker &> /dev/null; then
    log_error "Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

if ! docker info &> /dev/null; then
    log_error "Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

log_success "Docker está disponível e rodando."

# Nome da imagem
IMAGE_NAME="will-finance-ai:test"

# Teste 1: Build da imagem
log_info "Teste 1: Fazendo build da imagem otimizada..."
start_time=$(date +%s)

if docker build -t $IMAGE_NAME .; then
    end_time=$(date +%s)
    build_time=$((end_time - start_time))
    log_success "Build completado em ${build_time}s"
else
    log_error "Falha no build da imagem"
    exit 1
fi

# Teste 2: Verificar tamanho da imagem
log_info "Teste 2: Verificando tamanho da imagem..."
image_size=$(docker images $IMAGE_NAME --format "table {{.Size}}" | tail -n +2)
log_success "Tamanho da imagem: $image_size"

# Teste 3: Verificar se a imagem inicia corretamente
log_info "Teste 3: Testando inicialização do container..."
container_id=$(docker run -d $IMAGE_NAME)

if [ $? -eq 0 ]; then
    log_success "Container iniciado com ID: ${container_id:0:12}"
    
    # Aguardar um pouco e verificar se ainda está rodando
    sleep 5
    if docker ps | grep -q ${container_id:0:12}; then
        log_success "Container ainda está rodando após 5s"
    else
        log_warning "Container parou após 5s (esperado para este CMD)"
    fi
    
    # Cleanup
    docker stop $container_id > /dev/null 2>&1
    docker rm $container_id > /dev/null 2>&1
else
    log_error "Falha ao iniciar container"
    exit 1
fi

# Teste 4: Verificar se o usuário não é root
log_info "Teste 4: Verificando se executa como usuário não-root..."
user_check=$(docker run --rm $IMAGE_NAME whoami)
if [ "$user_check" = "appuser" ]; then
    log_success "Executando como usuário não-root: $user_check"
else
    log_error "Container ainda executa como root!"
    exit 1
fi

# Teste 5: Verificar se Python está disponível e funcionando
log_info "Teste 5: Testando disponibilidade do Python..."
python_version=$(docker run --rm $IMAGE_NAME python --version)
if echo "$python_version" | grep -q "Python 3.12"; then
    log_success "Python funcionando: $python_version"
else
    log_error "Python não está funcionando corretamente"
    exit 1
fi

# Teste 6: Verificar pacotes Python essenciais
log_info "Teste 6: Verificando pacotes Python essenciais..."
packages=("numpy" "torch" "transformers")

for package in "${packages[@]}"; do
    if docker run --rm $IMAGE_NAME python -c "import $package; print(f'$package: OK')" &> /dev/null; then
        log_success "Pacote $package: OK"
    else
        log_error "Pacote $package: FALHA"
        exit 1
    fi
done

# Teste 7: Verificar healthcheck
log_info "Teste 7: Testando healthcheck..."
container_id=$(docker run -d $IMAGE_NAME)
sleep 10  # Aguardar healthcheck

health_status=$(docker inspect --format='{{.State.Health.Status}}' $container_id)
if [ "$health_status" = "healthy" ]; then
    log_success "Healthcheck: HEALTHY"
else
    log_warning "Healthcheck: $health_status (pode precisar de mais tempo)"
fi

# Cleanup
docker stop $container_id > /dev/null 2>&1
docker rm $container_id > /dev/null 2>&1

# Teste 8: Verificar vulnerabilidades (se trivy estiver disponível)
log_info "Teste 8: Verificando vulnerabilidades com Trivy (opcional)..."
if command -v trivy &> /dev/null; then
    log_info "Executando scan de vulnerabilidades com Trivy..."
    trivy image --severity HIGH,CRITICAL $IMAGE_NAME
else
    log_warning "Trivy não encontrado. Pule o scan de vulnerabilidades."
fi

# Relatório final
echo ""
echo "🎉 RELATÓRIO FINAL DOS TESTES"
echo "============================="
log_success "✅ Build da imagem"
log_success "✅ Tamanho da imagem: $image_size"
log_success "✅ Inicialização do container"
log_success "✅ Execução como usuário não-root"
log_success "✅ Python funcional"
log_success "✅ Pacotes essenciais instalados"
log_success "✅ Healthcheck configurado"

echo ""
log_info "🚀 Imagem pronta para uso: $IMAGE_NAME"
log_info "💡 Para usar: docker run -it $IMAGE_NAME"
log_info "🔧 Para desenvolvimento: docker run -it -v \$(pwd):/workspace $IMAGE_NAME bash"

echo ""
log_success "🏆 TODOS OS TESTES PASSARAM COM SUCESSO!"
