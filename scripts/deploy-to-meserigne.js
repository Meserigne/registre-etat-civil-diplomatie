#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Déploiement sur le compte Meserigne\n');

// Configuration pour votre compte
const GITHUB_USERNAME = 'meserigne';
const REPOSITORY_NAME = 'registre-etat-civil-diplomatie';
const REPOSITORY_URL = `https://github.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}.git`;

console.log('📋 Étapes pour déployer sur votre compte :\n');

console.log('1️⃣  Créez le repository sur GitHub :');
console.log(`   - Allez sur : https://github.com/${GITHUB_USERNAME}`);
console.log(`   - Cliquez sur "New repository"`);
console.log(`   - Nommez-le : ${REPOSITORY_NAME}`);
console.log(`   - Rendez-le PUBLIC (important pour GitHub Pages)`);
console.log(`   - Ne cochez pas "Initialize with README"`);
console.log(`   - Cliquez sur "Create repository"\n`);

console.log('2️⃣  Configurez Git :');
console.log(`   git remote set-url origin ${REPOSITORY_URL}`);
console.log(`   git push -u origin main\n`);

console.log('3️⃣  Activez GitHub Pages :');
console.log(`   - Allez sur : ${REPOSITORY_URL}`);
console.log(`   - Cliquez sur "Settings"`);
console.log(`   - Dans le menu de gauche, cliquez sur "Pages"`);
console.log(`   - Dans "Source", sélectionnez "Deploy from a branch"`);
console.log(`   - Dans "Branch", sélectionnez "gh-pages" et "/ (root)"`);
console.log(`   - Cliquez sur "Save"\n`);

console.log('4️⃣  URL de votre application :');
console.log(`   https://${GITHUB_USERNAME}.github.io/${REPOSITORY_NAME}\n`);

// Vérifier si le repository existe
try {
  console.log('🔍 Vérification du repository...');
  const response = execSync(`curl -s -o /dev/null -w "%{http_code}" https://github.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}`, { encoding: 'utf8' });
  
  if (response.trim() === '200') {
    console.log('✅ Repository trouvé !');
    console.log('Configuration automatique...\n');
    
    // Configurer Git automatiquement
    try {
      execSync(`git remote set-url origin ${REPOSITORY_URL}`, { stdio: 'inherit' });
      console.log('✅ Remote configuré !');
      
      execSync('git add .', { stdio: 'inherit' });
      console.log('✅ Fichiers ajoutés !');
      
      execSync('git commit -m "Initial commit: Application Registre État Civil Diplomatie"', { stdio: 'inherit' });
      console.log('✅ Commit créé !');
      
      console.log('\n🚀 Pushing vers GitHub...');
      execSync('git push -u origin main', { stdio: 'inherit' });
      console.log('✅ Push réussi !');
      
      console.log('\n🎉 Déploiement terminé !');
      console.log(`📱 Votre application sera disponible à : https://${GITHUB_USERNAME}.github.io/${REPOSITORY_NAME}`);
      console.log('⏰ Attendez 5-10 minutes pour le premier déploiement.');
      
    } catch (error) {
      console.log('❌ Erreur lors du déploiement :', error.message);
      console.log('Vérifiez que vous êtes connecté à GitHub : gh auth login');
    }
    
  } else {
    console.log('❌ Repository non trouvé.');
    console.log('Veuillez créer le repository sur GitHub d\'abord.\n');
  }
} catch (error) {
  console.log('❌ Erreur lors de la vérification :', error.message);
  console.log('Veuillez créer le repository manuellement sur GitHub.\n');
}

console.log('\n📞 Si vous avez des problèmes :');
console.log('1. Vérifiez que vous êtes connecté à GitHub : gh auth status');
console.log('2. Vérifiez que le repository est PUBLIC');
console.log('3. Vérifiez que GitHub Pages est activé');
console.log('4. Attendez quelques minutes pour le premier déploiement'); 