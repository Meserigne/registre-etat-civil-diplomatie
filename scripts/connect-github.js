#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔗 Configuration de la connexion GitHub...\n');

// Configuration du repository
const GITHUB_USERNAME = 'MrsCoulibaly';
const REPOSITORY_NAME = 'registre-etat-civil-diplomatie';
const REPOSITORY_URL = `https://github.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}.git`;

try {
  // Vérifier si Git est installé
  console.log('📋 Vérification de Git...');
  execSync('git --version', { stdio: 'inherit' });
  
  // Initialiser Git si pas déjà fait
  if (!fs.existsSync('.git')) {
    console.log('📁 Initialisation de Git...');
    execSync('git init', { stdio: 'inherit' });
  }
  
  // Configurer le remote
  console.log('🔗 Configuration du remote GitHub...');
  try {
    execSync(`git remote set-url origin ${REPOSITORY_URL}`, { stdio: 'inherit' });
  } catch (error) {
    execSync(`git remote add origin ${REPOSITORY_URL}`, { stdio: 'inherit' });
  }
  
  // Ajouter tous les fichiers
  console.log('📦 Ajout des fichiers...');
  execSync('git add .', { stdio: 'inherit' });
  
  // Commit initial
  console.log('💾 Commit initial...');
  execSync('git commit -m "Initial commit: Application Registre État Civil Diplomatie"', { stdio: 'inherit' });
  
  // Pousser vers GitHub
  console.log('🚀 Push vers GitHub...');
  execSync('git push -u origin main', { stdio: 'inherit' });
  
  console.log('\n✅ Configuration GitHub terminée avec succès !');
  console.log(`📱 Votre application est maintenant connectée à: ${REPOSITORY_URL}`);
  
  // Créer le workflow GitHub Actions pour le déploiement automatique
  console.log('\n🔧 Configuration du déploiement automatique...');
  
  const workflowsDir = '.github/workflows';
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }
  
  const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
`;
  
  fs.writeFileSync(path.join(workflowsDir, 'deploy.yml'), workflowContent);
  
  // Ajouter et commiter le workflow
  execSync('git add .github/', { stdio: 'inherit' });
  execSync('git commit -m "Add GitHub Actions workflow for automatic deployment"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  
  console.log('\n🎉 Configuration terminée !');
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Allez sur https://github.com/MrsCoulibaly/registre-etat-civil-diplomatie');
  console.log('2. Dans Settings > Pages, activez GitHub Pages');
  console.log('3. Sélectionnez la branche "gh-pages" comme source');
  console.log('4. Votre application sera disponible en quelques minutes');
  
} catch (error) {
  console.error('\n❌ Erreur lors de la configuration:', error.message);
  console.log('\n🔧 Solutions possibles:');
  console.log('1. Vérifiez que vous êtes connecté à GitHub CLI: gh auth login');
  console.log('2. Vérifiez que le repository existe sur GitHub');
  console.log('3. Vérifiez vos permissions sur le repository');
} 