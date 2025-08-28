# Stage 1: Build the application
FROM node:${NODE_VERSION}-alpine AS builder

# Build arguments for flexible configuration
ARG NODE_VERSION=20
ARG DEBIAN_VERSION=alpine
ARG USER_ID=1001
ARG GROUP_ID=1001

# Labels for metadata
LABEL maintainer="Will Finance Team" \
      version="6.0" \
      description="Will Finance 6.0 Backend - Enterprise Financial Management System" \
      org.opencontainers.image.source="https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0" \
      org.opencontainers.image.documentation="https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0/blob/main/README.md"

WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm ci --silent

COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080

CMD ["node", "dist/main"]
