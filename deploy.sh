#!/bin/bash
set -e  # stoppe le script si une commande échoue

# ---- CONFIG ----
DOCKER_USER="thibaultkine"
API_NAME="dkbldr-api"
APP_NAME="dkbldr-app"

# ---- Generate TAG (yyyyMMddHHmmss)
TAG=$(date +%Y%m%d%H%M%S)

echo "Using tag: $TAG"

# ---- BUILD API ----
echo "Building API..."
docker build -t $DOCKER_USER/$API_NAME:$TAG ./api

# ---- PUSH API ----
echo "Pushing API image..."
docker push $DOCKER_USER/$API_NAME:$TAG

# ---- BUILD APP ----
echo "Building App..."
docker build -t $DOCKER_USER/$APP_NAME:$TAG ./

# ---- PUSH APP ----
echo "Pushing App image..."
docker push $DOCKER_USER/$APP_NAME:$TAG

echo "Deployment images pushed successfully!"
echo "Use tag $TAG on Railway for deployment."
