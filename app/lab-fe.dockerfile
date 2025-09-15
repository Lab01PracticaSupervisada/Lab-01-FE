# =========================
# Stage 1: deps 
# =========================
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# Instala solo a partir de manifest para aprovechar cache
COPY package*.json ./
RUN npm install

# =========================
# Stage 2: build (compila TypeScript a /dist)
# =========================
FROM node:22-bookworm-slim AS build
WORKDIR /app

# Copia node_modules del stage deps
COPY --from=deps /app/node_modules ./node_modules
# Copia el resto del código 
COPY react ./
COPY tsconfig.json ./
COPY src ./src

# Compila a dist/
RUN npm run build

# =========================
# Stage 3: runner 
# =========================
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Define el puerto de la aplicación
ENV PORT=8080

# Copia artefactos 
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Instala solo deps de producción
RUN npm ci --omit=dev && npm cache clean --force

# Usuario no root incluido en la imagen oficial
USER node

# Comando de arranque
CMD ["node", "dist/index.js"]