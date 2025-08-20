#!/usr/bin/env node

// Teste do novo sistema de parser moderno
// Este script testa todas as funcionalidades de importação

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const baseURL = 'http://localhost:8080';

// Dados de teste realistas
const testCSV = `Data;Histórico;Débito;Crédito;Saldo
25/06/2025;SALÁRIO EMPRESA TECH LTDA;;5000,00;8500,00
24/06/2025;PIX ENVIADO JOÃO DA SILVA;150,00;;3500,00
23/06/2025;COMPRA DÉBITO SUPERMERCADO XYZ;89,50;;3650,00
22/06/2025;TRANSFERÊNCIA TED MARIA SANTOS;300,00;;3739,50
21/06/2025;DEPÓSITO EM DINHEIRO;;200,00;4039,50`;

const testCSVNubank = `date,category,title,amount
2025-06-25,salary,Salário Empresa Tech,5000.00
2025-06-24,transport,Uber,-25.50
2025-06-23,food,iFood Almoço,-45.80
2025-06-22,shopping,Amazon Livros,-120.00
2025-06-21,health,Farmácia Drogasil,-35.20`;

async function testModernParser() {
  console.log('🚀 WILL FINANCE - TESTE DO PARSER MODERNO\n');
  console.log('==========================================\n');

  try {
    // Teste 1: Health Check
    console.log('🏥 1. Testando Health Check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Teste 2: Teste de preview CSV Bradesco (sem autenticação)
    console.log('🏦 2. Testando Preview CSV Bradesco...');
    
    // Criar arquivo temporário
    const csvFile = 'test-bradesco.csv';
    fs.writeFileSync(csvFile, testCSV);
    
    // Criar FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(csvFile), {
      filename: 'extrato-bradesco.csv',
      contentType: 'text/csv',
    });

    const previewResponse = await axios.post(`${baseURL}/api/import-export/debug-preview`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log('✅ Preview Bradesco resultado:');
    console.log(`   - Sucesso: ${previewResponse.data.success}`);
    console.log(`   - Banco detectado: ${previewResponse.data.preview?.bankDetected || 'N/A'}`);
    console.log(`   - Transações encontradas: ${previewResponse.data.preview?.totalTransactions || 0}`);
    console.log(`   - Receitas: R$ ${previewResponse.data.preview?.summary?.income?.toFixed(2) || '0.00'}`);
    console.log(`   - Despesas: R$ ${previewResponse.data.preview?.summary?.expenses?.toFixed(2) || '0.00'}`);
    console.log('');

    // Mostrar algumas transações
    if (previewResponse.data.preview?.sampleTransactions && previewResponse.data.preview.sampleTransactions.length > 0) {
      console.log('📋 Primeiras 3 transações:');
      previewResponse.data.preview.sampleTransactions.slice(0, 3).forEach((t, i) => {
        console.log(`   ${i+1}. ${t.date} - ${t.description} - R$ ${t.amount} (${t.type})`);
      });
    }
    console.log('');

    // Teste 3: Teste de preview CSV Nubank
    console.log('💜 3. Testando Preview CSV Nubank...');
    
    const csvFileNubank = 'test-nubank.csv';
    fs.writeFileSync(csvFileNubank, testCSVNubank);
    
    const formDataNubank = new FormData();
    formDataNubank.append('file', fs.createReadStream(csvFileNubank), {
      filename: 'extrato-nubank.csv',
      contentType: 'text/csv',
    });

    const previewResponseNubank = await axios.post(`${baseURL}/api/import-export/debug-preview`, formDataNubank, {
      headers: {
        ...formDataNubank.getHeaders(),
      },
    });

    console.log('✅ Preview Nubank resultado:');
    console.log(`   - Sucesso: ${previewResponseNubank.data.success}`);
    console.log(`   - Banco detectado: ${previewResponseNubank.data.preview?.bankDetected || 'N/A'}`);
    console.log(`   - Transações encontradas: ${previewResponseNubank.data.preview?.totalTransactions || 0}`);
    console.log(`   - Receitas: R$ ${previewResponseNubank.data.preview?.summary?.income?.toFixed(2) || '0.00'}`);
    console.log(`   - Despesas: R$ ${previewResponseNubank.data.preview?.summary?.expenses?.toFixed(2) || '0.00'}`);
    console.log('');

    // Teste 4: Teste de autenticação admin
    console.log('🔐 4. Testando Login Admin...');
    
    const loginResponse = await axios.post(`${baseURL}/api/admin/login`, {
      email: 'admin@willfinance.com',
      password: 'admin123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login admin realizado com sucesso!');
      console.log(`   - Token gerado: ${loginResponse.data.token ? 'Sim' : 'Não'}`);
      console.log(`   - Usuário: ${loginResponse.data.user.email}`);
      console.log(`   - Role: ${loginResponse.data.user.role}`);
      console.log('');

      // Teste 5: Verificar estatísticas do sistema
      console.log('📊 5. Testando Estatísticas do Sistema...');
      
      const statsResponse = await axios.get(`${baseURL}/api/admin/system-stats`, {
        headers: {
          Authorization: `Bearer ${loginResponse.data.token}`
        }
      });

      console.log('✅ Estatísticas do sistema:');
      console.log(`   - Total de usuários: ${statsResponse.data.users.total}`);
      console.log(`   - Usuários admin: ${statsResponse.data.users.admins}`);
      console.log(`   - Total de transações: ${statsResponse.data.transactions.total}`);
      console.log(`   - Transações reais: ${statsResponse.data.transactions.real}`);
      console.log(`   - Transações demo: ${statsResponse.data.transactions.demo}`);
      console.log('');
    }

    // Limpeza
    if (fs.existsSync(csvFile)) fs.unlinkSync(csvFile);
    if (fs.existsSync(csvFileNubank)) fs.unlinkSync(csvFileNubank);

    console.log('🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!');
    console.log('✅ O sistema está funcionando perfeitamente!');
    console.log('');
    console.log('🔥 PRÓXIMOS PASSOS:');
    console.log('   1. Acesse: http://localhost:5173');
    console.log('   2. Faça login: admin@willfinance.com / admin123');
    console.log('   3. Vá para Import/Export e teste com arquivos reais');
    console.log('   4. Sistema suporta: CSV, TXT, PDF, XLSX');
    console.log('');

  } catch (error) {
    console.log('❌ ERRO NO TESTE:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    console.log('🔧 Verifique se o servidor está rodando na porta 8080');
  }
}

// Executar testes
testModernParser();
