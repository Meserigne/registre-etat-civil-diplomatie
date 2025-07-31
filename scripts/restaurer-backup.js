const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 SCRIPT DE RESTAURATION DU BACKUP COMPLET\n');

// Fonction pour lister les backups disponibles
function listerBackups() {
  const documentsPath = path.join(process.env.HOME, 'Documents');
  const fichiers = fs.readdirSync(documentsPath);
  const backups = fichiers.filter(f => f.startsWith('BACKUP_COMPLET_Registre_New_'));
  
  if (backups.length === 0) {
    console.log('❌ Aucun backup complet trouvé dans ~/Documents/');
    return [];
  }
  
  console.log('📦 Backups complets disponibles :');
  backups.sort().forEach((backup, index) => {
    const stats = fs.statSync(path.join(documentsPath, backup));
    const date = stats.mtime.toLocaleString('fr-FR');
    const tailleMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`${index + 1}. ${backup} (${date}) - ${tailleMB} MB`);
  });
  
  return backups;
}

// Fonction pour restaurer un backup
function restaurerBackup(nomBackup) {
  const documentsPath = path.join(process.env.HOME, 'Documents');
  const cheminBackup = path.join(documentsPath, nomBackup);
  const cheminActuel = path.join(documentsPath, 'Registre_New');
  
  if (!fs.existsSync(cheminBackup)) {
    console.log('❌ Backup introuvable !');
    return false;
  }
  
  try {
    console.log(`🔄 Restauration du backup : ${nomBackup}`);
    
    // Arrêter les processus en cours
    try {
      execSync('pkill -f "react-scripts"', { stdio: 'ignore' });
      execSync('pkill -f "json-server"', { stdio: 'ignore' });
      execSync('pkill -f "node"', { stdio: 'ignore' });
    } catch (e) {
      // Ignorer les erreurs si aucun processus n'est en cours
    }
    
    // Supprimer le dossier actuel
    if (fs.existsSync(cheminActuel)) {
      console.log('🗑️  Suppression de l\'ancienne version...');
      execSync(`rm -rf "${cheminActuel}"`, { stdio: 'inherit' });
    }
    
    // Créer le nouveau dossier
    console.log('📁 Création du nouveau dossier...');
    fs.mkdirSync(cheminActuel, { recursive: true });
    
    // Copier le backup
    console.log('📋 Copie du backup...');
    execSync(`cp -r "${cheminBackup}"/* "${cheminActuel}/"`, { stdio: 'inherit' });
    
    // Installer les dépendances
    console.log('📦 Installation des dépendances...');
    execSync('npm install', { stdio: 'inherit', cwd: cheminActuel });
    
    console.log('✅ RESTAURATION TERMINÉE !');
    console.log('\n📋 Prochaines étapes :');
    console.log('1. cd ~/Documents/Registre_New');
    console.log('2. npm start');
    console.log('3. npm run server (dans un autre terminal)');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error.message);
    return false;
  }
}

// Fonction principale
function main() {
  const backups = listerBackups();
  
  if (backups.length === 0) {
    return;
  }
  
  // Utiliser le backup le plus récent par défaut
  const backupRecente = backups.sort().pop();
  console.log(`\n🔄 Restauration automatique du backup le plus récent : ${backupRecente}`);
  
  if (restaurerBackup(backupRecente)) {
    console.log('\n🎉 Application restaurée avec succès !');
    console.log('\n🌐 Votre application est maintenant accessible sur :');
    console.log('   http://localhost:3000/registre-etat-civil-diplomatie');
    console.log('   http://localhost:3001 (serveur JSON)');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { listerBackups, restaurerBackup }; 