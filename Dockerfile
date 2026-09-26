# Multi-stage production Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Install system dependencies for native builds if needed
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --no-audit

COPY . .

# Build Vite frontend and server bundles
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3000

# Automated boot: starts server which runs hermetic migrations and seeding on boot
CMD ["npm", "run", "start"]
