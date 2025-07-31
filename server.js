const jsonServer = require('json-server');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware pour parser le JSON
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Routes personnalisées pour les sauvegardes
server.post('/backup-complet', (req, res) => {
  try {
    console.log('🔄 Création d\'une sauvegarde complète...');
    
    // Exécuter le script de sauvegarde complète
    const result = execSync('node scripts/backup-complet.js', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Sauvegarde complète créée avec succès');
    res.json({ 
      success: true, 
      message: 'Sauvegarde complète créée avec succès',
      result: result
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de la sauvegarde complète:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la création de la sauvegarde complète',
      details: error.message
    });
  }
});

server.post('/sauvegarde', (req, res) => {
  try {
    console.log('🔄 Création d\'une sauvegarde simple...');
    
    // Exécuter le script de sauvegarde simple
    const result = execSync('node scripts/creer-sauvegarde.js', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Sauvegarde simple créée avec succès');
    res.json({ 
      success: true, 
      message: 'Sauvegarde simple créée avec succès',
      result: result
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de la sauvegarde simple:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la création de la sauvegarde simple',
      details: error.message
    });
  }
});

server.get('/sauvegardes', (req, res) => {
  try {
    const documentsPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Documents');
    const fichiers = fs.readdirSync(documentsPath);
    const sauvegardes = fichiers.filter(f => 
      f.startsWith('Registre_New_SAUVEGARDE_') || 
      f.startsWith('BACKUP_COMPLET_Registre_New_')
    );
    
    const sauvegardesInfo = sauvegardes.map(sauvegarde => {
      const stats = fs.statSync(path.join(documentsPath, sauvegarde));
      return {
        nom: sauvegarde,
        date: stats.mtime,
        taille: stats.size,
        type: sauvegarde.startsWith('BACKUP_COMPLET_') ? 'complet' : 'simple'
      };
    });
    
    res.json(sauvegardesInfo);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des sauvegardes:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des sauvegardes',
      details: error.message
    });
  }
});

server.post('/restaurer', (req, res) => {
  try {
    const { nomSauvegarde } = req.body;
    
    if (!nomSauvegarde) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nom de sauvegarde requis' 
      });
    }
    
    console.log(`🔄 Restauration de la sauvegarde: ${nomSauvegarde}`);
    
    // Exécuter le script de restauration
    const result = execSync('node scripts/restaurer-backup.js', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    console.log('✅ Restauration terminée avec succès');
    res.json({ 
      success: true, 
      message: 'Restauration terminée avec succès',
      result: result
    });
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la restauration',
      details: error.message
    });
  }
});

// Utiliser les routes JSON Server par défaut
server.use(router);

// Démarrer le serveur
const port = 3000;
server.listen(port, () => {
  console.log(`🚀 Serveur JSON étendu démarré sur le port ${port}`);
  console.log(`📁 Endpoints disponibles:`);
  console.log(`   - GET  /dossiers`);
  console.log(`   - GET  /agents`);
  console.log(`   - GET  /utilisateurs`);
  console.log(`   - POST /backup-complet`);
  console.log(`   - POST /sauvegarde`);
  console.log(`   - GET  /sauvegardes`);
  console.log(`   - POST /restaurer`);
}); 