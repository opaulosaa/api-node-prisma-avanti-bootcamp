# Build stage: install all deps and generate Prisma client
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Copy generated Prisma client from builder
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copy source code
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
