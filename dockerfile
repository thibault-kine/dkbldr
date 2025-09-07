# Étape build
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Déclarer les build args
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Build avec les variables d'environnement
RUN VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    npm run build

# Étape run (serve le dist)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

RUN echo '#!/bin/sh\n\
cat <<EOF > ./dist/env.js\n\
window.__ENV__ = {\n\
  VITE_SUPABASE_URL: \"'$VITE_SUPABASE_URL'\",\n\
  VITE_SUPABASE_ANON_KEY: \"'$VITE_SUPABASE_ANON_KEY'\"\n\
};\n\
EOF\n\
exec \"$@\"' > /entrypoint.sh && chmod +x /entrypoint.sh


EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "3000", "-n", "--listen", "tcp://0.0.0.0:3000"]
