#!/bin/bash
echo "🚀 Iniciando Will Finance 5.0 em modo produção..."

# Build projects
npm run build

# Start server
cd server
npm run start:prod
