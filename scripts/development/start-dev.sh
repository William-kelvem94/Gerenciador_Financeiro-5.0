#!/bin/bash
echo "🚀 Iniciando Will Finance 5.0 em modo desenvolvimento..."

# Kill existing processes
pkill -f "nest start" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend
cd server
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ../client
npm run dev &
FRONTEND_PID=$!

echo "✅ Will Finance 5.0 iniciado!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8080"
echo "📚 API Docs: http://localhost:8080/api/docs"
echo ""
echo "Para parar, pressione Ctrl+C"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
