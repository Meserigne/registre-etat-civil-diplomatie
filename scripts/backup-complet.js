const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('💾 BACKUP COMPLET DE L\'APPLICATION\n');

// Fonction pour créer un backup complet
function creerBackupComplet() {
  const documentsPath = path.join(process.env.HOME, 'Documents');
  const cheminActuel = path.join(documentsPath, 'Registre_New');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const nomBackup = `BACKUP_COMPLET_Registre_New_${timestamp}`;
  const cheminBackup = path.join(documentsPath, nomBackup);
  
  if (!fs.existsSync(cheminActuel)) {
    console.log('❌ Dossier Registre_New introuvable dans ~/Documents/');
    return false;
  }
  
  try {
    console.log(`🔄 Création du backup complet : ${nomBackup}`);
    
    // Arrêter tous les processus en cours
    try {
      execSync('pkill -f "react-scripts"', { stdio: 'ignore' });
      execSync('pkill -f "json-server"', { stdio: 'ignore' });
      execSync('pkill -f "node"', { stdio: 'ignore' });
    } catch (e) {
      // Ignorer les erreurs si aucun processus n'est en cours
    }
    
    // Créer le dossier de backup
    if (!fs.existsSync(cheminBackup)) {
      fs.mkdirSync(cheminBackup, { recursive: true });
    }
    
    // Copier tout le projet
    console.log('📁 Copie de tous les fichiers...');
    execSync(`cp -r "${cheminActuel}"/* "${cheminBackup}/"`, { stdio: 'inherit' });
    
    // Copier les fichiers cachés (.gitignore, etc.)
    try {
      execSync(`cp -r "${cheminActuel}/.gitignore" "${cheminBackup}/" 2>/dev/null || true`, { stdio: 'ignore' });
    } catch (e) {
      // Ignorer si .gitignore n'existe pas
    }
    
    // Créer un fichier d'information du backup
    const infoBackup = {
      date: new Date().toISOString(),
      nom: nomBackup,
      chemin: cheminBackup,
      version: '1.0',
      description: 'Backup complet de l\'application Registre d\'État Civil',
      contenu: [
        'Application React complète',
        'Base de données JSON Server',
        'Tous les composants et scripts',
        'Configuration et dépendances',
        'Logo officiel et assets',
        'Scripts de déploiement'
      ]
    };
    
    fs.writeFileSync(
      path.join(cheminBackup, 'INFO_BACKUP.json'),
      JSON.stringify(infoBackup, null, 2)
    );
    
    // Créer un script de restauration automatique
    const scriptRestauration = `#!/bin/bash
echo "🔄 RESTAURATION AUTOMATIQUE DU BACKUP"
echo "======================================"

# Vérifier si le backup existe
if [ ! -d "${cheminBackup}" ]; then
    echo "❌ Backup introuvable: ${cheminBackup}"
    exit 1
fi

# Arrêter les processus existants
echo "🛑 Arrêt des processus existants..."
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "json-server" 2>/dev/null || true
pkill -f "node" 2>/dev/null || true

# Supprimer le dossier actuel s'il existe
if [ -d "${cheminActuel}" ]; then
    echo "🗑️  Suppression de l'ancienne version..."
    rm -rf "${cheminActuel}"
fi

# Créer le nouveau dossier
echo "📁 Création du nouveau dossier..."
mkdir -p "${cheminActuel}"

# Copier le backup
echo "📋 Copie du backup..."
cp -r "${cheminBackup}"/* "${cheminActuel}/"

# Installer les dépendances
echo "📦 Installation des dépendances..."
cd "${cheminActuel}"
npm install

echo "✅ RESTAURATION TERMINÉE !"
echo "🌐 Pour démarrer l'application :"
echo "   cd ${cheminActuel}"
echo "   npm start"
echo "   npm run server"
`;

    fs.writeFileSync(
      path.join(cheminBackup, 'restaurer.sh'),
      scriptRestauration
    );
    
    // Rendre le script exécutable
    execSync(`chmod +x "${path.join(cheminBackup, 'restaurer.sh')}"`, { stdio: 'ignore' });
    
    // Vérifier la taille du backup
    const stats = fs.statSync(cheminBackup);
    const tailleMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('\n✅ BACKUP COMPLET CRÉÉ AVEC SUCCÈS !');
    console.log(`📁 Dossier : ${cheminBackup}`);
    console.log(`📊 Taille : ${tailleMB} MB`);
    console.log(`🕒 Date : ${new Date().toLocaleString('fr-FR')}`);
    
    // Lister tous les backups
    listerBackups();
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création du backup:', error.message);
    return false;
  }
}

// Fonction pour lister tous les backups
function listerBackups() {
  const documentsPath = path.join(process.env.HOME, 'Documents');
  const fichiers = fs.readdirSync(documentsPath);
  const backups = fichiers.filter(f => f.startsWith('BACKUP_COMPLET_Registre_New_'));
  
  if (backups.length > 0) {
    console.log('\n📦 Tous les backups complets disponibles :');
    backups.sort().forEach((backup, index) => {
      const stats = fs.statSync(path.join(documentsPath, backup));
      const date = stats.mtime.toLocaleString('fr-FR');
      const tailleMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`${index + 1}. ${backup} (${date}) - ${tailleMB} MB`);
    });
  }
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
  if (creerBackupComplet()) {
    console.log('\n🎉 BACKUP COMPLET TERMINÉ !');
    console.log('\n📋 Pour restaurer en cas de problème :');
    console.log('1. cd ~/Documents');
    console.log('2. ./BACKUP_COMPLET_Registre_New_[DATE]/restaurer.sh');
    console.log('3. Ou manuellement : node scripts/restaurer-backup.js');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { creerBackupComplet, listerBackups, restaurerBackup }; 