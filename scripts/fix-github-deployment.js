#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Correction du déploiement GitHub...\n');

// Configuration correcte
const GITHUB_USERNAME = 'MrsCoulibaly';
const REPOSITORY_NAME = 'registre-etat-civil-diplomatie';
const REPOSITORY_URL = `https://github.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}.git`;

console.log('📋 Instructions pour corriger le déploiement :\n');

console.log('1️⃣  Créez le repository sur GitHub :');
console.log(`   - Allez sur : https://github.com/${GITHUB_USERNAME}`);
console.log(`   - Cliquez sur "New repository"`);
console.log(`   - Nommez-le : ${REPOSITORY_NAME}`);
console.log(`   - Rendez-le PUBLIC (important pour GitHub Pages)`);
console.log(`   - Ne cochez pas "Initialize with README"`);
console.log(`   - Cliquez sur "Create repository"\n`);

console.log('2️⃣  Configurez Git localement :');
console.log(`   git remote set-url origin ${REPOSITORY_URL}`);
console.log(`   git push -u origin main\n`);

console.log('3️⃣  Activez GitHub Pages :');
console.log(`   - Allez sur : ${REPOSITORY_URL}`);
console.log(`   - Cliquez sur "Settings"`);
console.log(`   - Dans le menu de gauche, cliquez sur "Pages"`);
console.log(`   - Dans "Source", sélectionnez "Deploy from a branch"`);
console.log(`   - Dans "Branch", sélectionnez "gh-pages" et "/ (root)"`);
console.log(`   - Cliquez sur "Save"\n`);

console.log('4️⃣  URL correcte de votre application :');
console.log(`   https://${GITHUB_USERNAME.toLowerCase()}.github.io/${REPOSITORY_NAME}\n`);

// Vérifier si le repository existe
try {
  console.log('🔍 Vérification du repository...');
  const response = execSync(`curl -s -o /dev/null -w "%{http_code}" https://github.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}`, { encoding: 'utf8' });
  
  if (response.trim() === '200') {
    console.log('✅ Repository trouvé !');
    console.log('Vous pouvez maintenant configurer Git et pousser votre code.\n');
    
    console.log('🚀 Commandes à exécuter :');
    console.log(`git remote set-url origin ${REPOSITORY_URL}`);
    console.log('git add .');
    console.log('git commit -m "Initial commit: Application Registre État Civil Diplomatie"');
    console.log('git push -u origin main');
    
  } else {
    console.log('❌ Repository non trouvé.');
    console.log('Veuillez créer le repository sur GitHub d\'abord.\n');
  }
} catch (error) {
  console.log('❌ Erreur lors de la vérification :', error.message);
  console.log('Veuillez créer le repository manuellement sur GitHub.\n');
}

console.log('📞 Si vous avez des problèmes :');
console.log('1. Vérifiez que vous êtes connecté au bon compte GitHub');
console.log('2. Vérifiez que le repository est PUBLIC');
console.log('3. Vérifiez que GitHub Pages est activé');
console.log('4. Attendez quelques minutes pour le premier déploiement'); 