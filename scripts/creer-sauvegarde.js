const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('💾 Script de création de sauvegarde\n');

// Fonction pour créer une sauvegarde
function creerSauvegarde() {
  const documentsPath = path.join(process.env.HOME, 'Documents');
  const cheminActuel = path.join(documentsPath, 'Registre_New');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const nomSauvegarde = `Registre_New_SAUVEGARDE_${timestamp}`;
  const cheminSauvegarde = path.join(documentsPath, nomSauvegarde);
  
  if (!fs.existsSync(cheminActuel)) {
    console.log('❌ Dossier Registre_New introuvable dans ~/Documents/');
    return false;
  }
  
  try {
    console.log(`🔄 Création de la sauvegarde : ${nomSauvegarde}`);
    
    // Arrêter les processus en cours
    try {
      execSync('pkill -f "react-scripts"', { stdio: 'ignore' });
      execSync('pkill -f "json-server"', { stdio: 'ignore' });
    } catch (e) {
      // Ignorer les erreurs si aucun processus n'est en cours
    }
    
    // Créer la sauvegarde
    execSync(`cp -r "${cheminActuel}" "${cheminSauvegarde}"`, { stdio: 'inherit' });
    
    // Vérifier la taille de la sauvegarde
    const stats = fs.statSync(cheminSauvegarde);
    const tailleMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('✅ Sauvegarde créée avec succès !');
    console.log(`📁 Dossier : ${cheminSauvegarde}`);
    console.log(`📊 Taille : ${tailleMB} MB`);
    console.log(`🕒 Date : ${new Date().toLocaleString('fr-FR')}`);
    
    // Lister toutes les sauvegardes
    listerSauvegardes();
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création de la sauvegarde:', error.message);
    return false;
  }
}

// Fonction pour lister les sauvegardes existantes
function listerSauvegardes() {
  const documentsPath = path.join(process.env.HOME, 'Documents');
  const fichiers = fs.readdirSync(documentsPath);
  const sauvegardes = fichiers.filter(f => f.startsWith('Registre_New_SAUVEGARDE_'));
  
  if (sauvegardes.length > 0) {
    console.log('\n📦 Toutes les sauvegardes disponibles :');
    sauvegardes.sort().forEach((sauvegarde, index) => {
      const stats = fs.statSync(path.join(documentsPath, sauvegarde));
      const date = stats.mtime.toLocaleString('fr-FR');
      const tailleMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`${index + 1}. ${sauvegarde} (${date}) - ${tailleMB} MB`);
    });
  }
}

// Fonction principale
function main() {
  if (creerSauvegarde()) {
    console.log('\n🎉 Sauvegarde terminée !');
    console.log('\n📋 Pour restaurer demain :');
    console.log('1. cd ~/Documents/Registre_New');
    console.log('2. node scripts/restaurer-sauvegarde.js');
    console.log('3. npm start');
    console.log('4. npm run server (dans un autre terminal)');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { creerSauvegarde, listerSauvegardes }; 