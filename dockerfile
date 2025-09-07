# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer deps
RUN npm install

# Copier le reste
COPY . .

# Injecter les variables d'environnement pour le build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Build avec les variables
RUN VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    npm run build


# Étape run : serveur statique avec serve
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000

# L’option -n empêche le cache navigateur
CMD ["serve", "-s", "dist", "-l", "3000", "-n", "--listen", "tcp://0.0.0.0:3000"]
