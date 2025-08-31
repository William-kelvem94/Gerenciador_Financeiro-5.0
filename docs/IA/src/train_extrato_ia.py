# Script de treinamento para extração de informações de extratos bancários
# Utiliza LayoutLMv3 (HuggingFace) e detecta GPU automaticamente
# Salva checkpoints e permite retomar de onde parou
# Treina até atingir performance mínima ou limite de epochs

import os
import torch
from transformers import LayoutLMv3ForTokenClassification, LayoutLMv3Processor, Trainer, TrainingArguments
from datasets import load_dataset, DatasetDict
from pathlib import Path

# Configurações
DATASET_DIR = './datasets/pdf/'
ANNOTATIONS_DIR = './datasets/annotations/'
MODEL_DIR = './models/layoutlmv3-checkpoints/'
MIN_F1 = 0.90  # performance mínima para parar
MAX_EPOCHS = 20
BATCH_SIZE = 2

# Detecta GPU
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Usando dispositivo: {device}')

# Baixa modelo pré-treinado
model_name = 'microsoft/layoutlmv3-base'
processor = LayoutLMv3Processor.from_pretrained(model_name)
model = LayoutLMv3ForTokenClassification.from_pretrained(model_name, num_labels=5)  # Ajuste o num_labels conforme suas classes
model.to(device)

# Carrega dataset anotado (exemplo: HuggingFace Datasets ou custom)
def load_custom_dataset():
    # Aqui você pode adaptar para ler seus PDFs/textos e anotações
    # Exemplo: usar datasets.load_dataset ou criar DatasetDict manualmente
    # Para protótipo, use um dataset público ou crie um mock
    return load_dataset('nielsr/funsd')  # FUNSD é para formulários, mas serve de exemplo

dataset = load_custom_dataset()

# Argumentos de treino
training_args = TrainingArguments(
    output_dir=MODEL_DIR,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=MAX_EPOCHS,
    evaluation_strategy='epoch',
    save_strategy='epoch',
    load_best_model_at_end=True,
    save_total_limit=3,
    logging_dir='./logs',
    logging_steps=10,
    fp16=torch.cuda.is_available(),
    resume_from_checkpoint=True if os.path.exists(MODEL_DIR) else False,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset['train'],
    eval_dataset=dataset['test'],
    tokenizer=processor,
)

# Loop de treino com autoavaliação
best_f1 = 0
for epoch in range(MAX_EPOCHS):
    print(f'Iniciando epoch {epoch+1}/{MAX_EPOCHS}')
    trainer.train(resume_from_checkpoint=True)
    metrics = trainer.evaluate()
    f1 = metrics.get('eval_f1', 0)
    print(f'Epoch {epoch+1} - F1: {f1}')
    if f1 > best_f1:
        best_f1 = f1
    if f1 >= MIN_F1:
        print('Performance mínima atingida, parando treinamento.')
        break
    # Salva checkpoint
    trainer.save_model(os.path.join(MODEL_DIR, f'checkpoint-epoch{epoch+1}'))

print('Treinamento finalizado. Melhor F1:', best_f1)
