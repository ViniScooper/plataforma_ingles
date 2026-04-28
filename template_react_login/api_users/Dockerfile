# ─── Stage 1: base ───────────────────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Instala dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o código fonte
COPY . .

# Gera o Prisma Client (precisa do schema.prisma)
RUN npx prisma generate

# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Copia tudo do stage base
COPY --from=base /app .

# Expõe a porta da API
EXPOSE 3002

# Variáveis de ambiente padrão (sobrescritas pelo docker-compose)
ENV PORT=3002
ENV NODE_ENV=production

# Inicia o servidor
CMD ["node", "src/index.js"]
