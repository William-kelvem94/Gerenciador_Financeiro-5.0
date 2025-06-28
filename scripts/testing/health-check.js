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
    // Try to connect to PostgreSQL
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
  });
}

function checkRedis() {
  return new Promise((resolve) => {
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
