# 🚀 WILL-FINANCE - Setup Instructions

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (version 14 or higher) - [Download here](https://www.postgresql.org/download/)
- **Redis** (version 6 or higher) - [Download here](https://redis.io/download/)
- **Git** - [Download here](https://git-scm.com/downloads)

### Optional
- **Docker** and **Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
cd "c:\Users\willi\Documents\PROJETOS\CORETEMP-SOUNDPAD\Gerenciador_Financeiro-4.0\WILL-FINANCE"
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all project dependencies (client + server)
npm run install:all
```

### 3. Environment Setup
```bash
# Copy environment template
copy .env.example .env

# Edit the .env file with your configuration
# Use your preferred text editor to modify the .env file
```

**Important Environment Variables to Update:**
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `OPENAI_API_KEY`: Your OpenAI API key (optional, for AI features)
- `REDIS_URL`: Your Redis connection string

### 4. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d postgres redis

# Wait for services to be ready (about 30 seconds)
timeout /t 30

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

#### Option B: Using Local Installation
```bash
# Make sure PostgreSQL and Redis are running on your system

# Create database (run this in PostgreSQL command line)
createdb will_finance_db

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 5. Start the Development Server
```bash
# Start both client and server in development mode
npm run dev
```

This will start:
- **Frontend (React)**: http://localhost:3000
- **Backend (Node.js API)**: http://localhost:3001

### 6. Access the Application

Open your browser and navigate to:
- **Main Application**: http://localhost:3000
- **API Health Check**: http://localhost:3001/health

**Demo Login Credentials:**
- Email: `demo@willfinance.com`
- Password: `cyberpunk2077`

## 🐳 Docker Installation (Alternative)

If you prefer to run everything in Docker:

```bash
# Start all services
docker-compose up -d

# Wait for all services to be ready
timeout /t 60

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
```

## 🔧 Development Commands

### Database Operations
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply new migration
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
cd server && npm run db:studio
```

### Development
```bash
# Start development servers
npm run dev

# Start only the client
npm run dev:client

# Start only the server
npm run dev:server

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing
```bash
# Run all tests
npm run test

# Run client tests
npm run test:client

# Run server tests
npm run test:server
```

### Building for Production
```bash
# Build both client and server
npm run build

# Start production server
npm start
```

## 📊 Features Overview

### ✅ Currently Implemented
- Modern cyberpunk-themed UI with Tailwind CSS
- Complete authentication system (login/register/JWT)
- PostgreSQL database with Prisma ORM
- Redis caching layer
- Real-time WebSocket connections
- Account management system
- User profile and preferences
- Comprehensive error handling
- Docker containerization
- Development and production configurations

### 🔄 In Development
- Transaction management
- Budget tracking and alerts
- Financial goal setting
- Advanced analytics dashboard
- AI-powered insights
- Expense categorization
- Receipt uploading
- Reporting system

### 🎯 Planned Features
- Mobile-responsive PWA
- Bank account integration
- Bill reminders
- Investment tracking
- Multi-currency support
- Data export/import
- Advanced security features
- API rate limiting

## 🎨 UI/UX Features

- **Cyberpunk Theme**: Neon colors, glowing effects, futuristic design
- **Dark Mode**: Native dark mode with cyberpunk aesthetics
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism**: Modern glass-like UI elements
- **Accessibility**: WCAG compliant design patterns

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation with Zod
- SQL injection prevention
- XSS protection

## 📱 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for state management
- **React Hook Form** for forms
- **Recharts** for data visualization
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **PostgreSQL** for data storage
- **Redis** for caching
- **Socket.io** for WebSockets
- **JWT** for authentication
- **Winston** for logging

### DevOps
- **Docker** containerization
- **Docker Compose** for orchestration
- **PostgreSQL** database
- **Redis** cache
- **Nginx** load balancer (optional)

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   # Windows: Check Services or run in Docker
   docker-compose up -d postgres
   ```

2. **Redis Connection Error**
   ```bash
   # Check if Redis is running
   docker-compose up -d redis
   ```

3. **Port Already in Use**
   ```bash
   # Kill processes using ports 3000 or 3001
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   # Use Task Manager to end the processes
   ```

4. **Prisma Client Not Generated**
   ```bash
   npm run db:generate
   ```

5. **Environment Variables Not Loaded**
   - Ensure `.env` file exists in the root directory
   - Check that all required variables are set
   - Restart the development server

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are correctly set
3. Ensure all dependencies are installed
4. Check that database and Redis are running
5. Restart the development servers

## 📈 Performance Optimization

- Database indexing for fast queries
- Redis caching for frequently accessed data
- Code splitting and lazy loading
- Image optimization
- Gzip compression
- CDN-ready static assets

## 🔮 Future Enhancements

- Machine learning for expense prediction
- Blockchain integration for secure transactions
- Voice commands for hands-free operation
- Augmented reality expense tracking
- Advanced data visualization
- Social features for family budgeting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

Created with ❤️ by William

---

Happy coding! 🚀
