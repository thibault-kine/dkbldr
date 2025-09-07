# Étape build
FROM node:20-alpine AS build
WORKDIR /app

# On déclare les variables de build (elles viendront du CI/CD)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# On définit aussi les ENV (Vite lit import.meta.env.VITE_*)
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# On build en injectant les ENV
RUN npm run build

# Étape run : serveur statique avec serve
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000

# L’option -n empêche le cache navigateur
CMD ["serve", "-s", "dist", "-l", "3000", "-n", "--listen", "tcp://0.0.0.0:3000"]
