# Baixar modelos adicionais para extração de informações financeiras
# Inclui docTR, PaddleOCR, LayoutLMv2, InvoiceNet, KIE-LayoutXLM

import subprocess

# Modelos HuggingFace
huggingface_models = [
    'microsoft/layoutlmv2-base-uncased',
    'microsoft/layoutxlm-base',
]

# Modelos via pip
pip_packages = [
    'python-doctr',
    'paddleocr',
    'invoicenet',
]

for model_name in huggingface_models:
    print(f'Baixando modelo HuggingFace: {model_name}')
    try:
        subprocess.run(['python', '-c', f"from transformers import AutoModel; AutoModel.from_pretrained('{model_name}')"], check=True)
        print(f'Modelo {model_name} baixado com sucesso.')
    except Exception as e:
        print(f'Erro ao baixar {model_name}: {e}')

for package in pip_packages:
    print(f'Instalando pacote: {package}')
    try:
        subprocess.run(['pip', 'install', package], check=True)
        print(f'Pacote {package} instalado com sucesso.')
    except Exception as e:
        print(f'Erro ao instalar {package}: {e}')
