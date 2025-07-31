# 🚀 **Guide de Démarrage - Demain**

## ✅ **Application Fonctionnelle !**

Votre application est maintenant **OPÉRATIONNELLE** et accessible sur :
- **🌐 Application :** `http://localhost:3000/registre-etat-civil-diplomatie`
- **🗄️ Serveur :** `http://localhost:3001`

---

## 📋 **Commandes pour Demain**

### **Étape 1 : Ouvrir le Terminal**
```bash
cd ~/Documents/Registre_New
```

### **Étape 2 : Démarrer l'Application**
```bash
npm start
```

### **Étape 3 : Démarrer le Serveur (nouveau terminal)**
```bash
# Ouvrir un nouveau terminal, puis :
cd ~/Documents/Registre_New
npm run server
```

---

## 🎯 **Vérifications**

1. ✅ **Application React** : `http://localhost:3000/registre-etat-civil-diplomatie`
2. ✅ **Serveur JSON** : `http://localhost:3001`
3. ✅ **Logo officiel** s'affiche correctement
4. ✅ **Toutes les fonctionnalités** marchent

---

## 🔧 **En Cas de Problème**

### **Si l'application ne démarre pas :**
```bash
# Tuer les processus existants
pkill -f "react-scripts"
pkill -f "json-server"

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Redémarrer
npm start
npm run server
```

### **Si les ports sont occupés :**
```bash
# Tuer tous les processus sur les ports 3000 et 3001
lsof -ti:3000,3001 | xargs kill -9

# Puis redémarrer
npm start
npm run server
```

---

## 📦 **Sauvegarde Disponible**

Si tout ne fonctionne pas, utilisez la sauvegarde :
```bash
cd ~/Documents
cp -r Registre_New_SAUVEGARDE_2025-07-30T10-41-00 Registre_New
cd Registre_New
npm install
npm start
npm run server
```

---

## 🏛️ **Fonctionnalités Disponibles**

- ✅ **Connexion** avec rôles (super admin, admin, agent)
- ✅ **Gestion des dossiers** (création, modification, suppression)
- ✅ **Système de dispatching** automatique et manuel
- ✅ **Création d'actes** (naissance, mariage, décès)
- ✅ **Gestion des actes** (téléchargement, impression)
- ✅ **Base de données persistante**
- ✅ **Logo officiel** du Ministère
- ✅ **Export/Import CSV**

---

## 🌐 **Accès Rapide**

**Ouvrez votre navigateur et allez sur :**
```
http://localhost:3000/registre-etat-civil-diplomatie
```

**Votre application est prête !** 🎉 