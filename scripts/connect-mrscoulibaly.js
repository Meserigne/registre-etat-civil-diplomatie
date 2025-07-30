#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Connexion avec le compte MrsCoulibaly\n');

console.log('📋 Instructions pour se connecter :\n');

console.log('1️⃣  Vous devez vous connecter avec le compte MrsCoulibaly');
console.log('2️⃣  Si vous n\'avez pas accès à ce compte, vous devez :');
console.log('   - Soit obtenir les identifiants du compte MrsCoulibaly');
console.log('   - Soit créer un token personnel pour ce compte');
console.log('   - Soit demander à MrsCoulibaly de vous ajouter comme collaborateur\n');

console.log('3️⃣  Options disponibles :\n');

console.log('Option A : Token Personnel (Recommandé)');
console.log('1. Allez sur https://github.com/settings/tokens');
console.log('2. Cliquez sur "Generate new token (classic)"');
console.log('3. Donnez un nom : "Registre Etat Civil"');
console.log('4. Sélectionnez les scopes : repo, workflow');
console.log('5. Copiez le token\n');

console.log('Option B : Ajout comme Collaborateur');
console.log('1. MrsCoulibaly doit vous ajouter comme collaborateur');
console.log('2. Allez sur https://github.com/MrsCoulibaly/registre-etat-civil-diplomatie/settings/access');
console.log('3. Cliquez sur "Add people"');
console.log('4. Ajoutez votre compte GitHub\n');

console.log('Option C : Créer un nouveau Repository');
console.log('1. Créez le repository sur votre compte GitHub');
console.log('2. Déployez l\'application sur votre compte');
console.log('3. Partagez l\'URL avec MrsCoulibaly\n');

rl.question('Quelle option préférez-vous ? (A/B/C) : ', (answer) => {
  const option = answer.toUpperCase();
  
  if (option === 'A') {
    console.log('\n🔧 Configuration avec Token Personnel :\n');
    console.log('1. Créez un token personnel sur GitHub');
    console.log('2. Configurez Git avec le token :');
    console.log('   git config user.name "MrsCoulibaly"');
    console.log('   git config user.email "Aw.coulibaly@diplomatie.gouv.ci"');
    console.log('3. Utilisez le token comme mot de passe lors du push');
    
  } else if (option === 'B') {
    console.log('\n👥 Configuration avec Collaborateur :\n');
    console.log('1. Demandez à MrsCoulibaly de vous ajouter comme collaborateur');
    console.log('2. Acceptez l\'invitation par email');
    console.log('3. Puis lancez : npm run connect-github');
    
  } else if (option === 'C') {
    console.log('\n🆕 Configuration avec votre compte :\n');
    console.log('1. Créez le repository sur votre compte GitHub');
    console.log('2. Modifiez le script pour utiliser votre username');
    console.log('3. Déployez sur votre compte');
    console.log('4. URL : https://votre-username.github.io/registre-etat-civil-diplomatie');
    
  } else {
    console.log('\n❌ Option non reconnue. Utilisez A, B ou C.');
  }
  
  console.log('\n📞 Pour toute question, consultez le guide : GUIDE_DEPLOIEMENT_GITHUB.md');
  rl.close();
}); 