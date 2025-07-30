const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗑️  Suppression complète et redéploiement à zéro...\n');

try {
  // 1. Vérifier si git est initialisé
  console.log('📋 Vérification de l\'état Git...');
  const isGitRepo = fs.existsSync('.git');
  
  if (isGitRepo) {
    console.log('✅ Repository Git détecté');
    
    // 2. Supprimer tous les fichiers du repository distant
    console.log('\n🗑️  Suppression de tous les fichiers du repository distant...');
    
    try {
      // Créer un fichier .gitkeep temporaire pour éviter de supprimer le repository
      execSync('echo "# Repository en cours de nettoyage" > README.md', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Nettoyage complet du repository"', { stdio: 'inherit' });
      execSync('git push origin main --force', { stdio: 'inherit' });
      console.log('✅ Fichiers supprimés du repository distant');
    } catch (error) {
      console.log('⚠️  Erreur lors de la suppression des fichiers distants:', error.message);
    }
    
    // 3. Supprimer le repository local
    console.log('\n🗑️  Suppression du repository local...');
    execSync('rm -rf .git', { stdio: 'inherit' });
    console.log('✅ Repository local supprimé');
  } else {
    console.log('ℹ️  Aucun repository Git détecté');
  }
  
  // 4. Supprimer tous les fichiers du projet (sauf node_modules et .gitignore)
  console.log('\n🗑️  Nettoyage des fichiers du projet...');
  
  const filesToKeep = [
    'node_modules',
    '.gitignore',
    'package.json',
    'package-lock.json',
    'public',
    'src',
    'tailwind.config.js',
    'postcss.config.js',
    'db.json',
    'json-server.json',
    'scripts'
  ];
  
  const currentFiles = fs.readdirSync('.');
  currentFiles.forEach(file => {
    if (!filesToKeep.includes(file) && !file.startsWith('.')) {
      if (fs.lstatSync(file).isDirectory()) {
        execSync(`rm -rf "${file}"`, { stdio: 'inherit' });
      } else {
        fs.unlinkSync(file);
      }
      console.log(`🗑️  Supprimé: ${file}`);
    }
  });
  
  // 5. Réinitialiser Git
  console.log('\n🔄 Réinitialisation de Git...');
  execSync('git init', { stdio: 'inherit' });
  execSync('git remote add origin https://github.com/meserigne/registre-etat-civil-diplomatie.git', { stdio: 'inherit' });
  console.log('✅ Git réinitialisé');
  
  // 6. Ajouter tous les fichiers
  console.log('\n📁 Ajout de tous les fichiers...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Redéploiement complet - Application Registre État Civil"', { stdio: 'inherit' });
  console.log('✅ Fichiers ajoutés et commités');
  
  // 7. Pousser vers GitHub
  console.log('\n🚀 Déploiement vers GitHub...');
  execSync('git push origin main --force', { stdio: 'inherit' });
  console.log('✅ Déployé vers la branche main');
  
  // 8. Créer et pousser la branche gh-pages
  console.log('\n🌐 Configuration de GitHub Pages...');
  try {
    execSync('git checkout -b gh-pages', { stdio: 'inherit' });
    execSync('git push origin gh-pages --force', { stdio: 'inherit' });
    console.log('✅ Branche gh-pages créée et poussée');
  } catch (error) {
    console.log('⚠️  Erreur lors de la création de gh-pages:', error.message);
  }
  
  // 9. Retourner à la branche main
  execSync('git checkout main', { stdio: 'inherit' });
  
  console.log('\n🎉 Redéploiement complet terminé !');
  console.log('\n📋 Prochaines étapes :');
  console.log('1. Allez sur https://github.com/meserigne/registre-etat-civil-diplomatie');
  console.log('2. Allez dans Settings > Pages');
  console.log('3. Sélectionnez "Deploy from a branch"');
  console.log('4. Choisissez "gh-pages" comme source');
  console.log('5. Cliquez sur "Save"');
  console.log('\n🌐 Votre application sera disponible sur :');
  console.log('https://meserigne.github.io/registre-etat-civil-diplomatie/');
  
} catch (error) {
  console.error('❌ Erreur lors du redéploiement:', error.message);
  console.log('\n🔧 Solutions possibles :');
  console.log('1. Vérifiez que vous avez les permissions sur le repository');
  console.log('2. Assurez-vous que le repository existe sur GitHub');
  console.log('3. Vérifiez votre authentification Git');
} 