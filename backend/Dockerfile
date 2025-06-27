FROM node:20-alpine

# Update apk packages to reduce vulnerabilities
RUN apk update && apk upgrade

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
