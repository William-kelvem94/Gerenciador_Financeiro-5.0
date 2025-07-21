#!/usr/bin/env node

/**
 * Will Finance 5.0 - Script Master
 * Sistema principal de execução de scripts
 */

const { execSync } = require('child_process');
const path = require('path');

const scripts = {
  'dev': './scripts/development/start-dev.sh',
  'setup': './scripts/setup/setup.sh',
  'health': './scripts/development/health-check.sh',
  'validate': './scripts/development/validate-system.sh',
  'status': './scripts/development/status-final.sh'
};

const command = process.argv[2];

if (!command || !scripts[command]) {
  console.log(`
🚀 Will Finance 5.0 - Scripts Disponíveis:

  npm run dev       - Iniciar desenvolvimento
  npm run setup     - Configuração completa
  npm run health    - Verificar saúde do sistema
  npm run validate  - Validar funcionamento
  npm run status    - Status final do projeto

Exemplo: npm run dev
  `);
  process.exit(1);
}

try {
  console.log(`🚀 Executando: ${command}`);
  execSync(`chmod +x ${scripts[command]} && ${scripts[command]}`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error(`❌ Erro ao executar ${command}:`, error.message);
  process.exit(1);
}
