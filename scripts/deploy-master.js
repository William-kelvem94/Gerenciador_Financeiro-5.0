#!/usr/bin/env node

/**
 * 🚀 WILL FINANCE 5.0 - DEPLOY SCRIPT MASTER
 * Script multiplataforma para deploy em Windows, Linux e Ubuntu
 * Suporta Docker e execução local
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// === CONFIGURAÇÕES === //
const CONFIG = {
  PROJECT_NAME: 'Will Finance 5.0',
  VERSION: '5.0.0',
  DOCKER_COMPOSE_DEV: 'docker-compose.yml',
  DOCKER_COMPOSE_PROD: 'docker-compose.prod.yml',
  COLORS: {
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m'
  }
};

// === FUNÇÕES UTILITÁRIAS === //
function log(message, color = 'WHITE') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${CONFIG.COLORS[color]}[${timestamp}] ${message}${CONFIG.COLORS.RESET}`);
}

function logHeader(message) {
  const border = '='.repeat(message.length + 4);
  console.log(`\n${CONFIG.COLORS.CYAN}${border}`);
  console.log(`  ${message}`);
  console.log(`${border}${CONFIG.COLORS.RESET}\n`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'GREEN');
}

function logError(message) {
  log(`❌ ${message}`, 'RED');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'YELLOW');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'BLUE');
}

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return result;
  } catch (error) {
    logError(`Falha ao executar: ${command}`);
    logError(error.message);
    if (!options.ignoreErrors) {
      process.exit(1);
    }
    return null;
  }
}

function checkCommand(command) {
  try {
    execCommand(`${command} --version`, { silent: true });
    return true;
  } catch {
    return false;
  }
}

function detectPlatform() {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return 'Windows';
    case 'linux':
      return 'Linux';
    case 'darwin':
      return 'macOS';
    default:
      return platform;
  }
}

// === VERIFICAÇÕES DO SISTEMA === //
function checkSystemRequirements() {
  logHeader('🔍 VERIFICANDO REQUISITOS DO SISTEMA');
  
  const platform = detectPlatform();
  logInfo(`Plataforma detectada: ${platform}`);
  
  const requirements = [
    { name: 'Node.js', command: 'node', required: true },
    { name: 'npm', command: 'npm', required: true },
    { name: 'Docker', command: 'docker', required: false },
    { name: 'Docker Compose', command: 'docker-compose', required: false }
  ];
  
  let allRequired = true;
  
  requirements.forEach(req => {
    if (checkCommand(req.command)) {
      logSuccess(`${req.name} está instalado`);
    } else {
      if (req.required) {
        logError(`${req.name} é obrigatório mas não está instalado`);
        allRequired = false;
      } else {
        logWarning(`${req.name} não está instalado (opcional para modo local)`);
      }
    }
  });
  
  if (!allRequired) {
    logError('Requisitos obrigatórios não atendidos');
    process.exit(1);
  }
  
  logSuccess('Verificação de requisitos concluída');
}

// === INSTALAÇÃO DE DEPENDÊNCIAS === //
function installDependencies() {
  logHeader('📦 INSTALANDO DEPENDÊNCIAS');
  
  // Root
  logInfo('Instalando dependências do projeto raiz...');
  execCommand('npm install');
  
  // Client
  logInfo('Instalando dependências do frontend...');
  execCommand('npm install', { cwd: './client' });
  
  // Server
  logInfo('Instalando dependências do backend...');
  execCommand('npm install', { cwd: './server' });
  
  logSuccess('Todas as dependências foram instaladas');
}

// === BUILD LOCAL === //
function buildLocal() {
  logHeader('🏗️  CONSTRUINDO APLICAÇÃO (LOCAL)');
  
  // Build do backend
  logInfo('Construindo backend...');
  execCommand('npm run build', { cwd: './server' });
  
  // Build do frontend
  logInfo('Construindo frontend...');
  execCommand('npm run build', { cwd: './client' });
  
  logSuccess('Build local concluído');
}

// === DOCKER OPERATIONS === //
function dockerBuild(environment = 'development') {
  logHeader(`🐳 CONSTRUINDO IMAGENS DOCKER (${environment.toUpperCase()})`);
  
  const composeFile = environment === 'production' ? 
    CONFIG.DOCKER_COMPOSE_PROD : 
    CONFIG.DOCKER_COMPOSE_DEV;
  
  logInfo(`Usando arquivo: ${composeFile}`);
  execCommand(`docker-compose -f ${composeFile} build --no-cache`);
  
  logSuccess('Imagens Docker construídas com sucesso');
}

function dockerDeploy(environment = 'development') {
  logHeader(`🚀 INICIANDO CONTAINERS (${environment.toUpperCase()})`);
  
  const composeFile = environment === 'production' ? 
    CONFIG.DOCKER_COMPOSE_PROD : 
    CONFIG.DOCKER_COMPOSE_DEV;
  
  // Parar containers existentes
  logInfo('Parando containers existentes...');
  execCommand(`docker-compose -f ${composeFile} down`, { ignoreErrors: true });
  
  // Iniciar novos containers
  logInfo('Iniciando novos containers...');
  execCommand(`docker-compose -f ${composeFile} up -d`);
  
  // Verificar status
  logInfo('Verificando status dos containers...');
  execCommand(`docker-compose -f ${composeFile} ps`);
  
  logSuccess('Deploy Docker concluído');
}

function dockerLogs() {
  logHeader('📋 VISUALIZANDO LOGS DOS CONTAINERS');
  
  // Tentar development primeiro, depois production
  let composeFile = CONFIG.DOCKER_COMPOSE_DEV;
  if (!fs.existsSync(composeFile) || !execCommand('docker-compose ps', { silent: true, ignoreErrors: true })) {
    composeFile = CONFIG.DOCKER_COMPOSE_PROD;
  }
  
  execCommand(`docker-compose -f ${composeFile} logs -f --tail=100`);
}

// === DEPLOY LOCAL === //
function deployLocal() {
  logHeader('🖥️  DEPLOY LOCAL');
  
  // Verificar se o arquivo .env existe
  if (!fs.existsSync('.env.development.local')) {
    logInfo('Criando arquivo .env.development.local...');
    fs.copyFileSync('.env.development', '.env.development.local');
    logWarning('Configure as variáveis em .env.development.local antes de continuar');
  }
  
  // Iniciar backend
  logInfo('Iniciando backend em segundo plano...');
  const backend = spawn('npm', ['run', 'start:dev'], { 
    cwd: './server',
    detached: true,
    stdio: 'ignore'
  });
  backend.unref();
  
  // Aguardar um pouco
  setTimeout(() => {
    // Iniciar frontend
    logInfo('Iniciando frontend...');
    execCommand('npm run dev', { cwd: './client' });
  }, 3000);
}

// === LIMPEZA === //
function cleanUp() {
  logHeader('🧹 LIMPEZA DO SISTEMA');
  
  // Limpar node_modules
  logInfo('Removendo node_modules...');
  ['./node_modules', './client/node_modules', './server/node_modules'].forEach(dir => {
    if (fs.existsSync(dir)) {
      execCommand(`rm -rf ${dir}`, { ignoreErrors: true });
    }
  });
  
  // Limpar builds
  logInfo('Removendo arquivos de build...');
  ['./client/dist', './server/dist'].forEach(dir => {
    if (fs.existsSync(dir)) {
      execCommand(`rm -rf ${dir}`, { ignoreErrors: true });
    }
  });
  
  // Limpar Docker (opcional)
  if (checkCommand('docker')) {
    logInfo('Limpando containers e imagens Docker...');
    execCommand('docker system prune -f', { ignoreErrors: true });
  }
  
  logSuccess('Limpeza concluída');
}

// === MENU PRINCIPAL === //
function showMenu() {
  console.log(`
${CONFIG.COLORS.CYAN}${CONFIG.COLORS.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                    🚀 ${CONFIG.PROJECT_NAME}                    ║
║                      Deploy Script v${CONFIG.VERSION}                     ║
╚══════════════════════════════════════════════════════════════╝
${CONFIG.COLORS.RESET}

${CONFIG.COLORS.YELLOW}OPÇÕES DISPONÍVEIS:${CONFIG.COLORS.RESET}

${CONFIG.COLORS.GREEN}1.${CONFIG.COLORS.RESET} 🔍 Verificar requisitos do sistema
${CONFIG.COLORS.GREEN}2.${CONFIG.COLORS.RESET} 📦 Instalar dependências
${CONFIG.COLORS.GREEN}3.${CONFIG.COLORS.RESET} 🏗️  Build local
${CONFIG.COLORS.GREEN}4.${CONFIG.COLORS.RESET} 🖥️  Deploy local (desenvolvimento)
${CONFIG.COLORS.GREEN}5.${CONFIG.COLORS.RESET} 🐳 Build Docker (desenvolvimento)
${CONFIG.COLORS.GREEN}6.${CONFIG.COLORS.RESET} 🚀 Deploy Docker (desenvolvimento)
${CONFIG.COLORS.GREEN}7.${CONFIG.COLORS.RESET} 🏭 Build Docker (produção)
${CONFIG.COLORS.GREEN}8.${CONFIG.COLORS.RESET} 🌟 Deploy Docker (produção)
${CONFIG.COLORS.GREEN}9.${CONFIG.COLORS.RESET} 📋 Ver logs dos containers
${CONFIG.COLORS.GREEN}10.${CONFIG.COLORS.RESET} 🧹 Limpar sistema
${CONFIG.COLORS.GREEN}11.${CONFIG.COLORS.RESET} ❌ Sair

${CONFIG.COLORS.YELLOW}DEPLOY RÁPIDO:${CONFIG.COLORS.RESET}
${CONFIG.COLORS.CYAN}• npm run deploy:dev${CONFIG.COLORS.RESET}    - Deploy completo desenvolvimento
${CONFIG.COLORS.CYAN}• npm run deploy:prod${CONFIG.COLORS.RESET}   - Deploy completo produção
`);
}

// === DEPLOY AUTOMATIZADO === //
function quickDeployDev() {
  logHeader('⚡ DEPLOY RÁPIDO - DESENVOLVIMENTO');
  checkSystemRequirements();
  installDependencies();
  dockerBuild('development');
  dockerDeploy('development');
  logSuccess('Deploy de desenvolvimento concluído! 🎉');
}

function quickDeployProd() {
  logHeader('⚡ DEPLOY RÁPIDO - PRODUÇÃO');
  checkSystemRequirements();
  installDependencies();
  buildLocal();
  dockerBuild('production');
  dockerDeploy('production');
  logSuccess('Deploy de produção concluído! 🎉');
}

// === MAIN === //
function main() {
  const args = process.argv.slice(2);
  
  // Comandos diretos
  if (args.includes('--dev') || args.includes('--development')) {
    return quickDeployDev();
  }
  
  if (args.includes('--prod') || args.includes('--production')) {
    return quickDeployProd();
  }
  
  if (args.includes('--check')) {
    return checkSystemRequirements();
  }
  
  if (args.includes('--install')) {
    return installDependencies();
  }
  
  if (args.includes('--clean')) {
    return cleanUp();
  }
  
  if (args.includes('--logs')) {
    return dockerLogs();
  }
  
  // Menu interativo
  showMenu();
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Escolha uma opção (1-11): ', (answer) => {
    rl.close();
    
    switch (answer.trim()) {
      case '1':
        checkSystemRequirements();
        break;
      case '2':
        installDependencies();
        break;
      case '3':
        buildLocal();
        break;
      case '4':
        deployLocal();
        break;
      case '5':
        dockerBuild('development');
        break;
      case '6':
        dockerDeploy('development');
        break;
      case '7':
        dockerBuild('production');
        break;
      case '8':
        dockerDeploy('production');
        break;
      case '9':
        dockerLogs();
        break;
      case '10':
        cleanUp();
        break;
      case '11':
        logInfo('Saindo... Até logo! 👋');
        process.exit(0);
        break;
      default:
        logError('Opção inválida. Execute novamente.');
        process.exit(1);
    }
  });
}

// Executar apenas se for o arquivo principal
if (require.main === module) {
  main();
}

module.exports = {
  checkSystemRequirements,
  installDependencies,
  buildLocal,
  dockerBuild,
  dockerDeploy,
  deployLocal,
  cleanUp,
  quickDeployDev,
  quickDeployProd
};
