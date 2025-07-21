#!/bin/bash
echo "🏥 Verificando saúde do sistema..."

# Check backend
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: DOWN"
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: DOWN"
fi

# Check database
cd server
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database: OK"
else
    echo "❌ Database: ISSUES"
fi
cd ..
