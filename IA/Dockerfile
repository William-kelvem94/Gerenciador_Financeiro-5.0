# =============================================================================
# 🤖 AI Environment Dockerfile - Will Finance 5.0
# =============================================================================
# Otimizado para segurança, performance e manutenibilidade
# Baseado em análise automatizada e melhores práticas Docker

# Build arguments para configuração flexível
ARG PYTHON_VERSION=3.12
ARG DEBIAN_VERSION=bookworm
ARG USER_ID=1001
ARG GROUP_ID=1001

# Imagem base otimizada e segura
FROM python:${PYTHON_VERSION}-slim-${DEBIAN_VERSION}

# Labels informativos para metadados
LABEL maintainer="Will Finance Team" \
      version="5.0" \
      description="AI Environment for Financial Management System" \
      org.opencontainers.image.source="https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0" \
      org.opencontainers.image.documentation="https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0/blob/main/README.md"

# Variáveis de ambiente seguras e otimizadas
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_ROOT_USER_ACTION=ignore \
    PYTHONPATH="/workspace" \
    AI_MODEL_PATH="/app/models/finance_predictor_v6.h5" \
    API_PORT=8001 \
    PATH="/home/appuser/.local/bin:${PATH}"

# Instalação otimizada de dependências do sistema
RUN set -ex && \
    # Atualiza sistema e instala dependências essenciais
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        libglib2.0-0 libsm6 libxext6 libxrender1 curl && \
    # Limpeza completa do cache apt
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    # Atualiza pip e instala wheel
    pip install --no-cache-dir --upgrade pip wheel

# Criação de usuário não-root para segurança
RUN groupadd -g ${GROUP_ID} appgroup && \
    useradd -u ${USER_ID} -g appgroup -m appuser && \
    # Cria diretórios necessários com permissões adequadas
    mkdir -p /workspace/IA /app/models && \
    chown appuser:appgroup /workspace /app/models

# Configuração do workspace
WORKDIR /workspace

# Instalação de pacotes Python com versões fixas (para reprodutibilidade)
RUN pip install --no-cache-dir --user \
        numpy==1.26.4 torch==2.1.2 torchaudio==2.1.2 torchvision==0.16.2

# Instalação de pacotes Python sem versão específica
RUN pip install --no-cache-dir --user \
        datasets transformers notebook paddleocr python-doctr

# Copia arquivos da aplicação com ownership adequado
# NOTA: Use .dockerignore para excluir arquivos desnecessários
COPY --chown=appuser:appgroup ./IA/ /workspace/IA/
COPY --chown=appuser:appgroup ./requirements.txt* /workspace/

# Muda para usuário não-root
USER appuser

# Instala dependências específicas do projeto se existirem
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir --user -r requirements.txt; fi

# Define diretório de trabalho final
WORKDIR /workspace/IA

# Healthcheck para monitoramento do container
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)" || exit 1

# Exposição de porta (se necessário)
# EXPOSE 8001

# Comando padrão otimizado
CMD ["python", "-c", "print('🤖 Will Finance AI Environment Ready!'); import time; time.sleep(60)"]