import os
import glob
import json

# Caminho para os arquivos txt extraídos dos PDFs
TXT_DIR = os.path.join(os.path.dirname(__file__), '../datasets/txt/')
ANNOT_DIR = os.path.join(os.path.dirname(__file__), '../datasets/annotations/')

# Exemplo simples: cada linha do txt é uma transação, separada por ponto e vírgula
# data;descricao;valor;tipo

def parse_txt_to_ann(txt_path, ann_path):
    with open(txt_path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f if l.strip()]
    fields = []
    for line in lines:
        parts = line.split(';')
        if len(parts) >= 4:
            fields.append({"label": "data", "value": parts[0], "bbox": [0,0,0,0]})
            fields.append({"label": "descricao", "value": parts[1], "bbox": [0,0,0,0]})
            fields.append({"label": "valor", "value": parts[2], "bbox": [0,0,0,0]})
            fields.append({"label": "tipo", "value": parts[3], "bbox": [0,0,0,0]})
    ann = {
        "file_name": os.path.basename(txt_path).replace('.txt', '.pdf'),
        "fields": fields
    }
    with open(ann_path, 'w', encoding='utf-8') as f:
        json.dump(ann, f, ensure_ascii=False, indent=2)
    print(f'Anotação criada: {ann_path}')

if __name__ == "__main__":
    txt_files = glob.glob(os.path.join(TXT_DIR, '*.txt'))
    for txt_file in txt_files:
        ann_file = os.path.join(ANNOT_DIR, os.path.basename(txt_file).replace('.txt', '.json'))
        parse_txt_to_ann(txt_file, ann_file)
