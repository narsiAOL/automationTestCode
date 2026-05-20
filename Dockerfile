# Stage 1 - Build Vite App
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2 - Runtime
FROM node:20-alpine

WORKDIR /app

# Lightweight static server
RUN npm install -g serve

# Copy Vite build output
COPY --from=builder /app/dist ./dist

EXPOSE 5549

CMD ["serve", "-s", "dist", "-l", "5549"]
