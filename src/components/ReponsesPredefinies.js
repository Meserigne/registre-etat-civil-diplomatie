import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, Plus, Trash2, Edit } from 'lucide-react';

const ReponsesPredefinies = ({ onSelectReponse, selectedReponse, onClose }) => {
  const [reponses, setReponses] = useState([
    {
      id: 1,
      categorie: 'Traitement Réussi',
      reponses: [
        'Dossier traité avec succès. Tous les documents ont été vérifiés et validés.',
        'Acte délivré à l\'usager. Signature et cachet apposés.',
        'Copie intégrale établie et remise au demandeur.',
        'Rectification effectuée selon les documents fournis.',
        'Transcription réalisée et enregistrée dans le registre.'
      ]
    },
    {
      id: 2,
      categorie: 'En Attente',
      reponses: [
        'Dossier en cours de traitement. Vérification des documents en cours.',
        'En attente de documents complémentaires de l\'usager.',
        'Vérification administrative en cours.',
        'Consultation des archives en cours.',
        'Validation par la hiérarchie en attente.'
      ]
    },
    {
      id: 3,
      categorie: 'Problèmes Rencontrés',
      reponses: [
        'Documents incomplets. Demande de pièces supplémentaires.',
        'Incohérence dans les informations fournies.',
        'Acte introuvable dans les archives.',
        'Problème technique lors de l\'établissement.',
        'Délai de traitement dépassé. Excuses présentées.'
      ]
    },
    {
      id: 4,
      categorie: 'Refus',
      reponses: [
        'Demande refusée - Documents insuffisants.',
        'Refus - Acte ne correspond pas aux critères.',
        'Demande rejetée - Informations erronées.',
        'Refus - Procédure non respectée.',
        'Demande non recevable - Motif légal.'
      ]
    },
    {
      id: 5,
      categorie: 'Observations Spéciales',
      reponses: [
        'Cas particulier nécessitant une attention spéciale.',
        'Usager en situation de handicap - Assistance fournie.',
        'Demande urgente traitée en priorité.',
        'Dossier complexe nécessitant une expertise.',
        'Situation exceptionnelle - Décision spéciale prise.'
      ]
    }
  ]);

  const [activeCategorie, setActiveCategorie] = useState(1);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customReponse, setCustomReponse] = useState('');

  const handleSelectReponse = (reponse) => {
    onSelectReponse(reponse);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customReponse.trim()) {
      handleSelectReponse(customReponse);
    }
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie) {
      case 'Traitement Réussi':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'En Attente':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'Problèmes Rencontrés':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Refus':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Observations Spéciales':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Réponses Prédéfinies</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Sélectionnez une réponse prédéfinie ou créez une réponse personnalisée
          </p>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Catégories */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Catégories</h3>
              <div className="space-y-2">
                {reponses.map((categorie) => (
                  <button
                    key={categorie.id}
                    onClick={() => setActiveCategorie(categorie.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      activeCategorie === categorie.id
                        ? 'bg-blue-100 border-blue-300 border'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getCategorieIcon(categorie.categorie)}
                      <span className="text-sm font-medium text-gray-900">
                        {categorie.categorie}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Réponses */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">
                {reponses.find(c => c.id === activeCategorie)?.categorie}
              </h3>
              <button
                onClick={() => setShowCustomForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Réponse personnalisée
              </button>
            </div>

            {showCustomForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre réponse personnalisée
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    value={customReponse}
                    onChange={(e) => setCustomReponse(e.target.value)}
                    placeholder="Tapez votre réponse personnalisée..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCustomSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Utiliser cette réponse
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomForm(false);
                      setCustomReponse('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {reponses
                  .find(c => c.id === activeCategorie)
                  ?.reponses.map((reponse, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                      onClick={() => handleSelectReponse(reponse)}
                    >
                      <p className="text-gray-900">{reponse}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReponsesPredefinies; 