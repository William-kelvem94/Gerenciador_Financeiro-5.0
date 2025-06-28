/**
 * Teste de Validação do Sistema de Importação de Extratos
 * Para validar se o parsing está funcionando corretamente
 */

const { ModernBankParser } = require('./server/src/services/modernBankParser.ts');
const fs = require('fs');
const path = require('path');

async function testBankParsing() {
  console.log('🧪 TESTE DE VALIDAÇÃO - IMPORTAÇÃO DE EXTRATOS');
  console.log('==================================================\n');

  const parser = new ModernBankParser();
  
  // Arquivos de teste disponíveis
  const testFiles = [
    { name: 'test-bradesco.csv', bank: 'Bradesco' },
    { name: 'test-nubank.csv', bank: 'Nubank' },
    { name: 'extrato-bradesco-1751044935591.csv', bank: 'Bradesco' },
  ];

  for (const testFile of testFiles) {
    const filePath = path.join(__dirname, testFile.name);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Arquivo não encontrado: ${testFile.name}`);
      continue;
    }

    console.log(`📄 Testando: ${testFile.name} (${testFile.bank})`);
    console.log('----------------------------------------');

    try {
      const result = await parser.parseFile(filePath, testFile.name);
      
      if (result.success) {
        console.log(`✅ Parsing realizado com sucesso!`);
        console.log(`🏦 Banco detectado: ${result.bankDetected}`);
        console.log(`📊 Total de transações: ${result.totalTransactions}`);
        console.log(`💰 Resumo financeiro:`);
        console.log(`   - Receitas: R$ ${result.summary.income.toFixed(2)}`);
        console.log(`   - Despesas: R$ ${result.summary.expenses.toFixed(2)}`);
        console.log(`   - Saldo: R$ ${result.summary.balance.toFixed(2)}`);
        
        if (result.transactions.length > 0) {
          console.log(`\n🔍 Primeiras 3 transações:`);
          result.transactions.slice(0, 3).forEach((t, i) => {
            console.log(`   ${i + 1}. ${t.date} | ${t.description} | ${t.type} | R$ ${t.amount.toFixed(2)}`);
          });
        }
      } else {
        console.log(`❌ Falha no parsing:`);
        result.errors.forEach(error => console.log(`   - ${error}`));
      }
    } catch (error) {
      console.log(`💥 Erro durante o teste: ${error.message}`);
    }

    console.log('\n');
  }

  // Teste de detecção de banco
  console.log('🔍 TESTE DE DETECÇÃO DE BANCO');
  console.log('==============================');
  
  const testContents = [
    { content: 'BANCO BRADESCO S.A.', filename: 'extrato.csv', expected: 'BRADESCO' },
    { content: 'Nu Pagamentos S.A.', filename: 'nubank-extrato.txt', expected: 'NUBANK' },
    { content: 'BANCO DO BRASIL', filename: 'bb-statement.pdf', expected: 'BANCO_DO_BRASIL' },
    { content: 'BANCO ITAÚ', filename: 'itau.csv', expected: 'ITAU' }
  ];

  testContents.forEach(test => {
    const detected = require('./server/src/services/modernBankParser.ts').SafeUtils.detectBank(test.content, test.filename);
    const isCorrect = detected === test.expected;
    console.log(`${isCorrect ? '✅' : '❌'} ${test.filename}: ${detected} ${isCorrect ? '' : `(esperado: ${test.expected})`}`);
  });

  console.log('\n🎯 CONCLUSÃO DO TESTE');
  console.log('=====================');
  console.log('Se todos os testes passaram, o sistema de importação está funcionando corretamente.');
  console.log('Para testar na interface web, inicie o servidor e cliente, e vá para Importar/Exportar.');
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testBankParsing().catch(console.error);
}

module.exports = { testBankParsing };
