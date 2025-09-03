FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Installer serve globalement
RUN npm install -g serve

# Copier les fichiers buildés
COPY --from=builder /app/dist ./dist

# Utilise la variable PORT de Railway, avec 3000 comme fallback
ENV PORT=${PORT:-3000}

EXPOSE $PORT

# Utiliser la variable PORT pour serve
CMD ["sh", "-c", "serve -s dist -p $PORT"]