import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Plus, Edit, Trash2, Search, Download, 
  CheckCircle, Clock, AlertCircle, LogOut, Settings, Eye 
} from 'lucide-react';
import CreationActes from './CreationActes';

const InterfaceAgent = ({ agent, onLogout }) => {
  const [dossiers, setDossiers] = useState([]);
  const [actes, setActes] = useState([]);
  const [activeTab, setActiveTab] = useState('dossiers');
  const [showForm, setShowForm] = useState(false);
  const [showCreationActe, setShowCreationActe] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingDossier, setEditingDossier] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Charger les dossiers assignés à cet agent
      const allDossiers = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
      const agentDossiers = allDossiers.filter(d => d.agentId === agent.id);
      setDossiers(agentDossiers);

      // Charger les actes créés par cet agent
      const allActes = JSON.parse(localStorage.getItem('registreActes') || '[]');
      const agentActes = allActes.filter(a => a.agentId === agent.id);
      setActes(agentActes);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleNewDossier = () => {
    setEditingDossier({
      id: Date.now(),
      numeroSuivi: `REG-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(dossiers.length + 1).padStart(3, '0')}`,
      numeroDossier: `DOS-${Date.now()}`,
      nomUsager: '',
      prenomUsager: '',
      dateNaissance: '',
      lieuNaissance: '',
      nationalite: '',
      adresse: '',
      telephone: '',
      email: '',
      typeDossier: 'Naissance',
      demandes: [{ typeDossier: 'Naissance', cout: 5000 }],
      dateDepot: new Date().toISOString().split('T')[0],
      dateRetrait: '',
      statut: 'En cours',
      agentId: agent.id,
      observations: '',
      coutTotal: 5000,
      dateCreation: new Date().toISOString()
    });
    setShowForm(true);
  };

  const handleSubmitDossier = (dossierData) => {
    try {
      const updatedDossiers = editingDossier 
        ? dossiers.map(d => d.id === editingDossier.id ? dossierData : d)
        : [...dossiers, dossierData];
      
      setDossiers(updatedDossiers);
      
      // Sauvegarder dans localStorage
      const allDossiers = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
      const updatedAllDossiers = editingDossier
        ? allDossiers.map(d => d.id === editingDossier.id ? dossierData : d)
        : [...allDossiers, dossierData];
      
      localStorage.setItem('registreDossiers', JSON.stringify(updatedAllDossiers));
      
      setShowForm(false);
      setEditingDossier(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (dossier) => {
    setEditingDossier(dossier);
    setShowForm(true);
  };

  const handleDelete = (dossierId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      const updatedDossiers = dossiers.filter(d => d.id !== dossierId);
      setDossiers(updatedDossiers);
      
      // Mettre à jour localStorage
      const allDossiers = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
      const updatedAllDossiers = allDossiers.filter(d => d.id !== dossierId);
      localStorage.setItem('registreDossiers', JSON.stringify(updatedAllDossiers));
    }
  };

  const handleCreateActe = (dossier) => {
    setSelectedDossier(dossier);
    setShowCreationActe(true);
  };

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = dossier.nomUsager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.prenomUsager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dossier.numeroSuivi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || dossier.demandes?.some(d => d.typeDossier === filterType);
    return matchesSearch && matchesType;
  });

  const getStatistiques = () => {
    return {
      total: dossiers.length,
      enCours: dossiers.filter(d => d.statut === 'En cours').length,
      termines: dossiers.filter(d => d.statut === 'Terminé').length,
      actes: actes.length
    };
  };

  const statistiques = getStatistiques();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Interface Agent</h1>
                  <p className="text-sm text-gray-600">{agent.nom} - {agent.matricule}</p>
              </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Dossiers</p>
                <p className="text-2xl font-bold text-blue-600">{statistiques.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-yellow-600">{statistiques.enCours}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">{statistiques.termines}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actes Créés</p>
                <p className="text-2xl font-bold text-purple-600">{statistiques.actes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dossiers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dossiers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes Dossiers
              </button>
              <button
                onClick={() => setActiveTab('actes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'actes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes Actes
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
            <div className="p-6">
            {activeTab === 'dossiers' && (
              <div className="space-y-6">
                {/* Barre d'outils */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher un dossier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les types</option>
                      <option value="Naissance">Naissance</option>
                      <option value="Décès">Décès</option>
                      <option value="Mariage">Mariage</option>
                      <option value="Divorce">Divorce</option>
                    </select>
                  </div>
                  <button
                    onClick={handleNewDossier}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau Dossier
                  </button>
              </div>

              {/* Liste des dossiers */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Suivi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usager</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Dépôt</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDossiers.map(dossier => (
                          <tr key={dossier.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dossier.numeroSuivi}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {dossier.nomUsager} {dossier.prenomUsager}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dossier.demandes?.map(d => d.typeDossier).join(', ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              dossier.statut === 'Terminé' ? 'bg-green-100 text-green-800' :
                              dossier.statut === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                              {dossier.statut}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(dossier.dateDepot).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                              <button
                                  onClick={() => handleCreateActe(dossier)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Créer un acte"
                              >
                                  <Plus className="w-4 h-4" />
                              </button>
                              <button
                                  onClick={() => handleEdit(dossier)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Modifier"
                              >
                                  <Edit className="w-4 h-4" />
                              </button>
                            <button
                                  onClick={() => handleDelete(dossier.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Supprimer"
                            >
                                  <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                    </div>
            )}

            {activeTab === 'actes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Acte</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usager</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Création</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {actes.map(acte => (
                          <tr key={acte.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {acte.numeroActe}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {acte.dossierInfo?.nomUsager} {acte.dossierInfo?.prenomUsager}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {acte.typeActe}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(acte.dateCreation).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Voir l'acte"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  title="Télécharger"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                    </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            </div>
        </div>
      </div>

      {/* Modal de création/modification de dossier */}
      {showForm && editingDossier && (
        <DossierForm
          dossier={editingDossier}
          onSubmit={handleSubmitDossier}
          onClose={() => {
            setShowForm(false);
            setEditingDossier(null);
          }}
        />
      )}

      {/* Modal de création d'acte */}
      {showCreationActe && selectedDossier && (
        <CreationActes
          dossier={selectedDossier}
          onClose={() => {
            setShowCreationActe(false);
            setSelectedDossier(null);
          }}
        />
      )}
    </div>
  );
};

// Composant formulaire de dossier simplifié
const DossierForm = ({ dossier, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(dossier);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {dossier.id ? 'Modifier le Dossier' : 'Nouveau Dossier'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formData.nomUsager}
                onChange={(e) => setFormData({...formData, nomUsager: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.prenomUsager}
                onChange={(e) => setFormData({...formData, prenomUsager: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
              <input
                type="text"
                value={formData.lieuNaissance}
                onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <textarea
                value={formData.adresse}
                onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-3 justify-end">
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
              {dossier.id ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterfaceAgent; 