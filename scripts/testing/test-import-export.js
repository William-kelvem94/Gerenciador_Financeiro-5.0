// Script de teste para verificar a funcionalidade de importação/exportação
// Execute: node test-import-export.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseURL = 'http://localhost:3001/api';

// Exemplo de dados de teste para um extrato de banco
const sampleBankData = `Data;Descrição;Valor;Saldo
2024-01-15;PIX RECEBIDO - JOAO SILVA;500.00;1500.00
2024-01-16;TED ENVIADO - MARIA SANTOS;-200.00;1300.00
2024-01-17;COMPRA CARTAO - SUPERMERCADO ABC;-150.75;1149.25
2024-01-18;PIX RECEBIDO - FREELANCER;300.00;1449.25
2024-01-19;PAGAMENTO BOLETO - ENERGIA;-120.45;1328.80`;

// Criar arquivo de teste
const testFilePath = path.join(__dirname, 'teste-extrato.csv');
fs.writeFileSync(testFilePath, sampleBankData);

async function testImportExport() {
    try {
        console.log('🚀 Iniciando testes do sistema de importação/exportação...\n');
        
        // Teste 1: Verificar endpoint de estatísticas
        console.log('📊 Testando endpoint de estatísticas...');
        try {
            const statsResponse = await axios.get(`${baseURL}/import-export/stats`);
            console.log('✅ Estatísticas obtidas com sucesso:', statsResponse.data);
        } catch (error) {
            console.log('❌ Erro ao obter estatísticas:', error.message);
        }
        
        console.log('\n' + '='.repeat(50) + '\n');
        
        // Teste 2: Preview de arquivo
        console.log('👀 Testando preview de arquivo...');
        try {
            const FormData = require('form-data');
            const form = new FormData();
            form.append('file', fs.createReadStream(testFilePath));
            
            const previewResponse = await axios.post(`${baseURL}/import-export/preview`, form, {
                headers: {
                    ...form.getHeaders(),
                }
            });
            console.log('✅ Preview gerado com sucesso:');
            console.log('Banco detectado:', previewResponse.data.bankType);
            console.log('Transações encontradas:', previewResponse.data.transactions.length);
            console.log('Primeira transação:', previewResponse.data.transactions[0]);
        } catch (error) {
            console.log('❌ Erro no preview:', error.message);
        }
        
        console.log('\n' + '='.repeat(50) + '\n');
        
        // Teste 3: Exportação
        console.log('📤 Testando exportação...');
        try {
            const exportResponse = await axios.get(`${baseURL}/import-export/export?format=json`);
            console.log('✅ Exportação realizada com sucesso');
            console.log('Dados exportados:', Object.keys(exportResponse.data));
        } catch (error) {
            console.log('❌ Erro na exportação:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Erro geral nos testes:', error.message);
    } finally {
        // Limpar arquivo de teste
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
            console.log('\n🧹 Arquivo de teste removido.');
        }
    }
}

console.log('Will Finance - Testador de Importação/Exportação');
console.log('================================================\n');

// Verificar se o servidor está rodando
axios.get(`${baseURL}/health`)
    .then(() => {
        console.log('✅ Servidor está rodando, iniciando testes...\n');
        testImportExport();
    })
    .catch(() => {
        console.log('❌ Servidor não está rodando. Inicie o servidor primeiro.');
        console.log('Execute: npm run dev (no diretório do servidor)\n');
    });
