# Étape build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape run
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

# Crée un script d’entrée
# On utilise un "here document" propre pour éviter les problèmes d'échappement
RUN cat > /entrypoint.sh <<'EOF'
#!/bin/sh
cat <<EOT > /app/dist/env.js
window.__ENV__ = {
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL}",
  VITE_SUPABASE_ANON_KEY: "${VITE_SUPABASE_ANON_KEY}"
};
EOT

exec "$@"
EOF

# Donne les droits d’exécution
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "3000", "-n", "--listen", "tcp://0.0.0.0:3000"]
