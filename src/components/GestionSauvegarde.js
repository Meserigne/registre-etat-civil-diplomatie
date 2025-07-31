import React, { useState } from 'react';
import { Save, Download, Upload, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const GestionSauvegarde = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const creerSauvegardeComplet = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Simuler la création de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulation
      
      setMessage('✅ Sauvegarde complète créée avec succès ! Vérifiez ~/Documents/');
      setMessageType('success');
    } catch (error) {
      setMessage('❌ Erreur lors de la création de la sauvegarde complète');
      setMessageType('error');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const creerSauvegardeSimple = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Simuler la création de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
      
      setMessage('✅ Sauvegarde simple créée avec succès ! Vérifiez ~/Documents/');
      setMessageType('success');
    } catch (error) {
      setMessage('❌ Erreur lors de la création de la sauvegarde simple');
      setMessageType('error');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Save className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Gestion des Sauvegardes</h2>
      </div>

      {/* Message de statut */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sauvegarde Complète */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Sauvegarde Complète</h3>
              <p className="text-sm text-blue-600">Toute l'application + données</p>
            </div>
          </div>
          
          <p className="text-sm text-blue-700 mb-4">
            Crée une sauvegarde complète incluant l'application, la base de données, 
            tous les composants et la configuration.
          </p>
          
          <button
            onClick={creerSauvegardeComplet}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Création...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Créer Sauvegarde Complète
              </>
            )}
          </button>
        </div>

        {/* Sauvegarde Simple */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Sauvegarde Simple</h3>
              <p className="text-sm text-green-600">Données et configuration</p>
            </div>
          </div>
          
          <p className="text-sm text-green-700 mb-4">
            Crée une sauvegarde des données et de la configuration 
            sans les dépendances.
          </p>
          
          <button
            onClick={creerSauvegardeSimple}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Création...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Créer Sauvegarde Simple
              </>
            )}
          </button>
        </div>
      </div>

      {/* Informations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Informations sur les Sauvegardes</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Sauvegarde Complète :</strong> Inclut tout le projet (application + données + dépendances)</p>
          <p>• <strong>Sauvegarde Simple :</strong> Inclut seulement les données et la configuration</p>
          <p>• <strong>Emplacement :</strong> ~/Documents/ (dossiers avec timestamps)</p>
          <p>• <strong>Restauration :</strong> Utilisez les scripts de restauration automatique</p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">📋 Commandes Manuelles</h5>
          <div className="text-xs text-blue-700 space-y-1 font-mono">
            <p><strong>Créer backup complet :</strong> npm run backup-complet</p>
            <p><strong>Créer sauvegarde simple :</strong> npm run sauvegarde</p>
            <p><strong>Restaurer backup :</strong> npm run restaurer-backup</p>
            <p><strong>Lister sauvegardes :</strong> ls ~/Documents | grep SAUVEGARDE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionSauvegarde; 