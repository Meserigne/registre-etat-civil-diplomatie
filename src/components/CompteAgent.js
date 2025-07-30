import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Eye, EyeOff, Plus, Edit, Trash2, 
  FileText, CheckCircle, AlertCircle, LogOut, Settings 
} from 'lucide-react';

const CompteAgent = ({ agent, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: agent?.nom || '',
    matricule: agent?.matricule || '',
    email: agent?.email || '',
    telephone: agent?.telephone || '',
    motDePasse: '',
    confirmerMotDePasse: '',
    permissions: {
      creerDossier: true,
      modifierDossier: true,
      creerActe: true,
      modifierActe: true,
      voirStatistiques: true,
      dispatching: false
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (agent) {
      setFormData({
        ...formData,
        nom: agent.nom,
        matricule: agent.matricule,
        email: agent.email || '',
        telephone: agent.telephone || '',
        permissions: agent.permissions || {
          creerDossier: true,
          modifierDossier: true,
          creerActe: true,
          modifierActe: true,
          voirStatistiques: true,
          dispatching: false
        }
      });
    }
  }, [agent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.nom || !formData.matricule) {
      setError('Le nom et le matricule sont obligatoires');
      return;
    }

    if (formData.motDePasse && formData.motDePasse !== formData.confirmerMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.motDePasse && formData.motDePasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const updatedAgent = {
        ...agent,
        ...formData,
        motDePasse: formData.motDePasse || agent?.motDePasse,
        dateModification: new Date().toISOString()
      };

      // Sauvegarder dans localStorage
      const agents = JSON.parse(localStorage.getItem('registreAgents') || '[]');
      const updatedAgents = agents.map(a => 
        a.id === agent.id ? updatedAgent : a
      );
      localStorage.setItem('registreAgents', JSON.stringify(updatedAgents));

      setSuccess('Compte agent mis à jour avec succès !');
      setIsEditing(false);
      onUpdate && onUpdate(updatedAgent);
    } catch (error) {
      setError('Erreur lors de la mise à jour du compte');
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Modifier le Compte Agent' : 'Compte Agent'}
          </h3>
          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800"
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Fermer"
            >
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Informations de Base</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matricule *
                  </label>
                  <input
                    type="text"
                    value={formData.matricule}
                    onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Sécurité */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Sécurité</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.motDePasse}
                      onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Laisser vide pour ne pas changer"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      disabled={!isEditing}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={formData.confirmerMotDePasse}
                    onChange={(e) => setFormData({...formData, confirmerMotDePasse: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.permissions).map(([permission, value]) => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={value}
                      onChange={() => handlePermissionChange(permission)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label htmlFor={permission} className="ml-2 text-sm text-gray-700">
                      {permission === 'creerDossier' && 'Créer des dossiers'}
                      {permission === 'modifierDossier' && 'Modifier des dossiers'}
                      {permission === 'creerActe' && 'Créer des actes'}
                      {permission === 'modifierActe' && 'Modifier des actes'}
                      {permission === 'voirStatistiques' && 'Voir les statistiques'}
                      {permission === 'dispatching' && 'Gestion du dispatching'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {isEditing && (
              <div className="mt-8 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompteAgent; 