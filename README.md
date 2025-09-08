# Dkbldg

Dkbldg est une application web destinée aux joueurs de Magic: The Gathering (MTG) pour faciliter la création, la gestion et le partage de decks EDH.  
Elle propose une interface moderne, mobile-first et optimisée en **PWA**, avec une aide intelligente pour sélectionner les meilleures cartes.

---

## ✨ Features

- 🔎 **Deck Builder intelligent** avec suggestions basées sur l’archétype choisi  
- 🗂️ **Organisation automatique des cartes** par type (Créature, Éphémère, Artefact, etc.)  
- 📱 **Progressive Web App (PWA)** : utilisable hors-ligne et installable sur mobile  
- 🎨 **UI moderne** grâce à **React + Vite + JoyUI**  
- 🔐 **Authentification sécurisée** via **Supabase** et **JWT**  
- 📊 **Fonctionnalités sociales** : consulter, partager et suivre les decks des autres utilisateurs  

---

## 🚀 Installation et Déploiement Local

### 1. Cloner le projet
```bash
git clone https://github.com/ton-compte/dkbldg.git
cd dkbldg
```

### 2. Configurer les variables d'environnement
Créer un `.env` à la racine du projet avec les clés suivantes (à obtenir depuis Supabase) :
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

### 3a. Démarrer en local avec Docker
Assurez-vous d'avoir Docker et Docker Compose installés, puis lancez :
```bash
docker-composer up --build
```
L'application sera accessible sur http://localhost:3000/

### 3b. Démarrage manuel (sans Docker)
Installez les dépendances, puis lancez le front-end et le back-end séparément :
```bash
# Front-end (./)
npm install
npm run dev

# Back-end (./api/)
npm install
node index.js
```

### Stack Technique
- **Front-end :** React + Vite (JoyUI pour l'interface utilisateur)
- **Back-end :** Node.js + Express
- **Base de données & Auth :** Supabase (Postgres + JWT)
- **Déploiement :** Docker + Railway

