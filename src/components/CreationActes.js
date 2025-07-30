import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, CheckCircle, AlertTriangle, User, Calendar, MapPin, X } from 'lucide-react';

const CreationActes = ({ dossier, onClose }) => {
  const [acteData, setActeData] = useState({
    numeroActe: '',
    dateCreation: new Date().toISOString().split('T')[0],
    lieuCreation: 'ABIDJAN',
    officier: '',
    observations: '',
    typeActe: dossier?.demandes?.[0]?.typeDossier || 'Extrait acte Naissance',
    // Informations des parents
    nomPere: '',
    dateNaissancePere: '',
    lieuNaissancePere: '',
    professionPere: '',
    adressePere: '',
    nomMere: '',
    dateNaissanceMere: '',
    lieuNaissanceMere: '',
    professionMere: ''
  });

  const typesActes = [
    'Extrait acte Naissance',
    'Extrait acte Décès', 
    'Extrait acte Mariage',
    'Copie intégrale Mariage',
    'Copie intégrale Naissance',
    'Copie intégrale Décès',
    'Livret de famille',
    'Rectification',
    'Transcription'
  ];

  useEffect(() => {
    if (dossier) {
      setActeData(prev => ({
        ...prev,
        typeActe: dossier.demandes?.[0]?.typeDossier || 'Extrait acte Naissance',
        numeroActe: generateNumeroActe(dossier.demandes?.[0]?.typeDossier || 'Extrait acte Naissance')
      }));
    }
  }, [dossier]);

  const generateNumeroActe = (type) => {
    const currentYear = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    switch (type) {
      case 'Extrait acte Naissance':
        return `NAIS-${currentYear}-${random}`;
      case 'Extrait acte Décès':
        return `DEC-${currentYear}-${random}`;
      case 'Extrait acte Mariage':
        return `MAR-${currentYear}-${random}`;
      case 'Copie intégrale Mariage':
        return `CIM-${currentYear}-${random}`;
      case 'Copie intégrale Naissance':
        return `CIN-${currentYear}-${random}`;
      case 'Copie intégrale Décès':
        return `CID-${currentYear}-${random}`;
      case 'Livret de famille':
        return `LF-${currentYear}-${random}`;
      case 'Rectification':
        return `RECT-${currentYear}-${random}`;
      case 'Transcription':
        return `TRANS-${currentYear}-${random}`;
      default:
        return `ACTE-${currentYear}-${random}`;
    }
  };

  const handleTypeChange = (type) => {
    setActeData({
      ...acteData,
      typeActe: type,
      numeroActe: generateNumeroActe(type)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!acteData.numeroActe || !acteData.lieuCreation || !acteData.officier) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const acteCree = {
      id: Date.now(),
      dossierId: dossier.id,
      ...acteData,
      dateCreationActe: new Date().toISOString(),
      statut: 'Créé'
    };

    // Sauvegarder l'acte
    const actesExistant = JSON.parse(localStorage.getItem('registreActes') || '[]');
    actesExistant.push(acteCree);
    localStorage.setItem('registreActes', JSON.stringify(actesExistant));

    // Mettre à jour le statut du dossier
    const dossiersExistant = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
    const dossiersMisAJour = dossiersExistant.map(d => 
      d.id === dossier.id ? { ...d, statut: 'Acte créé' } : d
    );
    localStorage.setItem('registreDossiers', JSON.stringify(dossiersMisAJour));

    alert('Acte créé avec succès !');
    onClose();
  };

  if (!dossier) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Erreur</h3>
            <p className="text-gray-600">Aucun dossier sélectionné</p>
          </div>
          <div className="p-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Création d'Acte - {dossier.nomUsager} {dossier.prenomUsager}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de l'acte */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Informations de l'Acte</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type d'acte</label>
                  <select
                    value={acteData.typeActe}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {typesActes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro d'acte</label>
                  <input
                    type="text"
                    value={acteData.numeroActe}
                    onChange={(e) => setActeData({...acteData, numeroActe: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de création</label>
                  <input
                    type="date"
                    value={acteData.dateCreation}
                    onChange={(e) => setActeData({...acteData, dateCreation: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lieu de création</label>
                  <input
                    type="text"
                    value={acteData.lieuCreation}
                    onChange={(e) => setActeData({...acteData, lieuCreation: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Officier d'état civil</label>
                  <input
                    type="text"
                    value={acteData.officier}
                    onChange={(e) => setActeData({...acteData, officier: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Informations des parents */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Informations des Parents</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom du père</label>
                  <input
                    type="text"
                    value={acteData.nomPere}
                    onChange={(e) => setActeData({...acteData, nomPere: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de naissance du père</label>
                  <input
                    type="date"
                    value={acteData.dateNaissancePere}
                    onChange={(e) => setActeData({...acteData, dateNaissancePere: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lieu de naissance du père</label>
                  <input
                    type="text"
                    value={acteData.lieuNaissancePere}
                    onChange={(e) => setActeData({...acteData, lieuNaissancePere: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profession du père</label>
                  <input
                    type="text"
                    value={acteData.professionPere}
                    onChange={(e) => setActeData({...acteData, professionPere: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse du père</label>
                  <input
                    type="text"
                    value={acteData.adressePere}
                    onChange={(e) => setActeData({...acteData, adressePere: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Observations</label>
            <textarea
              value={acteData.observations}
              onChange={(e) => setActeData({...acteData, observations: e.target.value})}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Créer l'acte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreationActes; 