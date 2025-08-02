# Dockerfile para ambiente de IA (treinamento e inferência)
# Usando imagem mais recente e segura baseada em Debian
# NOTA: Vulnerabilidade restante é da imagem base oficial Python - aguardando correção upstream
FROM python:3.13-slim-bookworm

# Configurações de segurança
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    AI_MODEL_PATH=/app/models/finance_predictor_v6.h5 \
    API_PORT=8001

# Instala dependências básicas, cria usuário não-root, atualiza sistema e pip, e instala pacotes Python
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -m appuser && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
        build-essential \
        git \
        libglib2.0-0 \
        curl \
        libsm6 \
        libxext6 \
        libxrender1 && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
        datasets \
        notebook \
        numpy==1.26.4 \
        paddleocr \
        python-doctr \
        torch==2.1.2 \
        torchaudio==2.1.2 \
        torchvision==0.16.2 \
        transformers

# Cria diretórios de trabalho
WORKDIR /workspace

# Copia tudo do projeto para dentro do container
COPY . /workspace

# Ajusta permissões e muda para usuário não-root
RUN chown -R appuser:appgroup /workspace

# Muda para usuário não-root
USER appuser

# Instala dependências extras do projeto (se houver requirements.txt)
RUN if [ -f IA/requirements.txt ]; then pip install --user -r IA/requirements.txt; fi

# Comando padrão: bash (pode ser alterado para rodar o treinamento direto)
CMD ["bash"]
