# Dockerfile para ambiente de IA (treinamento e inferência)
FROM python:3.8-slim

# Instala dependências básicas
RUN apt-get update && apt-get install -y git gcc libglib2.0-0 libsm6 libxrender1 libxext6 && rm -rf /var/lib/apt/lists/*

# Atualiza pip
RUN pip install --upgrade pip

# Instala numpy 1.19.5 antes do Invoicenet
RUN pip install numpy==1.19.5

# Instala torch stack antigo antes do Invoicenet
RUN pip install torch==1.7.1 torchvision==0.8.2 torchaudio==0.7.2

# Instala Invoicenet diretamente do GitHub (não disponível no PyPI)
RUN pip install git+https://github.com/naiveHobo/Invoicenet.git

# Instala libs modernas (usar numpy antigo para evitar conflitos)
RUN pip install datasets notebook python-doctr paddleocr transformers

# Cria diretórios de trabalho
WORKDIR /workspace

# Copia tudo do projeto para dentro do container
COPY . /workspace

# Instala dependências extras do projeto (se houver requirements.txt)
RUN if [ -f IA/requirements.txt ]; then pip install -r IA/requirements.txt; fi

# Comando padrão: bash (pode ser alterado para rodar o treinamento direto)
CMD ["bash"]
