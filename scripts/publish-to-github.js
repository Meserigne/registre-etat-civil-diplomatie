#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration pour Aw.coulibaly@diplomatie.gouv.ci
const GITHUB_USERNAME = 'AwCoulibaly';
const REPO_NAME = 'registre-etat-civil-diplomatie';
const BRANCH = 'main';

console.log('🚀 Démarrage de la publication sur GitHub...');
console.log(`👤 Utilisateur: ${GITHUB_USERNAME}`);
console.log(`📦 Repository: ${REPO_NAME}`);
console.log(`🏛️ Service: Ministère des Affaires Étrangères - Côte d'Ivoire`);

// Fonction pour exécuter une commande avec gestion d'erreur
function runCommand(command, description) {
  try {
    console.log(`\n📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} terminé avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    process.exit(1);
  }
}

// Fonction pour vérifier si git est initialisé
function checkGitStatus() {
  try {
    execSync('git status', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction pour créer le fichier de configuration GitHub Pages
function createGitHubPagesConfig() {
  const config = {
    name: "Deploy to GitHub Pages",
    on: {
      push: {
        branches: [BRANCH]
      }
    },
    jobs: {
      build_and_deploy: {
        runs_on: "ubuntu-latest",
        steps: [
          {
            name: "Checkout",
            uses: "actions/checkout@v3"
          },
          {
            name: "Setup Node.js",
            uses: "actions/setup-node@v3",
            with: {
              "node-version": "18"
            }
          },
          {
            name: "Install dependencies",
            run: "npm install"
          },
          {
            name: "Build",
            run: "npm run build"
          },
          {
            name: "Deploy to GitHub Pages",
            uses: "peaceiris/actions-gh-pages@v3",
            with: {
              github_token: "${{ secrets.GITHUB_TOKEN }}",
              publish_dir: "./build"
            }
          }
        ]
      }
    }
  };

  const workflowsDir = '.github/workflows';
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(workflowsDir, 'deploy.yml'),
    `# Configuration automatique pour GitHub Pages
# Ministère des Affaires Étrangères - Côte d'Ivoire
# Aw.coulibaly@diplomatie.gouv.ci

name: Deploy to GitHub Pages
on:
  push:
    branches: [${BRANCH}]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
`
  );

  console.log('✅ Configuration GitHub Pages créée');
}

// Fonction pour créer le README diplomatique
function createDiplomaticREADME() {
  const readme = `# 🏛️ Registre État Civil - Diplomatie CI

## 📋 Description

Application de gestion du registre d'état civil pour le **Ministère des Affaires Étrangères de Côte d'Ivoire**.

### 👤 Responsable
- **Email** : Aw.coulibaly@diplomatie.gouv.ci
- **Service** : Consulat de Côte d'Ivoire
- **Organisation** : Ministère des Affaires Étrangères

## 🚀 Fonctionnalités

### ✅ Gestion Diplomatique
- **Circonscription consulaire** : Côte d'Ivoire
- **Centre** : ABIDJAN
- **Timbre fiscal** : République de Côte d'Ivoire
- **Sceau officiel** : Ministère des Affaires Étrangères

### 📋 Types d'Actes
- ✅ **Extrait acte Naissance** avec sceau diplomatique
- ✅ **Extrait acte Mariage** avec timbre fiscal
- ✅ **Extrait acte Décès** avec certification officielle
- ✅ **Livret de famille** diplomatique
- ✅ **Rectification** et **Transcription** officielles

### 🔐 Sécurité Diplomatique
- ✅ **Repository privé** pour données sensibles
- ✅ **Accès restreint** aux agents diplomatiques
- ✅ **Audit trail** complet des modifications
- ✅ **Backup automatique** des actes officiels

## 🛠️ Installation

\`\`\`bash
# Cloner le repository
git clone https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
cd ${REPO_NAME}

# Installer les dépendances
npm install

# Démarrer les serveurs
npm run server  # Base de données (port 3001)
npm start       # Application React (port 3000)
\`\`\`

## 📊 Structure des Données

\`\`\`json
{
  "metadata": {
    "organisation": "Ministère des Affaires Étrangères",
    "pays": "Côte d'Ivoire",
    "centre": "ABIDJAN",
    "email": "Aw.coulibaly@diplomatie.gouv.ci",
    "version": "1.0.0"
  },
  "dossiers": [...],
  "actes": [...],
  "agents": [...],
  "utilisateurs": [...]
}
\`\`\`

## 🔧 Configuration

### Variables d'Environnement
\`\`\`bash
REACT_APP_GITHUB_CLIENT_ID=votre_client_id
REACT_APP_GITHUB_CLIENT_SECRET=votre_client_secret
REACT_APP_GITHUB_OWNER=${GITHUB_USERNAME}
REACT_APP_GITHUB_REPO=${REPO_NAME}
REACT_APP_ORGANISATION="Ministère des Affaires Étrangères"
REACT_APP_PAYS="Côte d'Ivoire"
REACT_APP_CENTRE="ABIDJAN"
\`\`\`

## 🎯 Utilisation

1. **Connexion** : super_admin / admin123
2. **Onglet Dossiers** : Gestion des dossiers diplomatiques
3. **Onglet Actes** : Création d'actes officiels
4. **Onglet Dispatching** : Assignation aux agents consulaires
5. **GitHub Integration** : Sauvegarde sécurisée sur GitHub

## 📞 Support

- **Email** : Aw.coulibaly@diplomatie.gouv.ci
- **Service** : Consulat de Côte d'Ivoire
- **Documentation** : GUIDE_CONFIGURATION_AW_COULIBALY.md

## 🏛️ Conformité Diplomatique

Cette application respecte les normes diplomatiques et les procédures officielles du Ministère des Affaires Étrangères de Côte d'Ivoire.

---

**© Ministère des Affaires Étrangères - Côte d'Ivoire** 🇨🇮
`;

  fs.writeFileSync('README.md', readme);
  console.log('✅ README diplomatique créé');
}

// Fonction principale
async function publishToGitHub() {
  console.log('\n🏛️ Configuration pour Ministère des Affaires Étrangères');
  console.log('📧 Email: Aw.coulibaly@diplomatie.gouv.ci');
  console.log('🇨🇮 Pays: Côte d\'Ivoire');
  console.log('🏢 Centre: ABIDJAN\n');

  // Vérifier si git est initialisé
  if (!checkGitStatus()) {
    console.log('🔧 Initialisation de Git...');
    runCommand('git init', 'Initialisation de Git');
    runCommand(`git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`, 'Ajout du remote GitHub');
  }

  // Créer les fichiers de configuration
  createGitHubPagesConfig();
  createDiplomaticREADME();

  // Ajouter tous les fichiers
  runCommand('git add .', 'Ajout des fichiers');

  // Commit avec message diplomatique
  const commitMessage = `🏛️ Initialisation - Registre État Civil Diplomatique

📋 Ministère des Affaires Étrangères - Côte d'Ivoire
👤 Aw.coulibaly@diplomatie.gouv.ci
🇨🇮 Centre: ABIDJAN
🔐 Repository privé pour données sensibles

✅ Configuration GitHub Pages
✅ README diplomatique
✅ Intégration GitHub OAuth
✅ Sécurité renforcée`;

  runCommand(`git commit -m "${commitMessage}"`, 'Commit des changements');

  // Push vers GitHub
  runCommand(`git push -u origin ${BRANCH}`, 'Push vers GitHub');

  console.log('\n🎉 Publication terminée avec succès !');
  console.log(`🌐 URL de l'application: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}`);
  console.log(`📦 Repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`);
  console.log('\n🏛️ Configuration diplomatique activée !');
  console.log('📧 Contact: Aw.coulibaly@diplomatie.gouv.ci');
}

// Exécuter le script
publishToGitHub().catch(console.error); 