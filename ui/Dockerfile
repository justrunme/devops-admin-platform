FROM node:20-alpine

WORKDIR /app

COPY package.json ./package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]