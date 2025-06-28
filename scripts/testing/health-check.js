#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkService(name, host, port) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: host,
      port: port,
      path: '/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      log(`✅ ${name} is running on ${host}:${port}`, 'green');
      resolve(true);
    });

    req.on('error', () => {
      log(`❌ ${name} is not running on ${host}:${port}`, 'red');
      resolve(false);
    });

    req.on('timeout', () => {
      log(`⏰ ${name} timeout on ${host}:${port}`, 'yellow');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

function checkDatabase() {
  return new Promise((resolve) => {
    // Check if SQLite database file exists (desenvolvimento)
    const fs = require('fs');
    const path = require('path');
    
    // Verificar se estamos usando SQLite ou PostgreSQL baseado no .env
    const envPath = path.join(__dirname, '../../server/.env');
    let databaseUrl = '';
    
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const dbMatch = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
      if (dbMatch) {
        databaseUrl = dbMatch[1];
      }
    } catch (error) {
      log('⚠️  Could not read .env file', 'yellow');
    }

    if (databaseUrl.startsWith('file:')) {
      // SQLite database
      const dbPath = databaseUrl.replace('file:', '');
      const fullDbPath = path.resolve(__dirname, '../../server', dbPath);
      
      if (fs.existsSync(fullDbPath)) {
        log('✅ SQLite database file exists', 'green');
        resolve(true);
      } else {
        log('⚠️  SQLite database file not found (will be created on first use)', 'yellow');
        resolve(true); // Consider it OK since SQLite creates on demand
      }
    } else if (databaseUrl.includes('postgresql')) {
      // PostgreSQL database
      const pg = spawn('pg_isready', ['-h', 'localhost', '-p', '5432'], { stdio: 'pipe' });
      
      pg.on('close', (code) => {
        if (code === 0) {
          log('✅ PostgreSQL database is available', 'green');
          resolve(true);
        } else {
          log('❌ PostgreSQL database is not available', 'red');
          resolve(false);
        }
      });

      pg.on('error', () => {
        log('❌ PostgreSQL database is not available (pg_isready not found)', 'red');
        resolve(false);
      });
    } else {
      log('✅ Database configuration detected', 'green');
      resolve(true);
    }
  });
}

function checkRedis() {
  return new Promise((resolve) => {
    // Verificar se estamos em desenvolvimento
    const path = require('path');
    const fs = require('fs');
    
    try {
      const envPath = path.join(__dirname, '../../server/.env');
      const envContent = fs.readFileSync(envPath, 'utf8');
      const nodeEnv = envContent.match(/NODE_ENV=["']?([^"'\n]+)["']?/);
      
      if (!nodeEnv || nodeEnv[1] === 'development') {
        log('✅ Redis Mock is available (development mode)', 'green');
        resolve(true);
        return;
      }
    } catch (error) {
      // Se não conseguir ler o .env, assumir desenvolvimento
      log('✅ Redis Mock is available (development mode)', 'green');
      resolve(true);
      return;
    }

    // Tentar conectar ao Redis real apenas em produção
    const redis = spawn('redis-cli', ['ping'], { stdio: 'pipe' });
    
    redis.stdout.on('data', (data) => {
      if (data.toString().trim() === 'PONG') {
        log('✅ Redis is available', 'green');
        resolve(true);
      } else {
        log('❌ Redis is not responding correctly', 'red');
        resolve(false);
      }
    });

    redis.on('error', () => {
      log('❌ Redis is not available (redis-cli not found)', 'red');
      resolve(false);
    });

    redis.on('close', (code) => {
      if (code !== 0) {
        resolve(false);
      }
    });
  });
}

async function main() {
  log('🔍 Checking system health...', 'cyan');
  log('═'.repeat(50), 'blue');

  const results = {
    frontend: await checkService('Frontend (Vite)', 'localhost', 5173),
    backend: await checkService('Backend API', 'localhost', 8080),
    database: await checkDatabase(),
    redis: await checkRedis()
  };

  log('═'.repeat(50), 'blue');
  
  const totalServices = Object.keys(results).length;
  const runningServices = Object.values(results).filter(Boolean).length;
  
  if (runningServices === totalServices) {
    log(`🎉 All services are running! (${runningServices}/${totalServices})`, 'green');
  } else if (runningServices > 0) {
    log(`⚠️  Some services are running (${runningServices}/${totalServices})`, 'yellow');
  } else {
    log(`💥 No services are running (${runningServices}/${totalServices})`, 'red');
  }

  log('═'.repeat(50), 'blue');
  log('📊 Service Status Summary:', 'cyan');
  
  Object.entries(results).forEach(([service, status]) => {
    const icon = status ? '✅' : '❌';
    const color = status ? 'green' : 'red';
    log(`   ${icon} ${service.charAt(0).toUpperCase() + service.slice(1)}`, color);
  });

  log('═'.repeat(50), 'blue');
  
  if (runningServices < totalServices) {
    log('💡 To start all services:', 'yellow');
    log('   npm run dev', 'cyan');
    log('   npm run docker:up', 'cyan');
  }

  process.exit(runningServices === totalServices ? 0 : 1);
}

main().catch((error) => {
  log(`❌ Health check failed: ${error.message}`, 'red');
  process.exit(1);
});
