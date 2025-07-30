#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Configuration de l\'authentification GitHub\n');

console.log('📋 Étapes pour se connecter à GitHub :\n');

console.log('1️⃣  Vérifiez que vous avez GitHub CLI installé :');
console.log('   brew install gh (sur macOS)');
console.log('   ou téléchargez depuis : https://cli.github.com/\n');

console.log('2️⃣  Connectez-vous avec le compte MrsCoulibaly :');
console.log('   gh auth login\n');

console.log('3️⃣  Suivez les instructions :');
console.log('   - Choisissez "GitHub.com"');
console.log('   - Choisissez "HTTPS"');
console.log('   - Choisissez "Yes" pour l\'authentification');
console.log('   - Choisissez "Login with a web browser"');
console.log('   - Copiez le code affiché');
console.log('   - Ouvrez le lien dans votre navigateur');
console.log('   - Collez le code et autorisez l\'accès\n');

console.log('4️⃣  Vérifiez la connexion :');
console.log('   gh auth status\n');

console.log('5️⃣  Une fois connecté, relancez :');
console.log('   npm run connect-github\n');

rl.question('Voulez-vous que je lance gh auth login maintenant ? (o/n) : ', (answer) => {
  if (answer.toLowerCase() === 'o' || answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Lancement de gh auth login...\n');
    try {
      execSync('gh auth login', { stdio: 'inherit' });
      console.log('\n✅ Authentification terminée !');
      console.log('Vous pouvez maintenant relancer : npm run connect-github');
    } catch (error) {
      console.log('\n❌ Erreur lors de l\'authentification :', error.message);
      console.log('Vérifiez que GitHub CLI est installé : brew install gh');
    }
  } else {
    console.log('\n📝 Instructions sauvegardées.');
    console.log('Connectez-vous manuellement avec : gh auth login');
    console.log('Puis relancez : npm run connect-github');
  }
  rl.close();
}); 