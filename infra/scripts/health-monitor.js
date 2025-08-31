#!/usr/bin/env node

/**
 * Will Finance 5.0 - System Health Monitor
 * Simple health check script for monitoring system status
 */

const axios = require('axios');

const services = [
  {
    name: 'Frontend',
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
    healthPath: '/',
  },
  {
    name: 'Backend',
    url: process.env.BACKEND_URL || 'http://localhost:8080',
    healthPath: '/health',
  },
];

async function checkHealth() {
  console.log('🔍 Will Finance 5.0 - Health Check Report');
  console.log('='.repeat(50));
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log('');

  const results = [];
  
  console.log('🏥 Service Health:');

  for (const service of services) {
    const startTime = Date.now();
    try {
      const response = await axios.get(`${service.url}${service.healthPath}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      const responseTime = Date.now() - startTime;
      const status = response.status < 400 ? 'healthy' : 'unhealthy';
      const statusIcon = status === 'healthy' ? '✅' : '❌';
      
      console.log(`  ${statusIcon} ${service.name}: ${status} (${responseTime}ms)`);
      
      results.push({
        service: service.name,
        status,
        responseTime,
        healthy: status === 'healthy'
      });

    } catch (error) {
      console.log(`  ❌ ${service.name}: unhealthy - ${error.message}`);
      results.push({
        service: service.name,
        status: 'unhealthy',
        error: error.message,
        healthy: false
      });
    }
  }

  console.log('');

  // System info
  const os = require('os');
  const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
  const freeMemory = Math.round(os.freemem() / 1024 / 1024);
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = Math.round((usedMemory / totalMemory) * 100);

  console.log('📊 System Metrics:');
  console.log(`  💾 Memory: ${usedMemory}MB / ${totalMemory}MB (${memoryUsage}%)`);
  console.log(`  ⏱️  Uptime: ${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`);
  console.log('');

  // Overall status
  const allHealthy = results.every(result => result.healthy);
  const overallStatus = allHealthy ? '✅ HEALTHY' : '⚠️  ISSUES DETECTED';
  
  console.log(`🎯 Overall Status: ${overallStatus}`);
  console.log('='.repeat(50));

  return allHealthy;
}

async function main() {
  try {
    const healthy = await checkHealth();
    process.exit(healthy ? 0 : 1);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkHealth };
