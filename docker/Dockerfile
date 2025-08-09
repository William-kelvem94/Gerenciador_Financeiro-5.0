# Dockerfile para Will Finance 5.0
FROM node:20-alpine AS base
WORKDIR /app

# Instala dependências do client
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install

# Instala dependências do server
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install

# Copia código
COPY client ./client
COPY server ./server

# Build client
RUN cd client && npm run build

# Build server
RUN cd server && npm run build

EXPOSE 8080
CMD ["node", "server/dist/index.js"]
