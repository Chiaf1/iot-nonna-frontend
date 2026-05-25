# Stage 1: install dependencies
FROM node:24-alpine AS deps
WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm@9.15.4 --ignore-scripts

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Stage 2: build
FROM node:24-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9.15.4 --ignore-scripts

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Stage 3: final image - runtime
FROM node:24-slim AS runtime
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV API_URL=http://localhost:3030
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]