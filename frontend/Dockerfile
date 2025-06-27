FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5173

EXPOSE 5173

EXPOSE 5173

# Comando para iniciar a aplicação
CMD ["npm", "run", "preview"]
