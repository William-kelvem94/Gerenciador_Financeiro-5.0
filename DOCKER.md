# 🐳 WILL FINANCE 5.0 - DOCKER DEPLOYMENT GUIDE

Enterprise-grade containerized deployment for the complete financial management system.

## 🎯 Quick Start

### Prerequisites
- Docker Desktop 4.0+ installed and running
- Docker Compose 2.0+ 
- 8GB+ RAM available
- 10GB+ storage space

### 🚀 One-Command Deploy

```powershell
# Windows PowerShell
.\scripts\deploy.ps1

# Or using npm
npm run docker:deploy
```

```bash
# Linux/macOS
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 📊 Services Overview

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| **Frontend** | 80 | React/Vite SPA | http://localhost/health |
| **Backend** | 3001 | NestJS API | http://localhost:3001/health |
| **Database** | 5432 | PostgreSQL 15 | Internal |
| **Redis** | 6379 | Cache & Sessions | Internal |
| **Nginx** | 80,443 | Reverse Proxy | http://localhost/health |

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
# Database
DB_NAME=will_finance
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Application
JWT_SECRET=your_super_secret_jwt_key
VITE_API_URL=http://localhost:3001

# Ports
HTTP_PORT=80
BACKEND_PORT=3001
DB_PORT=5432
```

### 🐳 Docker Commands

```powershell
# Build containers
npm run docker:build

# Start services
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Full restart
npm run docker:restart

# Clean rebuild
npm run docker:rebuild
```

## 📁 Container Architecture

```
will-finance-5.0/
├── frontend (React/Vite + Nginx)
│   ├── Build: Multi-stage (Node.js → Nginx)
│   ├── Port: 80
│   └── Health: /health
├── backend (NestJS)
│   ├── Build: Multi-stage (Builder → Runtime)
│   ├── Port: 3001
│   └── Database: Auto-migration
├── postgres (Database)
│   ├── Volume: postgres_data
│   ├── Init: Custom scripts
│   └── Performance: Optimized
├── redis (Cache)
│   ├── Volume: redis_data
│   ├── Persistence: AOF
│   └── Auth: Password protected
└── nginx (Proxy)
    ├── Frontend: SPA routing
    ├── Backend: API proxying
    └── Static: File serving
```

## 🔒 Security Features

- **Non-root containers**: All services run as dedicated users
- **Network isolation**: Custom bridge network
- **Health checks**: Automated service monitoring
- **Resource limits**: CPU/Memory constraints
- **Security headers**: OWASP compliance
- **File permissions**: Strict access controls

## 📈 Performance Optimizations

- **Multi-stage builds**: Minimal production images
- **Layer caching**: Optimized Dockerfile ordering
- **Gzip compression**: Nginx optimization
- **Static asset caching**: Long-term cache headers
- **Database tuning**: PostgreSQL optimization
- **Connection pooling**: Redis persistence

## 🛠️ Development vs Production

### Development Mode
```powershell
# Regular development
npm run dev

# With Docker (development)
docker-compose -f docker-compose.dev.yml up
```

### Production Mode
```powershell
# Production deployment
npm run docker:deploy

# With SSL (when certificates available)
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d
```

## 📊 Monitoring & Logs

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Health Monitoring
```powershell
# Check service status
docker-compose ps

# Manual health checks
curl http://localhost/health          # Frontend/Nginx
curl http://localhost:3001/health     # Backend API
```

### Container Stats
```powershell
# Resource usage
docker stats

# Detailed inspection
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d will_finance
```

## 🔄 Backup & Recovery

### Database Backup
```powershell
# Create backup
docker-compose exec postgres pg_dump -U postgres will_finance > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres will_finance < backup.sql
```

### Volume Backup
```powershell
# Backup volumes
docker run --rm -v will-finance-50_postgres_data:/data -v ${PWD}:/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v will-finance-50_postgres_data:/data -v ${PWD}:/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```powershell
   # Change ports in .env file
   HTTP_PORT=8080
   BACKEND_PORT=3002
   ```

2. **Database connection issues**
   ```powershell
   # Reset database
   docker-compose down -v
   docker-compose up -d postgres
   # Wait 30 seconds, then start other services
   ```

3. **Build failures**
   ```powershell
   # Clean rebuild
   docker-compose down --rmi all
   docker system prune -af
   npm run docker:rebuild
   ```

4. **Performance issues**
   ```powershell
   # Check resources
   docker stats
   
   # Increase limits in docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 2G
   ```

### Log Analysis
```powershell
# Backend errors
docker-compose logs backend | grep ERROR

# Database issues
docker-compose logs postgres | grep FATAL

# Network issues
docker network inspect will-finance-50_will-finance-network
```

## 🎯 Production Deployment

### Prerequisites
- Production server with Docker
- SSL certificates (optional)
- Domain name configured
- Firewall rules configured

### Steps
1. **Server Setup**
   ```bash
   # Install Docker & Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Clone repository
   git clone https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0.git
   cd Gerenciador_Financeiro-5.0
   ```

2. **Configure Environment**
   ```bash
   # Copy and edit environment
   cp .env.example .env
   nano .env
   
   # Set production values
   NODE_ENV=production
   JWT_SECRET=your_super_secure_production_secret
   DB_PASSWORD=your_production_db_password
   ```

3. **Deploy**
   ```bash
   # Deploy with SSL (if certificates available)
   docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d
   
   # Or standard deployment
   ./scripts/deploy.sh
   ```

4. **Verify**
   ```bash
   # Check all services
   docker-compose ps
   
   # Test endpoints
   curl https://yourdomain.com/health
   curl https://yourdomain.com/api/health
   ```

## 📞 Support

- **Documentation**: `/docs` folder
- **Issues**: GitHub Issues
- **Docker Logs**: `docker-compose logs -f`
- **Health Checks**: Built-in monitoring endpoints

---

## 🎉 Success Checklist

- [ ] All containers running (`docker-compose ps`)
- [ ] Frontend accessible at `http://localhost`
- [ ] Backend API responding at `http://localhost:3001`
- [ ] Database migrations completed
- [ ] Health checks passing
- [ ] Logs showing no errors

**Your Will Finance 5.0 is now running in Docker! 🚀**
