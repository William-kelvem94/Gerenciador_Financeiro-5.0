# Will Finance 5.0 - Professional Financial Management System

A modern, secure, and scalable financial management system built with React, TypeScript, Express, and Prisma.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with rate limiting
- **Transaction Management**: Complete CRUD operations with atomic balance updates
- **Budget Tracking**: Create and monitor budgets with spending analysis
- **Account Management**: Multiple account types with real-time balance tracking
- **Category System**: Organize transactions with customizable categories

### Security & Architecture
- **Database Transactions**: Atomic operations using Prisma transactions
- **Rate Limiting**: Configurable limits for sensitive endpoints
- **Input Validation**: Comprehensive Zod schema validation with UUID enforcement
- **Error Handling**: Detailed error messages with proper HTTP status codes
- **CORS Protection**: Strict CORS configuration for security
- **Data Sanitization**: Removal of sensitive data from API responses

### Developer Experience
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript implementation across the stack
- **Code Quality**: ESLint and Prettier configured for consistent code style
- **Testing**: Jest setup for backend unit and integration tests
- **Hot Reload**: Development servers with hot reload for both frontend and backend

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger UI
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Charts**: Recharts for data visualization

## 📦 Installation

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gerenciador_Financeiro-5.0
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Server (.env)
   cp server/.env.example server/.env
   
   # Client (.env)
   cp client/.env.example client/.env
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- API Documentation: http://localhost:8080/api-docs

## 🔧 Development

### Available Scripts

#### Root Project
```bash
npm run install:all     # Install all dependencies
npm run dev            # Start both frontend and backend
npm run build          # Build both projects
npm run clean          # Clean all node_modules and dist folders
```

#### Backend (`/server`)
```bash
npm run dev            # Start development server with hot reload
npm run build          # Build TypeScript to JavaScript
npm run start          # Start production server
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:studio      # Open Prisma Studio
npm run db:seed        # Seed database with example data
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
npm run lint           # Check code quality
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Prettier
```

#### Frontend (`/client`)
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Check code quality
```

### Database Management

The project uses Prisma with SQLite for development. To modify the database schema:

1. Edit `server/prisma/schema.prisma`
2. Generate migration: `npm run db:migrate`
3. Apply changes: `npm run db:generate`

### API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation using Zod schemas
- **CORS Protection**: Strict cross-origin resource sharing policies
- **Helmet Security**: Security headers for protection against common attacks
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **UUID Validation**: Strict UUID validation for entity relationships

## 🧪 Testing

### Backend Tests
Run backend tests with:
```bash
cd server
npm test
```

Tests include:
- Authentication flow (register, login, token verification)
- Database operations (CRUD operations)
- Validation middleware
- Error handling

### Frontend Tests
Frontend testing with React Testing Library is configured but tests need to be added:
```bash
cd client
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List transactions (with pagination)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## 🎨 Frontend Architecture

### State Management
The application uses Zustand for state management with the following stores:
- `authStore`: User authentication state
- `transactionStore`: Transaction data and operations
- `budgetStore`: Budget data and operations

### Custom Hooks
- `useTransactions`: Transaction CRUD operations
- `useBudgets`: Budget CRUD operations
- `useAuth`: Authentication operations

### Route Protection
The application includes proper route protection that validates JWT tokens server-side, ensuring security beyond client-side state management.

## 🚀 Deployment

### Environment Variables

#### Server
```env
PORT=8080
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Client
```env
VITE_API_URL=http://localhost:8080/api
```

### Production Build
```bash
npm run build
```

The built files will be in:
- Backend: `server/dist/`
- Frontend: `client/dist/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ by the Will Finance Team