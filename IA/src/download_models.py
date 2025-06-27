# Baixar modelos recomendados para extração de informações financeiras
# Este script baixa LayoutLMv3, Donut e TrOCR do HuggingFace

from transformers import AutoModel, AutoProcessor

MODELS = [
    'microsoft/layoutlmv3-base',
    'naver-clova-ix/donut-base',
    'microsoft/trocr-base-stage1',
]

for model_name in MODELS:
    print(f'Baixando modelo: {model_name}')
    try:
        AutoModel.from_pretrained(model_name)
        AutoProcessor.from_pretrained(model_name)
        print(f'Modelo {model_name} baixado com sucesso.')
    except Exception as e:
        print(f'Erro ao baixar {model_name}: {e}')
