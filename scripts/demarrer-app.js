const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de l\'application...\n');

// Fonction pour démarrer React
function demarrerReact() {
  console.log('📱 Démarrage de React...');
  const react = spawn('npx', ['react-scripts', 'start'], {
    stdio: 'inherit',
    cwd: path.join(process.env.HOME, 'Documents', 'Registre_New')
  });

  react.on('error', (error) => {
    console.error('❌ Erreur React:', error.message);
  });

  return react;
}

// Fonction pour démarrer JSON Server
function demarrerJSONServer() {
  console.log('🗄️  Démarrage de JSON Server...');
  const server = spawn('npx', ['json-server', '--watch', 'db.json', '--port', '3001'], {
    stdio: 'inherit',
    cwd: path.join(process.env.HOME, 'Documents', 'Registre_New')
  });

  server.on('error', (error) => {
    console.error('❌ Erreur JSON Server:', error.message);
  });

  return server;
}

// Fonction principale
function main() {
  try {
    // Démarrer les deux processus
    const reactProcess = demarrerReact();
    const serverProcess = demarrerJSONServer();

    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt de l\'application...');
      reactProcess.kill();
      serverProcess.kill();
      process.exit(0);
    });

    console.log('\n✅ Application démarrée !');
    console.log('🌐 React: http://localhost:3000/registre-etat-civil-diplomatie');
    console.log('🗄️  JSON Server: http://localhost:3001');
    console.log('\n📋 Appuyez sur Ctrl+C pour arrêter');

  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error.message);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
} 