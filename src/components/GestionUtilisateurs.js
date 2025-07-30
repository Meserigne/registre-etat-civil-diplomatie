import React, { useState } from 'react';
import { User, Shield, UserCheck, Trash2, Edit, Plus, Eye, EyeOff, Lock, Unlock, Key, RefreshCw } from 'lucide-react';

const GestionUtilisateurs = ({ utilisateurs, setUtilisateurs, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  });
  const [formData, setFormData] = useState({
    nom: '',
    matricule: '',
    email: '',
    motDePasse: '',
    role: 'agent',
    actif: true
  });

  const roles = [
    { value: 'super_admin', label: 'Super Administrateur', color: 'bg-red-100 text-red-800' },
    { value: 'admin', label: 'Administrateur', color: 'bg-blue-100 text-blue-800' },
    { value: 'agent', label: 'Agent', color: 'bg-green-100 text-green-800' }
  ];

  const resetForm = () => {
    setFormData({
      nom: '',
      matricule: '',
      email: '',
      motDePasse: '',
      role: 'agent',
      actif: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.matricule || !formData.motDePasse) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingUser) {
      // Modification d'un utilisateur existant
      const updatedUsers = utilisateurs.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, motDePasse: formData.motDePasse || user.motDePasse }
          : user
      );
      setUtilisateurs(updatedUsers);
      localStorage.setItem('registreUtilisateurs', JSON.stringify(updatedUsers));
    } else {
      // Création d'un nouvel utilisateur
      const newUser = {
        id: Date.now(),
        ...formData,
        dateCreation: new Date().toISOString()
      };
      const updatedUsers = [...utilisateurs, newUser];
      setUtilisateurs(updatedUsers);
      localStorage.setItem('registreUtilisateurs', JSON.stringify(updatedUsers));
    }

    setShowForm(false);
    setEditingUser(null);
    resetForm();
  };

  const handleEdit = (user) => {
    setFormData({
      nom: user.nom,
      matricule: user.matricule,
      email: user.email || '',
      motDePasse: '',
      role: user.role,
      actif: user.actif
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      const updatedUsers = utilisateurs.filter(user => user.id !== userId);
      setUtilisateurs(updatedUsers);
      localStorage.setItem('registreUtilisateurs', JSON.stringify(updatedUsers));
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const togglePasswordForm = (userId) => {
    setShowPasswordForm(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    if (!showPasswordForm[userId]) {
      setPasswordFormData({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmerMotDePasse: ''
      });
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength += 1;
    else feedback.push('Au moins 8 caractères');
    
    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push('Au moins une minuscule');
    
    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push('Au moins une majuscule');
    
    if (/[0-9]/.test(password)) strength += 1;
    else feedback.push('Au moins un chiffre');
    
    if (/[!@#$%^&*]/.test(password)) strength += 1;
    else feedback.push('Au moins un caractère spécial (!@#$%^&*)');
    
    return { strength, feedback };
  };

  const handleChangePassword = (userId) => {
    if (!passwordFormData.ancienMotDePasse || !passwordFormData.nouveauMotDePasse || !passwordFormData.confirmerMotDePasse) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (passwordFormData.nouveauMotDePasse !== passwordFormData.confirmerMotDePasse) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    const passwordStrength = checkPasswordStrength(passwordFormData.nouveauMotDePasse);
    if (passwordStrength.strength < 3) {
      alert(`Mot de passe trop faible. ${passwordStrength.feedback.join(', ')}`);
      return;
    }

    const user = utilisateurs.find(u => u.id === userId);
    if (!user) {
      alert('Utilisateur non trouvé');
      return;
    }

    if (passwordFormData.ancienMotDePasse !== user.motDePasse) {
      alert('L\'ancien mot de passe est incorrect');
      return;
    }

    const updatedUsers = utilisateurs.map(u => 
      u.id === userId ? { 
        ...u, 
        motDePasse: passwordFormData.nouveauMotDePasse,
        forcePasswordChange: false // Réinitialiser le flag de changement forcé
      } : u
    );
    setUtilisateurs(updatedUsers);
    localStorage.setItem('registreUtilisateurs', JSON.stringify(updatedUsers));
    
    setShowPasswordForm(prev => ({ ...prev, [userId]: false }));
    setPasswordFormData({
      ancienMotDePasse: '',
      nouveauMotDePasse: '',
      confirmerMotDePasse: ''
    });
    alert('Mot de passe modifié avec succès !');
  };

  const handleResetPassword = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) {
      const newPassword = generateRandomPassword();
      const updatedUsers = utilisateurs.map(u => 
        u.id === userId ? { ...u, motDePasse: newPassword } : u
      );
      setUtilisateurs(updatedUsers);
      localStorage.setItem('registreUtilisateurs', JSON.stringify(updatedUsers));
      alert(`Mot de passe réinitialisé ! Nouveau mot de passe: ${newPassword}`);
    }
  };

  const handleForcePasswordChange = (userId) => {
    if (window.confirm('Forcer le changement de mot de passe au prochain login ?')) {
      const updatedUsers = utilisateurs.map(u => 
        u.id === userId ? { ...u, forcePasswordChange: true } : u
      );
      setUtilisateurs(updatedUsers);
      localStorage.setItem('registreUtilisateurs', JSON.stringify(updatedUsers));
      alert('L\'utilisateur devra changer son mot de passe au prochain login');
    }
  };

  const getRoleInfo = (role) => {
    return roles.find(r => r.value === role) || roles[2];
  };

  return (
    <div className="p-6">
                   <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
               <button
                 onClick={() => {
                   resetForm();
                   setEditingUser(null);
                   setShowForm(true);
                 }}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" />
                 Nouvel Utilisateur
               </button>
             </div>

             {/* Statistiques des mots de passe */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
               <div className="bg-blue-50 p-4 rounded-lg border">
                 <div className="flex items-center">
                   <div className="p-2 bg-blue-100 rounded-full">
                     <User className="w-5 h-5 text-blue-600" />
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                     <p className="text-2xl font-bold text-blue-600">{utilisateurs.length}</p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-green-50 p-4 rounded-lg border">
                 <div className="flex items-center">
                   <div className="p-2 bg-green-100 rounded-full">
                     <Unlock className="w-5 h-5 text-green-600" />
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                     <p className="text-2xl font-bold text-green-600">
                       {utilisateurs.filter(u => u.actif).length}
                     </p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-orange-50 p-4 rounded-lg border">
                 <div className="flex items-center">
                   <div className="p-2 bg-orange-100 rounded-full">
                     <Lock className="w-5 h-5 text-orange-600" />
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-medium text-gray-600">Changement Forcé</p>
                     <p className="text-2xl font-bold text-orange-600">
                       {utilisateurs.filter(u => u.forcePasswordChange).length}
                     </p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-purple-50 p-4 rounded-lg border">
                 <div className="flex items-center">
                   <div className="p-2 bg-purple-100 rounded-full">
                     <Shield className="w-5 h-5 text-purple-600" />
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-medium text-gray-600">Super Admins</p>
                     <p className="text-2xl font-bold text-purple-600">
                       {utilisateurs.filter(u => u.role === 'super_admin').length}
                     </p>
                   </div>
                 </div>
               </div>
             </div>

      {/* Liste des utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilisateurs.map(user => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{user.nom}</h3>
                <p className="text-sm text-gray-500">Matricule: {user.matricule}</p>
                {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
              </div>
                                   <div className="flex gap-2">
                       <button
                         onClick={() => handleEdit(user)}
                         className="text-blue-600 hover:text-blue-800"
                         title="Modifier l'utilisateur"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => togglePasswordForm(user.id)}
                         className="text-green-600 hover:text-green-800"
                         title="Changer le mot de passe"
                       >
                         <Key className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleResetPassword(user.id)}
                         className="text-orange-600 hover:text-orange-800"
                         title="Réinitialiser le mot de passe"
                       >
                         <RefreshCw className="w-4 h-4" />
                       </button>
                       <button
                         onClick={() => handleForcePasswordChange(user.id)}
                         className="text-purple-600 hover:text-purple-800"
                         title="Forcer le changement de mot de passe"
                       >
                         <Lock className="w-4 h-4" />
                       </button>
                       {currentUser.id !== user.id && (
                         <button
                           onClick={() => handleDelete(user.id)}
                           className="text-red-600 hover:text-red-800"
                           title="Supprimer l'utilisateur"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                     </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rôle:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleInfo(user.role).color}`}>
                  {getRoleInfo(user.role).label}
                </span>
              </div>

                                   <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Statut:</span>
                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                         user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {user.actif ? 'Actif' : 'Inactif'}
                       </span>
                     </div>
                     
                     {user.forcePasswordChange && (
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600">Changement mot de passe:</span>
                         <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                           <Lock className="w-3 h-3 mr-1" />
                           Forcé
                         </span>
                       </div>
                     )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mot de passe:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {showPassword[user.id] ? user.motDePasse : '••••••••'}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(user.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showPassword[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

                                   {user.dateCreation && (
                       <div className="text-xs text-gray-500">
                         Créé le: {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                       </div>
                     )}
                     
                     {/* Formulaire de changement de mot de passe */}
                     {showPasswordForm[user.id] && (
                       <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                         <h4 className="font-medium text-gray-900 mb-3">Changer le mot de passe</h4>
                         <div className="space-y-3">
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                               Ancien mot de passe
                             </label>
                             <input
                               type="password"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                               value={passwordFormData.ancienMotDePasse}
                               onChange={(e) => setPasswordFormData({
                                 ...passwordFormData,
                                 ancienMotDePasse: e.target.value
                               })}
                               placeholder="Ancien mot de passe"
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                               Nouveau mot de passe
                             </label>
                             <input
                               type="password"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                               value={passwordFormData.nouveauMotDePasse}
                               onChange={(e) => setPasswordFormData({
                                 ...passwordFormData,
                                 nouveauMotDePasse: e.target.value
                               })}
                               placeholder="Nouveau mot de passe (min 8 caractères)"
                             />
                             {passwordFormData.nouveauMotDePasse && (
                               <div className="mt-2">
                                 <div className="flex gap-1 mb-1">
                                   {[1, 2, 3, 4, 5].map((level) => {
                                     const strength = checkPasswordStrength(passwordFormData.nouveauMotDePasse).strength;
                                     return (
                                       <div
                                         key={level}
                                         className={`h-2 flex-1 rounded ${
                                           level <= strength
                                             ? strength >= 4 ? 'bg-green-500' : strength >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                             : 'bg-gray-200'
                                         }`}
                                       />
                                     );
                                   })}
                                 </div>
                                 <p className={`text-xs ${
                                   checkPasswordStrength(passwordFormData.nouveauMotDePasse).strength >= 4 ? 'text-green-600' :
                                   checkPasswordStrength(passwordFormData.nouveauMotDePasse).strength >= 3 ? 'text-yellow-600' :
                                   'text-red-600'
                                 }`}>
                                   Force: {
                                     checkPasswordStrength(passwordFormData.nouveauMotDePasse).strength >= 4 ? 'Très forte' :
                                     checkPasswordStrength(passwordFormData.nouveauMotDePasse).strength >= 3 ? 'Forte' :
                                     'Faible'
                                   }
                                 </p>
                               </div>
                             )}
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                               Confirmer le nouveau mot de passe
                             </label>
                             <input
                               type="password"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                               value={passwordFormData.confirmerMotDePasse}
                               onChange={(e) => setPasswordFormData({
                                 ...passwordFormData,
                                 confirmerMotDePasse: e.target.value
                               })}
                               placeholder="Confirmer le nouveau mot de passe"
                             />
                           </div>
                           <div className="flex gap-2">
                             <button
                               onClick={() => handleChangePassword(user.id)}
                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                             >
                               Changer le mot de passe
                             </button>
                             <button
                               onClick={() => togglePasswordForm(user.id)}
                               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                             >
                               Annuler
                             </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               ))}
             </div>

      {/* Modal pour ajouter/modifier un utilisateur */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matricule *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.matricule}
                  onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.motDePasse}
                  onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="actif"
                  className="mr-2"
                  checked={formData.actif}
                  onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                />
                <label htmlFor="actif" className="text-sm text-gray-700">
                  Utilisateur actif
                </label>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {editingUser ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUtilisateurs; 