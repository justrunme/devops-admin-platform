FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN npm install react-icons recharts @types/recharts

COPY tsconfig.json ./
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]