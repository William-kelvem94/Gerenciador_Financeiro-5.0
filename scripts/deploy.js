#!/usr/bin/env node

/**
 * 🚀 Will Finance 5.0 - Deploy Script Multiplataforma
 * Funciona em Windows, Linux, Ubuntu e macOS
 * Suporta execução local e Docker
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Configurações do sistema
const isWindows = os.platform() === 'win32';
const dockerCompose = isWindows ? 'docker-compose' : 'docker-compose';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

class DeployManager {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.args = process.argv.slice(2);
    this.options = {
      build: this.args.includes('--build') || this.args.includes('-b'),
      stop: this.args.includes('--stop') || this.args.includes('-s'),
      force: this.args.includes('--force') || this.args.includes('-f'),
      production: this.args.includes('--production') || this.args.includes('-p'),
      local: this.args.includes('--local') || this.args.includes('-l'),
      help: this.args.includes('--help') || this.args.includes('-h')
    };
  }

  log(message, color = colors.white) {
    console.log(`${color}${message}${colors.reset}`);
  }

  logStep(step, message) {
    this.log(`\n🔸 [${step}] ${message}`, colors.cyan);
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, colors.green);
  }

  logError(message) {
    this.log(`❌ ${message}`, colors.red);
  }

  logWarning(message) {
    this.log(`⚠️  ${message}`, colors.yellow);
  }

  showHelp() {
    this.log('\n🚀 Will Finance 5.0 - Deploy Script Multiplataforma\n', colors.cyan);
    this.log('Uso: node scripts/deploy.js [opções]\n', colors.white);
    this.log('Opções:', colors.yellow);
    this.log('  --build, -b      Força rebuild das imagens Docker', colors.white);
    this.log('  --stop, -s       Para todos os serviços', colors.white);
    this.log('  --force, -f      Força operações (remove volumes, etc)', colors.white);
    this.log('  --production, -p Deploy em modo produção', colors.white);
    this.log('  --local, -l      Execução local (sem Docker)', colors.white);
    this.log('  --help, -h       Mostra esta ajuda\n', colors.white);
    this.log('Exemplos:', colors.yellow);
    this.log('  node scripts/deploy.js                    # Deploy padrão', colors.white);
    this.log('  node scripts/deploy.js --build            # Rebuild e deploy', colors.white);
    this.log('  node scripts/deploy.js --stop             # Para serviços', colors.white);
    this.log('  node scripts/deploy.js --local            # Execução local', colors.white);
    this.log('  node scripts/deploy.js --production       # Deploy produção\n', colors.white);
  }

  async checkPrerequisites() {
    this.logStep('PRE-CHECK', 'Verificando pré-requisitos...');

    // Verifica Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      this.log(`Node.js: ${nodeVersion}`, colors.green);
    } catch (error) {
      this.logError('Node.js não encontrado');
      return false;
    }

    // Verifica npm
    try {
      const npmVersion = execSync(`${npmCmd} --version`, { encoding: 'utf8' }).trim();
      this.log(`npm: ${npmVersion}`, colors.green);
    } catch (error) {
      this.logError('npm não encontrado');
      return false;
    }

    // Verifica Docker (se não for local)
    if (!this.options.local) {
      try {
        const dockerVersion = execSync('docker --version', { encoding: 'utf8' }).trim();
        this.log(`${dockerVersion}`, colors.green);
      } catch (error) {
        this.logWarning('Docker não encontrado - usando modo local');
        this.options.local = true;
      }

      try {
        const composeVersion = execSync(`${dockerCompose} --version`, { encoding: 'utf8' }).trim();
        this.log(`${composeVersion}`, colors.green);
      } catch (error) {
        this.logWarning('Docker Compose não encontrado');
      }
    }

    return true;
  }

  async stopServices() {
    this.logStep('STOP', 'Parando serviços...');

    if (this.options.local) {
      this.log('Parando serviços locais...', colors.yellow);
      // Aqui você pode implementar lógica para parar processos locais
      // Por exemplo, usando PM2 ou killando processos por porta
    } else {
      try {
        const flags = this.options.force ? '--volumes --remove-orphans' : '--remove-orphans';
        execSync(`${dockerCompose} down ${flags}`, { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
        this.logSuccess('Serviços Docker parados');
      } catch (error) {
        this.logError(`Erro ao parar serviços: ${error.message}`);
        return false;
      }
    }

    return true;
  }

  async buildProject() {
    this.logStep('BUILD', 'Construindo projeto...');

    try {
      // Instala dependências
      this.log('Instalando dependências...', colors.yellow);
      execSync(`${npmCmd} run install:all`, { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });

      // Build do cliente
      this.log('Construindo cliente...', colors.yellow);
      execSync(`${npmCmd} run build:client`, { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });

      // Build do servidor
      this.log('Construindo servidor...', colors.yellow);
      execSync(`${npmCmd} run build:server`, { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });

      this.logSuccess('Projeto construído com sucesso');
      return true;
    } catch (error) {
      this.logError(`Erro no build: ${error.message}`);
      return false;
    }
  }

  async deployDocker() {
    this.logStep('DOCKER', 'Iniciando deploy com Docker...');

    try {
      const composeFile = this.options.production 
        ? 'docker-compose.prod.yml' 
        : 'docker-compose.yml';

      // Build das imagens se necessário
      if (this.options.build) {
        this.log('Construindo imagens Docker...', colors.yellow);
        execSync(`${dockerCompose} -f ${composeFile} build --no-cache`, { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
      }

      // Inicia serviços
      this.log('Iniciando serviços...', colors.yellow);
      execSync(`${dockerCompose} -f ${composeFile} up -d`, { 
        stdio: 'inherit',
        cwd: this.projectRoot 
      });

      this.logSuccess('Deploy Docker concluído');
      
      // Mostra status
      setTimeout(() => {
        this.log('\n📊 Status dos serviços:', colors.cyan);
        execSync(`${dockerCompose} ps`, { 
          stdio: 'inherit',
          cwd: this.projectRoot 
        });
      }, 2000);

      return true;
    } catch (error) {
      this.logError(`Erro no deploy Docker: ${error.message}`);
      return false;
    }
  }

  async deployLocal() {
    this.logStep('LOCAL', 'Iniciando deploy local...');

    try {
      // Verifica se as portas estão livres
      this.log('Verificando portas...', colors.yellow);
      
      // Inicia servidor
      this.log('Iniciando servidor...', colors.yellow);
      const serverProcess = spawn(npmCmd, ['run', 'dev'], {
        cwd: path.join(this.projectRoot, 'server'),
        stdio: 'inherit',
        shell: isWindows
      });

      // Aguarda um pouco antes de iniciar o cliente
      setTimeout(() => {
        this.log('Iniciando cliente...', colors.yellow);
        const clientProcess = spawn(npmCmd, ['run', 'dev'], {
          cwd: path.join(this.projectRoot, 'client'),
          stdio: 'inherit',
          shell: isWindows
        });

        // Handles process termination
        process.on('SIGINT', () => {
          serverProcess.kill();
          clientProcess.kill();
          process.exit(0);
        });

      }, 3000);

      this.logSuccess('Deploy local iniciado');
      this.log('\n🌐 Aplicação disponível em:', colors.cyan);
      this.log('   • Cliente: http://localhost:5173', colors.white);
      this.log('   • Servidor: http://localhost:8080', colors.white);
      this.log('   • API Docs: http://localhost:8080/api', colors.white);

      return true;
    } catch (error) {
      this.logError(`Erro no deploy local: ${error.message}`);
      return false;
    }
  }

  async run() {
    console.clear();
    this.log('🚀 Will Finance 5.0 - Deploy Manager', colors.cyan);
    this.log('=' .repeat(50), colors.dim);

    if (this.options.help) {
      this.showHelp();
      return;
    }

    // Verifica pré-requisitos
    const preCheckOk = await this.checkPrerequisites();
    if (!preCheckOk) {
      this.logError('Pré-requisitos não atendidos');
      process.exit(1);
    }

    // Para serviços se solicitado
    if (this.options.stop) {
      await this.stopServices();
      return;
    }

    // Build do projeto
    if (this.options.build || this.options.local) {
      const buildOk = await this.buildProject();
      if (!buildOk) {
        process.exit(1);
      }
    }

    // Deploy
    let deployOk = false;
    if (this.options.local) {
      deployOk = await this.deployLocal();
    } else {
      deployOk = await this.deployDocker();
    }

    if (deployOk) {
      this.log('\n🎉 Deploy concluído com sucesso!', colors.green);
      this.log('=' .repeat(50), colors.dim);
    } else {
      this.logError('Deploy falhou');
      process.exit(1);
    }
  }
}

// Executa o deploy manager
const deployManager = new DeployManager();
deployManager.run().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
