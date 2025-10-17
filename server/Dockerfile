# --- Stage 1: Dependency Installation ---
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# --- Stage 2: Builder ---
FROM dependencies AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build 

# --- Stage 3: Production ---
FROM node:22-alpine AS production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production --prefer-offline --no-audit

COPY --from=builder /app/dist ./dist
COPY .env.example ./.env.example 

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]