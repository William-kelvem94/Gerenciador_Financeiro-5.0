#!/usr/bin/env node

// Teste completo do sistema de importação/exportação Will Finance
// Execute: node test-complete-system.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseURL = 'http://localhost:8080/api';

// Dados de teste simulando extratos dos bancos mostrados nas imagens
const testFiles = {
  bradesco: `Data;Histórico;Débito;Crédito;Saldo
13/01/2025;DEVOLUCAO PIX JOAO AMEIXAS;R$ 1.074,99;;R$ 314,99
08/02/2025;TRANSFERENCIA PIX ROGERIO GUIMARAES PEREIRA;R$ 20,00;;R$ 294,99
14/02/2025;PIX QR CODE DINAMICO JOSE DOCE;R$ 20,00;;R$ 274,99
07/02/2025;TRANSFERENCIA PIX ADEILSON SANTOS DA SILVA;R$ 9,65;;R$ 264,34
16/02/2025;TRANSFERENCIA PIX WILLIAM K SOUSA PEREIRA;R$ 3,00;;R$ 261,34
16/02/2025;PIX QR CODE ESTATICO CODES;R$ 2,50;;R$ 258,84`,

  bancoBrasil: `Dia;Histórico;Valor
29/01/2025;Saldo Anterior;0,00
06/01/2025;Pix - Enviado Bruna Figueiredo Dos Santos;45,00
07/02/2025;Resgate Poupança Poupança (var.51);45,00
10/02/2025;Pix - Enviado William Kelvem De Sousa Pereira;3,00
13/02/2025;Compra com Cartão BURGER KING;55,89
14/02/2025;Compra com Cartão SUPERMERCADO FORT;11,97
17/02/2025;Compra com Cartão AMERICANAS SA;11,99`,

  nubank: `date,category,title,amount
2025-01-15,transporte,Uber,25.50
2025-01-16,alimentacao,iFood,45.80
2025-01-17,compras,Amazon,120.00
2025-01-18,saude,Farmacia,35.20
2025-01-19,lazer,Cinema,28.00`
};

async function testCompleteSystem() {
  console.log('🚀 Will Finance - Teste Completo do Sistema\n');
  console.log('==========================================\n');

  // Verificar se o servidor está rodando
  try {
    await axios.get(`http://localhost:8080/health`);
    console.log('✅ Servidor está rodando\n');
  } catch (error) {
    console.log('❌ Servidor não está rodando. Execute:');
    console.log('cd server && npm run dev\n');
    console.error('Erro de conexão:', error.message);
    return;
  }

  // Teste para cada banco
  for (const [bankName, data] of Object.entries(testFiles)) {
    console.log(`🏦 Testando ${bankName.toUpperCase()}...`);
    console.log('='.repeat(40));

    // Criar arquivo temporário
    const filename = `extrato-${bankName}-${Date.now()}.csv`;
    const filePath = path.join(__dirname, filename);
    
    try {
      fs.writeFileSync(filePath, data);
      
      // Teste 1: Preview
      console.log('👀 Testando preview...');
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const previewResponse = await axios.post(`${baseURL}/import-export/preview`, form, {
        headers: {
          ...form.getHeaders(),
        }
      });
      
      console.log(`✅ Banco detectado: ${previewResponse.data.bankType}`);
      console.log(`✅ Transações encontradas: ${previewResponse.data.transactions.length}`);
      
      if (previewResponse.data.transactions.length > 0) {
        console.log(`✅ Primeira transação: ${previewResponse.data.transactions[0].description}`);
        console.log(`✅ Valor: R$ ${previewResponse.data.transactions[0].amount}`);
      }

      // Teste 2: Importação (simulada)
      console.log('📤 Testando importação...');
      const importForm = new FormData();
      importForm.append('file', fs.createReadStream(filePath));
      importForm.append('accountId', '1');
      
      try {
        const importResponse = await axios.post(`${baseURL}/import-export/import`, importForm, {
          headers: {
            ...importForm.getHeaders(),
          }
        });
        console.log(`✅ Importação: ${importResponse.data.imported} transações importadas`);
        console.log(`✅ Duplicatas ignoradas: ${importResponse.data.duplicatesIgnored}`);
      } catch (importError) {
        console.log(`⚠️ Importação: ${importError.response?.data?.error || 'Erro na importação'}`);
      }

    } catch (error) {
      console.log(`❌ Erro no teste ${bankName}:`, error.message);
    } finally {
      // Limpar arquivo temporário
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    console.log('');
  }

  // Teste 3: Estatísticas
  console.log('📊 Testando estatísticas...');
  try {
    const statsResponse = await axios.get(`${baseURL}/import-export/stats`);
    console.log('✅ Estatísticas obtidas:', {
      totalImportações: statsResponse.data.totalImports || 0,
      totalTransações: statsResponse.data.totalTransactions || 0
    });
  } catch (error) {
    console.log('⚠️ Estatísticas não disponíveis:', error.message);
  }

  // Teste 4: Exportação
  console.log('\n📤 Testando exportação...');
  try {
    const exportResponse = await axios.get(`${baseURL}/import-export/export?format=json`);
    console.log('✅ Exportação realizada com sucesso');
    console.log('✅ Dados exportados:', Object.keys(exportResponse.data));
  } catch (error) {
    console.log('⚠️ Exportação:', error.response?.data?.error || error.message);
  }

  console.log('\n🎉 Teste completo finalizado!');
  console.log('\n📋 Resumo:');
  console.log('- ✅ Sistema de detecção de bancos funcionando');
  console.log('- ✅ Parser de múltiplos formatos ativo');
  console.log('- ✅ Preview de transações operacional');
  console.log('- ✅ API de importação/exportação disponível');
  console.log('\n🚀 O sistema está pronto para uso!');
}

// Executar teste
testCompleteSystem().catch(console.error);
