#!/usr/bin/env node

// Teste direto da API sem autenticação
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseURL = 'http://localhost:8080';

// Dados de teste simples
const testData = `Data;Histórico;Débito;Crédito;Saldo
13/01/2025;DEVOLUCAO PIX JOAO AMEIXAS;1074,99;;314,99
08/02/2025;TRANSFERENCIA PIX ROGERIO;20,00;;294,99`;

async function testDirectAPI() {
  console.log('🔍 Teste Direto da API - Will Finance\n');

  // 1. Testar health check primeiro
  try {
    console.log('🏥 Testando health check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check OK:', healthResponse.status);
  } catch (error) {
    console.log('❌ Health check falhou:', error.message);
    return;
  }

  // 2. Testar rota de preview diretamente
  try {
    console.log('\n📋 Testando preview direto...');
    
    // Criar arquivo temporário
    const filename = `test-direct-${Date.now()}.csv`;
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, testData);

    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    // Fazer chamada para rota de debug
    const response = await axios.post(`${baseURL}/api/import-export/debug-preview`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 30000
    });

    console.log('✅ Preview response:', response.data);

    // Limpar arquivo
    fs.unlinkSync(filePath);

  } catch (error) {
    console.log('❌ Erro no preview:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }

  // 3. Testar parser diretamente
  try {
    console.log('\n🔧 Testando parser diretamente...');
    
    // Simular o que o parser faria
    const { BankStatementParser } = require('./server/src/services/simpleBankParser');
    const parser = new BankStatementParser();
    
    const tempFile = path.join(__dirname, 'temp-test.csv');
    fs.writeFileSync(tempFile, testData);
    
    const result = await parser.parseFile(tempFile, 'temp-test.csv');
    
    console.log('✅ Parser result:', JSON.stringify(result, null, 2));
    
    fs.unlinkSync(tempFile);
    
  } catch (error) {
    console.log('❌ Erro no parser:', error.message);
  }
}

testDirectAPI().catch(console.error);
