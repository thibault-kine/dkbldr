# Étape build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --mode-production

# Étape run (serve avec Vite ou un serveur statique)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN echo "window._env_ = { VITE_SUPABASE_URL: '$VITE_SUPABASE_URL', VITE_SUPABASE_ANON_KEY: '$VITE_SUPABASE_ANON_KEY' };" > /app/dist/env.js
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000", "-n", "--listen", "tcp://0.0.0.0:3000"]