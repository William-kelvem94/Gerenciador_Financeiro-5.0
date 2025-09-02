# 🚀 Will Finance 6.0 - Complete Cyberpunk Financial Management System

> **Enterprise-grade financial management system** with cutting-edge cyberpunk design, AI-powered insights, and full-stack modern architecture.

![Will Finance 6.0](./imagem_gerada%20(2).png)

## 🎯 What's New in Version 6.0

### ✨ **Complete Technology Stack Upgrade**
- **🛡️ Backend**: Migrated from Express to **NestJS** with modular architecture
- **⚡ Frontend**: Enhanced **React 18 + Vite + TypeScript + Zustand**
- **🤖 AI Module**: Dedicated **FastAPI** service with ML capabilities
- **🐳 Infrastructure**: Production-ready **Docker** configuration
- **📱 PWA**: Progressive Web App with offline capabilities

### 🎨 **Enhanced Cyberpunk Interface**
- **Matrix Rain Effects**: Animated background visuals
- **Neon Glow Components**: Interactive UI elements with cyberpunk aesthetics
- **Advanced Animations**: Framer Motion powered micro-interactions
- **Responsive Design**: Mobile-first approach with PWA support
- **Dark Theme Optimization**: Enhanced contrast and visual hierarchy

### 🤖 **Integrated AI Capabilities**
- **Smart Transaction Classification**: Automatic expense categorization
- **Savings Suggestions**: Personalized financial optimization tips
- **Budget Predictions**: ML-powered expense forecasting
- **OCR Processing**: Extract data from bank statements (PDF/images)
- **Pattern Recognition**: Detect spending anomalies and trends

## 🏗️ Architecture Overview

```
Will Finance 6.0/
├── 📱 client/              # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── stores/        # Zustand state management
│   │   ├── lib/           # API client and utilities
│   │   └── types/         # TypeScript definitions
│   ├── public/            # Static assets and PWA config
│   └── package.json       # Frontend dependencies
│
├── 🛡️ server/              # NestJS Backend API
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── transactions/  # Transaction management
│   │   ├── budgets/       # Budget management
│   │   ├── reports/       # Financial reports
│   │   └── prisma/        # Database service
│   ├── prisma/            # Database schema and migrations
│   └── package.json       # Backend dependencies
│
├── 🤖 IA/                  # AI/ML FastAPI Service
│   ├── api/               # FastAPI REST endpoints
│   ├── models/            # ML models and training
│   ├── services/          # AI business logic
│   └── requirements.txt   # Python dependencies
│
├── 🗄️ data/                # Sample data and migrations
├── 📄 docs/                # Comprehensive documentation
├── 🔧 scripts/             # Development and deployment utilities
├── 🐳 docker-compose.yml   # Multi-service orchestration
└── 📋 package.json         # Monorepo configuration
```

## 🚀 Quick Start

### Option 1: One-Command Setup (Recommended)
```bash
git clone https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0.git
cd Gerenciador_Financeiro-5.0
npm run setup
```

### Option 2: Manual Development Setup
```bash
# Install all dependencies
npm run install:all

# Setup database with sample data
npm run db:setup

# Start all services in development mode
npm run dev

# Or with AI service included
npm run dev:ai
```

### Option 3: Docker Production Environment
```bash
# Start all services with Docker
npm run docker:up

# With AI service
npm run docker:ai

# View logs
npm run docker:logs
```

## 🌐 Service URLs

- **🎨 Frontend (Client)**: http://localhost:5173
- **🛡️ Backend API**: http://localhost:8080
- **🤖 AI Service**: http://localhost:8001
- **📊 API Documentation**: http://localhost:8080/api/docs
- **🤖 AI Documentation**: http://localhost:8001/docs
- **📈 Prisma Studio**: http://localhost:5555
- **🗄️ PostgreSQL**: localhost:5432
- **⚡ Redis Cache**: localhost:6379

## 📊 Complete Feature Set

### ✅ **Core Financial Management**
- **💰 Transaction Management**: CRUD operations with real-time updates
- **📋 Budget Planning**: Create, monitor, and track financial goals
- **📊 Advanced Reports**: Dynamic charts and financial analytics
- **🏦 Multi-Account Support**: Manage multiple bank accounts
- **🏷️ Smart Categories**: Auto-categorization with custom rules
- **📱 Multi-Currency**: Support for multiple currencies

### ✅ **Smart Automation**
- **🤖 AI Transaction Classification**: Automatic expense categorization
- **💡 Savings Suggestions**: Personalized financial optimization
- **🔮 Predictive Analytics**: Budget forecasting and trend analysis
- **📄 OCR Processing**: Extract data from bank statements
- **🔔 Smart Notifications**: Proactive financial alerts
- **📈 Goal Tracking**: Automated progress monitoring

### ✅ **Modern User Experience**
- **🎨 Cyberpunk Design**: Immersive dark theme with neon accents
- **📱 PWA Support**: Install as native mobile/desktop app
- **⚡ Real-time Updates**: Live data synchronization
- **🌙 Dark Mode**: Optimized for low-light usage
- **🎭 Animations**: Smooth transitions and micro-interactions
- **♿ Accessibility**: WCAG compliance and screen reader support

### ✅ **Enterprise Security**
- **🔐 JWT Authentication**: Secure token-based auth
- **🌐 Google OAuth**: Social login integration
- **🛡️ Data Encryption**: End-to-end security
- **⚠️ Input Validation**: Comprehensive data sanitization
- **🚫 Rate Limiting**: DDoS protection
- **📝 Audit Logging**: Complete activity tracking

### ✅ **Developer Experience**
- **📚 Comprehensive Documentation**: API docs and guides
- **🧪 Testing Suite**: Unit, integration, and E2E tests
- **🔧 Development Tools**: Hot reload, debugging, profiling
- **🐳 Docker Support**: Containerized development and production
- **📊 Monitoring**: Health checks and performance metrics
- **🔄 CI/CD Ready**: Automated deployment pipelines

## 📋 Available Scripts

### Development
```bash
npm run dev              # Start frontend + backend
npm run dev:ai           # Start all services including AI
npm run dev:client       # Frontend only
npm run dev:server       # Backend only
npm run dev:silent       # Silent mode (no logs)
```

### Database Management
```bash
npm run db:setup         # Complete database setup
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database
```

### Building & Testing
```bash
npm run build            # Build all services
npm run test             # Run all tests
npm run lint             # Lint all code
npm run clean            # Clean build artifacts
```

### Docker Operations
```bash
npm run docker:up        # Start all containers
npm run docker:down      # Stop all containers
npm run docker:build     # Rebuild containers
npm run docker:logs      # View container logs
npm run docker:ai        # Start with AI service
```

## 🚀 **DEPLOY MULTIPLATAFORMA - NOVO!**

### ⚡ **Deploy em 1 Comando**
```bash
# Desenvolvimento
npm run deploy:quick:dev

# Produção  
npm run deploy:quick:prod

# Menu Interativo
npm run deploy:master
```

### 🌍 **Compatibilidade Total**
- ✅ **Windows** (10/11)
- ✅ **Linux** (Ubuntu, Debian, CentOS)
- ✅ **macOS**
- ✅ **Docker** (Local + Produção)
- ✅ **Execução Local**

### 📊 **Recursos Implementados**
- 🛡️ **Segurança Avançada**: Rate limiting, headers de segurança
- ⚡ **Performance**: Gzip, cache, resource limits
- 🏥 **Health Checks**: Monitoramento automatizado
- 🧹 **Zero Duplicidade**: Arquitetura limpa e organizada

📖 **[Guia Completo de Deploy](./docs/DEPLOY_MULTIPLATAFORMA.md)**

---

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://will_finance:cyberpunk2077@localhost:5432/will_finance_db"

# Authentication
JWT_SECRET="your-secure-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Service
AI_API_URL="http://localhost:8001"
AI_API_KEY="your-ai-api-key"

# Optional: Email, Analytics, etc.
```

### Database Setup
The system uses PostgreSQL with Prisma ORM:

1. **Automatic Setup**: `npm run db:setup`
2. **Manual Setup**:
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Apply database migrations
   npm run db:seed      # Insert sample data
   ```

## 🚀 Deployment

### Production Docker Deployment
```bash
# Clone and setup
git clone <repository-url>
cd Gerenciador_Financeiro-5.0

# Configure environment
cp .env.example .env
# Edit .env with production values

# Deploy with Docker
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Manual Production Deployment
```bash
# Build all services
npm run build

# Setup production database
npm run db:migrate

# Start production server
npm run start
```

## 🎨 Demo Credentials

For testing the complete system:

```
Email: demo@willfinance.com
Password: demo123
```

**Demo includes:**
- Pre-configured accounts and categories
- Sample transactions across multiple months
- Budget examples and goals
- AI classification examples

## 🔮 Roadmap

### 🔄 **Currently in Development**
- **📱 Mobile App**: React Native application
- **💻 Desktop App**: Electron wrapper
- **🔗 Open Banking**: Brazilian bank API integration
- **📊 Advanced Analytics**: Machine learning insights
- **🌍 Multi-language**: i18n support

### 📈 **Future Enhancements**
- **👥 Multi-user**: Family/business account management
- **🔔 Push Notifications**: Real-time alerts
- **📱 Widget Support**: Home screen widgets
- **🎯 Investment Tracking**: Portfolio management
- **💳 Credit Score**: Integration with credit bureaus

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

- 📖 **Documentation**: [Complete Docs](./docs/)
- 🐛 **Bug Reports**: [GitHub Issues](./issues)
- 💡 **Feature Requests**: [GitHub Discussions](./discussions)
- 💬 **Community**: [Discord Server](#)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🌟 Acknowledgments

- **Design Inspiration**: Cyberpunk 2077, Matrix, Blade Runner
- **Open Source Libraries**: React, NestJS, Prisma, FastAPI
- **Community**: Amazing developers who contribute to open source

---

**Built with ❤️ by the Will Finance Team**

🚀 **Experience the Future of Financial Management** 🚀

[⭐ Star this repo](../../stargazers) | [🍴 Fork it](../../fork) | [📊 View Demo](#) | [📖 Read Docs](./docs/)
