#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Redéploiement à zéro sur GitHub...\n');

// Configuration
const GITHUB_USERNAME = 'meserigne';
const REPOSITORY_NAME = 'registre-etat-civil-diplomatie';
const REPOSITORY_URL = `https://github.com/${GITHUB_USERNAME}/${REPOSITORY_NAME}.git`;

console.log('📋 Étapes du redéploiement à zéro :\n');

console.log('1️⃣  Nettoyage complet du repository...');
console.log('2️⃣  Suppression de l\'historique Git...');
console.log('3️⃣  Création d\'un nouveau repository propre...');
console.log('4️⃣  Déploiement de l\'application mise à jour...\n');

try {
  // 1. Sauvegarder les fichiers importants
  console.log('💾 Sauvegarde des fichiers importants...');
  if (fs.existsSync('db.json')) {
    fs.copyFileSync('db.json', 'db_backup.json');
    console.log('✅ Base de données sauvegardée');
  }

  // 2. Supprimer le repository Git local
  console.log('🗑️  Suppression du repository Git local...');
  if (fs.existsSync('.git')) {
    execSync('rm -rf .git', { stdio: 'inherit' });
    console.log('✅ Repository Git local supprimé');
  }

  // 3. Initialiser un nouveau repository Git
  console.log('📁 Initialisation d\'un nouveau repository Git...');
  execSync('git init', { stdio: 'inherit' });
  console.log('✅ Nouveau repository Git initialisé');

  // 4. Configurer Git
  console.log('⚙️  Configuration de Git...');
  execSync('git config user.name "Meserigne"', { stdio: 'inherit' });
  execSync('git config user.email "meserigne@example.com"', { stdio: 'inherit' });
  console.log('✅ Git configuré');

  // 5. Ajouter le remote
  console.log('🔗 Configuration du remote GitHub...');
  execSync(`git remote add origin ${REPOSITORY_URL}`, { stdio: 'inherit' });
  console.log('✅ Remote configuré');

  // 6. Ajouter tous les fichiers
  console.log('📦 Ajout des fichiers...');
  execSync('git add .', { stdio: 'inherit' });
  console.log('✅ Fichiers ajoutés');

  // 7. Premier commit
  console.log('💾 Premier commit...');
  execSync('git commit -m "Initial commit: Application Registre État Civil Diplomatie - Redéploiement à zéro"', { stdio: 'inherit' });
  console.log('✅ Commit créé');

  // 8. Forcer le push (écraser l'historique)
  console.log('🚀 Push forcé vers GitHub...');
  execSync('git push -f origin main', { stdio: 'inherit' });
  console.log('✅ Push forcé réussi');

  // 9. Créer la branche gh-pages
  console.log('🌐 Création de la branche gh-pages...');
  execSync('git checkout -b gh-pages', { stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { stdio: 'inherit' });
  console.log('✅ Branche gh-pages créée');

  // 10. Revenir à la branche main
  execSync('git checkout main', { stdio: 'inherit' });

  console.log('\n🎉 Redéploiement à zéro terminé avec succès !');
  console.log(`📱 Votre application sera disponible à : https://${GITHUB_USERNAME}.github.io/${REPOSITORY_NAME}`);
  console.log('⏰ Attendez 5-10 minutes pour le premier déploiement.');

  // 11. Instructions pour activer GitHub Pages
  console.log('\n📋 Prochaines étapes :');
  console.log(`1. Allez sur : ${REPOSITORY_URL}`);
  console.log('2. Cliquez sur "Settings"');
  console.log('3. Dans le menu de gauche, cliquez sur "Pages"');
  console.log('4. Dans "Source", sélectionnez "Deploy from a branch"');
  console.log('5. Dans "Branch", sélectionnez "gh-pages" et "/ (root)"');
  console.log('6. Cliquez sur "Save"');

  // 12. Restaurer la base de données si nécessaire
  if (fs.existsSync('db_backup.json')) {
    fs.copyFileSync('db_backup.json', 'db.json');
    console.log('✅ Base de données restaurée');
  }

} catch (error) {
  console.error('\n❌ Erreur lors du redéploiement :', error.message);
  console.log('\n🔧 Solutions possibles :');
  console.log('1. Vérifiez que vous êtes connecté à GitHub : gh auth status');
  console.log('2. Vérifiez que le repository existe sur GitHub');
  console.log('3. Vérifiez vos permissions sur le repository');
  console.log('4. Essayez de supprimer et recréer le repository sur GitHub');
}

console.log('\n📞 Si vous avez des problèmes :');
console.log('1. Vérifiez l\'authentification GitHub : gh auth status');
console.log('2. Vérifiez que le repository est PUBLIC');
console.log('3. Vérifiez que GitHub Pages est activé');
console.log('4. Attendez quelques minutes pour le premier déploiement'); 