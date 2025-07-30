#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage de la publication sur GitHub...');

// Configuration
const REPO_NAME = 'registre-etat-civil-diplomatie';
const GITHUB_USER = 'AwCoulibaly';
const REPO_URL = `https://github.com/${GITHUB_USER}/${REPO_NAME}.git`;

// Fonctions utilitaires
function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} réussi`);
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    process.exit(1);
  }
}

function createFile(filePath, content) {
  console.log(`📝 Création de ${filePath}...`);
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${filePath} créé`);
}

// Vérifier que Git est installé
try {
  execSync('git --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Git n\'est pas installé. Veuillez installer Git d\'abord.');
  process.exit(1);
}

// Étape 1: Build de l'application
console.log('\n🔨 Build de l\'application...');
runCommand('npm run build', 'Build de l\'application');

// Étape 2: Initialiser Git si pas déjà fait
if (!fs.existsSync('.git')) {
  console.log('\n📁 Initialisation de Git...');
  runCommand('git init', 'Initialisation de Git');
  runCommand('git add .', 'Ajout des fichiers');
  runCommand('git commit -m "Initial commit - Registre État Civil Diplomatie"', 'Premier commit');
}

// Étape 3: Ajouter le remote GitHub
console.log('\n🔗 Configuration du remote GitHub...');
try {
  execSync(`git remote add origin ${REPO_URL}`, { stdio: 'ignore' });
  console.log('✅ Remote GitHub ajouté');
} catch (error) {
  console.log('ℹ️ Remote GitHub déjà configuré');
}

// Étape 4: Créer le workflow GitHub Actions
const workflowDir = '.github/workflows';
if (!fs.existsSync(workflowDir)) {
  fs.mkdirSync(workflowDir, { recursive: true });
}

const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

createFile('.github/workflows/deploy.yml', workflowContent);

// Étape 5: Créer un README diplomatique
const readmeContent = `# Registre d'État Civil - Diplomatie Ivoirienne

## 🇨🇮 Application de Gestion du Registre d'État Civil

Application web moderne pour la gestion complète du registre d'état civil dans le cadre diplomatique ivoirien.

### 🚀 Fonctionnalités Principales

#### 📋 Gestion des Dossiers
- Création et suivi des dossiers d'état civil
- Numérotation automatique des dossiers
- Statuts de traitement en temps réel
- Recherche et filtrage avancés
- Export des données (CSV, JSON)

#### 👥 Gestion des Agents
- Interface dédiée pour les agents
- Assignation automatique et manuelle des dossiers
- Suivi des performances
- Gestion des disponibilités

#### 📄 Création d'Actes Officiels
- Génération d'actes de naissance, décès, mariage
- Format PDF A4 conforme aux standards officiels
- Impression directe
- Templates diplomatiques

#### 🔄 Système de Dispatching
- Assignation intelligente des dossiers
- Répartition automatique selon les charges
- Interface de réassignation
- Suivi des délais de traitement

#### 👤 Gestion des Utilisateurs
- Système de rôles (Admin, Super Admin, Agent)
- Gestion sécurisée des mots de passe
- Interface de création de comptes
- Contrôle d'accès granulaire

### 🛠️ Technologies Utilisées

- **Frontend**: React.js avec hooks modernes
- **Styling**: Tailwind CSS pour un design responsive
- **Icons**: Lucide React
- **PDF**: jsPDF et html2canvas
- **Stockage**: localStorage avec API JSON Server
- **Déploiement**: GitHub Pages avec Actions

### 📊 Fonctionnalités Avancées

#### 📈 Statistiques et Rapports
- Tableaux de bord en temps réel
- Graphiques de performance
- Rapports PDF automatisés
- Métriques de productivité

#### 🔒 Sécurité et Sauvegarde
- Authentification sécurisée
- Sauvegarde automatique des données
- Export/Import de données
- Synchronisation GitHub optionnelle

#### 🌍 Adaptation Côte d'Ivoire
- Informations consulares spécifiques
- Formats officiels ivoiriens
- Terminologie diplomatique
- Données de test locales

### 🚀 Démarrage Rapide

1. **Accès à l'application** : https://awcoulibaly.github.io/registre-etat-civil-diplomatie

2. **Connexion par défaut** :
   - Username: \`admin\`
   - Password: \`admin123\`

3. **Premiers pas** :
   - Créer un nouveau dossier
   - Ajouter des agents
   - Tester la création d'actes
   - Explorer le dispatching

### 📱 Interface Responsive

L'application s'adapte parfaitement à tous les écrans :
- 💻 Ordinateurs de bureau
- 📱 Tablettes
- 📱 Smartphones
- 🖥️ Écrans tactiles

### 🔧 Configuration Technique

#### Prérequis
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Connexion Internet pour le déploiement
- Git pour les mises à jour

#### Installation Locale
\`\`\`bash
git clone https://github.com/AwCoulibaly/registre-etat-civil-diplomatie.git
cd registre-etat-civil-diplomatie
npm install
npm start
\`\`\`

### 📞 Support

Pour toute question ou problème technique :
- 📧 Email : Aw.coulibaly@diplomatie.gouv.ci
- 🏢 Service : Direction de la Diplomatie
- 📍 Localisation : Côte d'Ivoire

### 📋 Roadmap

#### ✅ Fonctionnalités Implémentées
- [x] Gestion complète des dossiers
- [x] Interface agent dédiée
- [x] Création d'actes PDF
- [x] Système de dispatching
- [x] Gestion des utilisateurs
- [x] Statistiques avancées
- [x] Export/Import de données
- [x] Interface responsive

#### 🔄 Fonctionnalités Futures
- [ ] Synchronisation cloud avancée
- [ ] API REST complète
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Intégration biométrique
- [ ] Signature électronique

### 📄 Licence

Application développée pour le Ministère des Affaires Étrangères de Côte d'Ivoire.
Usage réservé aux services diplomatiques ivoiriens.

---

**Développé avec ❤️ pour la Diplomatie Ivoirienne**

*Version 1.0 - 2024*
`;

createFile('README.md', readmeContent);

// Étape 6: Commiter et pousser
console.log('\n📤 Envoi vers GitHub...');
runCommand('git add .', 'Ajout des nouveaux fichiers');
runCommand('git commit -m "feat: Publication automatique - Registre État Civil Diplomatie"', 'Commit des changements');

// Essayer de pousser sur main, sinon créer la branche
try {
  runCommand('git push -u origin main', 'Push sur la branche main');
} catch (error) {
  console.log('🔄 Création de la branche main...');
  runCommand('git branch -M main', 'Renommage en main');
  runCommand('git push -u origin main', 'Push sur main');
}

// Étape 7: Instructions finales
console.log('\n🎉 Publication terminée avec succès !');
console.log('\n📋 Prochaines étapes :');
console.log('1. Allez sur https://github.com/AwCoulibaly/registre-etat-civil-diplomatie');
console.log('2. Vérifiez que le code est bien poussé');
console.log('3. Allez dans Settings > Pages');
console.log('4. Activez GitHub Pages sur la branche main');
console.log('5. Votre application sera disponible sur :');
console.log('   https://awcoulibaly.github.io/registre-etat-civil-diplomatie');
console.log('\n⏱️ Le déploiement prendra quelques minutes...');
console.log('\n🔑 Connexion par défaut :');
console.log('   Username: admin');
console.log('   Password: admin123'); 