#!/bin/bash
# Script de instalação das dependências para o sistema de importação/exportação
# Execute: chmod +x install-import-deps.sh && ./install-import-deps.sh

echo "🚀 Instalando dependências para o sistema de importação/exportação..."
echo "================================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Will Finance"
    exit 1
fi

echo "📦 Instalando dependências do backend..."
cd server

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado no diretório server"
    exit 1
fi

# Instalar dependências principais se não estiverem instaladas
echo "Verificando dependências necessárias..."

# Lista de dependências críticas para importação/exportação
DEPS=(
    "multer@^1.4.5-lts.1"
    "pdf-parse@^1.1.1"
    "xlsx@^0.18.5"
    "@types/multer@^1.4.13"
    "@types/pdf-parse@^1.1.5"
)

for dep in "${DEPS[@]}"; do
    package_name=$(echo $dep | cut -d'@' -f1)
    if npm list $package_name &>/dev/null; then
        echo "✅ $package_name já instalado"
    else
        echo "📦 Instalando $dep..."
        npm install $dep
    fi
done

echo ""
echo "🎯 Verificando instalação..."
npm list multer pdf-parse xlsx @types/multer @types/pdf-parse

cd ..

echo ""
echo "📦 Instalando dependências do frontend..."
cd client

if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado no diretório client"
    exit 1
fi

npm install

cd ..

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "🚀 Para testar o sistema:"
echo "1. Inicie o backend: cd server && npm run dev"
echo "2. Inicie o frontend: cd client && npm run dev"
echo "3. Execute o teste: node test-import-export.js"
echo ""
echo "📚 Consulte IMPORT-EXPORT-DOCS.md para documentação completa"
