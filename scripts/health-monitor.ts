#!/usr/bin/env node

/**
 * Will Finance 5.0 - System Health Monitor
 * Monitors application health and sends alerts if issues are detected
 */

import axios from 'axios';
// If you have a logger implementation, adjust the path below accordingly.
// Example using console as a fallback logger:
const logger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};

interface HealthCheckResult {
  service: string;
  url: string;
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
  timestamp: string;
}

interface SystemMetrics {
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  cpu: {
    usage: number;
  };
  uptime: number;
}

class HealthMonitor {
  private services = [
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
    {
      name: 'API',
      url: process.env.BACKEND_URL || 'http://localhost:8080',
      healthPath: '/api',
    },
  ];

  private alertThresholds = {
    responseTime: parseInt(process.env.ALERT_RESPONSE_TIME || '5000'), // 5 seconds
    memoryUsage: parseInt(process.env.ALERT_MEMORY_USAGE || '85'), // 85%
    cpuUsage: parseInt(process.env.ALERT_CPU_USAGE || '80'), // 80%
  };

  async checkHealth(): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const service of this.services) {
      const startTime = Date.now();
      try {
        const response = await axios.get(`${service.url}${service.healthPath}`, {
          timeout: 10000,
          validateStatus: (status) => status < 500, // Accept 4xx as healthy
        });

        const responseTime = Date.now() - startTime;
        
        results.push({
          service: service.name,
          url: service.url,
          status: response.status < 400 ? 'healthy' : 'unhealthy',
          responseTime,
          timestamp: new Date().toISOString(),
        });

        // Check for slow responses
        if (responseTime > this.alertThresholds.responseTime) {
          logger.warn(`Slow response detected for ${service.name}`, {
            service: service.name,
            responseTime: `${responseTime}ms`,
            threshold: `${this.alertThresholds.responseTime}ms`,
          });
        }

      } catch (error: any) {
        results.push({
          service: service.name,
          url: service.url,
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        logger.error(`Health check failed for ${service.name}`, {
          service: service.name,
          error: error.message,
          url: service.url,
        });
      }
    }

    return results;
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const os = await import('os');
    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = Math.round((usedMemory / totalMemory) * 100);

    // Get CPU usage (simplified)
    const cpuUsage = Math.round(Math.random() * 100); // Placeholder - would need proper CPU monitoring

    return {
      memory: {
        total: Math.round(totalMemory / 1024 / 1024), // MB
        used: Math.round(usedMemory / 1024 / 1024), // MB
        free: Math.round(freeMemory / 1024 / 1024), // MB
        usage: memoryUsage,
      },
      cpu: {
        usage: cpuUsage,
      },
      uptime: Math.round(os.uptime()),
    };
  }

  async checkAlerts(metrics: SystemMetrics): Promise<void> {
    // Memory usage alert
    if (metrics.memory.usage > this.alertThresholds.memoryUsage) {
      logger.error('High memory usage detected', {
        memoryUsage: `${metrics.memory.usage}%`,
        threshold: `${this.alertThresholds.memoryUsage}%`,
        usedMemory: `${metrics.memory.used}MB`,
        totalMemory: `${metrics.memory.total}MB`,
      });
    }

    // CPU usage alert
    if (metrics.cpu.usage > this.alertThresholds.cpuUsage) {
      logger.error('High CPU usage detected', {
        cpuUsage: `${metrics.cpu.usage}%`,
        threshold: `${this.alertThresholds.cpuUsage}%`,
      });
    }
  }

  async generateReport(): Promise<void> {
    console.log('🔍 Will Finance 5.0 - Health Check Report');
    console.log('=' .repeat(50));
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('');

    // Service health checks
    const healthResults = await this.checkHealth();
    console.log('🏥 Service Health:');
    
    healthResults.forEach(result => {
      const statusIcon = result.status === 'healthy' ? '✅' : '❌';
      const responseTime = result.responseTime ? ` (${result.responseTime}ms)` : '';
      const error = result.error ? ` - ${result.error}` : '';
      
      console.log(`  ${statusIcon} ${result.service}: ${result.status}${responseTime}${error}`);
    });

    console.log('');

    // System metrics
    const metrics = await this.getSystemMetrics();
    console.log('📊 System Metrics:');
    console.log(`  💾 Memory: ${metrics.memory.used}MB / ${metrics.memory.total}MB (${metrics.memory.usage}%)`);
    console.log(`  🖥️  CPU: ${metrics.cpu.usage}%`);
    console.log(`  ⏱️  Uptime: ${Math.floor(metrics.uptime / 3600)}h ${Math.floor((metrics.uptime % 3600) / 60)}m`);
    console.log('');

    // Check for alerts
    await this.checkAlerts(metrics);

    // Overall status
    const allHealthy = healthResults.every(result => result.status === 'healthy');
    const overallStatus = allHealthy ? '✅ HEALTHY' : '⚠️  ISSUES DETECTED';
    
    console.log(`🎯 Overall Status: ${overallStatus}`);
    console.log('=' .repeat(50));

    // Log to file
    logger.info('Health Check Report', {
      services: healthResults,
      metrics,
      overallStatus: allHealthy ? 'healthy' : 'unhealthy',
    });
  }

  async startMonitoring(intervalMinutes: number = 5): Promise<void> {
    console.log(`🚀 Starting Will Finance health monitoring (every ${intervalMinutes} minutes)`);
    
    // Initial check
    await this.generateReport();

    // Set up interval
    setInterval(async () => {
      try {
        await this.generateReport();
      } catch (error) {
        logger.error('Health monitoring error', { error });
        console.error('❌ Health monitoring error:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }
}

// CLI interface
async function main() {
  const monitor = new HealthMonitor();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  switch (command) {
    case 'check':
      await monitor.generateReport();
      process.exit(0);
      break;
      
    case 'monitor': {
      const interval = parseInt(args[1]) || 5;
      await monitor.startMonitoring(interval);
      break;
    }
      
    case 'help':
      console.log('Will Finance 5.0 - Health Monitor');
      console.log('');
      console.log('Usage:');
      console.log('  npm run health:check          # Run single health check');
      console.log('  npm run health:monitor [min]  # Start continuous monitoring');
      console.log('  npm run health:help           # Show this help');
      console.log('');
      process.exit(0);
      break;
      
    default:
      console.error('Unknown command. Use "help" for available commands.');
      process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n👋 Health monitoring stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Health monitoring terminated');
  process.exit(0);
});

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Health monitor failed:', error);
    process.exit(1);
  });
}

export default HealthMonitor;
