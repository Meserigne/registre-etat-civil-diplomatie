import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Download, FileText, Settings, Upload,
  User, BarChart3, Calendar, PieChart, CheckCircle, Clock
} from 'lucide-react';
import GestionAgents from './GestionAgents';
import GestionUtilisateurs from './GestionUtilisateurs';
import GestionActes from './GestionActes';
import CreationActes from './CreationActes';
import { dossiersAPI, modificationsAPI } from '../services/api';

const RegistreEtatCivil = ({ currentUser, onLogout, activeTab, setActiveTab }) => {
  // États principaux
  const [dossiers, setDossiers] = useState([]);
  const [modifications, setModifications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDossier, setEditingDossier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showCreationActe, setShowCreationActe] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showManualAssignModal, setShowManualAssignModal] = useState(false);

  // États du formulaire
  const [formData, setFormData] = useState({
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
    agentId: '',
    observations: ''
  });

  // Types de dossiers disponibles
  const typesDossier = [
    'Naissance', 'Décès', 'Mariage', 'Divorce', 'Adoption', 
    'Reconnaissance', 'Légitimation', 'Rectification', 'Transcription'
  ];

  // Chargement des données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger depuis l'API
      const [dossiersData, modificationsData, agentsData, utilisateursData] = await Promise.all([
        dossiersAPI.getAll(),
        modificationsAPI.getAll(),
        Promise.resolve([]), // agents
        Promise.resolve([])  // utilisateurs
      ]);

      setDossiers(dossiersData);
      setModifications(modificationsData);
      setAgents(agentsData);
      setUtilisateurs(utilisateursData);
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      // Fallback vers localStorage
      const savedDossiers = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
      const savedModifications = JSON.parse(localStorage.getItem('registreModifications') || '[]');
      const savedAgents = JSON.parse(localStorage.getItem('registreAgents') || '[]');
      const savedUtilisateurs = JSON.parse(localStorage.getItem('registreUtilisateurs') || '[]');

      setDossiers(savedDossiers);
      setModifications(savedModifications);
      setAgents(savedAgents);
      setUtilisateurs(savedUtilisateurs);
    }
  };

  // Génération des numéros
  const generateNumeroSuivi = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = dossiers.filter(d => {
      const dDate = new Date(d.dateCreation);
      return dDate.getFullYear() === year && dDate.getMonth() === date.getMonth();
    }).length + 1;
    return `REG-${year}${month}-${String(count).padStart(3, '0')}`;
  };

  const generateNumeroDossier = () => {
    return `DOS-${Date.now()}`;
  };

  // Reset du formulaire
  const resetForm = () => {
    const dateDepot = new Date().toISOString().split('T')[0];
    const dateRetrait = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setFormData({
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
      dateDepot: dateDepot,
      dateRetrait: dateRetrait,
      statut: 'En cours',
      agentId: '',
      observations: ''
    });
  };

  // Calcul du coût total
  const calculateCoutTotal = (demandes) => {
    return demandes.reduce((total, demande) => total + (demande.cout || 0), 0);
  };

  // Gestion des demandes
  const addDemande = () => {
    setFormData(prev => ({
      ...prev,
      demandes: [...prev.demandes, { typeDossier: 'Naissance', cout: 5000 }]
    }));
  };

  const removeDemande = (index) => {
    setFormData(prev => ({
      ...prev,
      demandes: prev.demandes.filter((_, i) => i !== index)
    }));
  };

  const updateDemande = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      demandes: prev.demandes.map((demande, i) => 
        i === index ? { ...demande, [field]: value } : demande
      )
    }));
  };

  // Ajout de modifications
  const addModification = async (dossierId, champ, ancienneValeur, nouvelleValeur) => {
    const modification = {
      id: Date.now(),
      dossierId,
      champ,
      ancienneValeur,
      nouvelleValeur,
      dateModification: new Date().toISOString(),
      utilisateur: currentUser?.username || 'Système'
    };

    try {
      await modificationsAPI.create(modification);
      setModifications([modification, ...modifications]);
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      const updatedModifications = [modification, ...modifications];
      setModifications(updatedModifications);
      localStorage.setItem('registreModifications', JSON.stringify(updatedModifications));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const nouveauDossier = {
      ...formData,
      id: editingDossier ? editingDossier.id : Date.now(),
      numeroSuivi: generateNumeroSuivi(),
      numeroDossier: generateNumeroDossier(),
      coutTotal: calculateCoutTotal(formData.demandes),
      dateCreation: editingDossier ? editingDossier.dateCreation : new Date().toISOString()
    };

    try {
      if (editingDossier) {
        const updatedDossier = await dossiersAPI.update(editingDossier.id, nouveauDossier);
        setDossiers(dossiers.map(d => d.id === editingDossier.id ? updatedDossier : d));
        showNotification('Dossier modifié avec succès !', 'success');
      } else {
        const savedDossier = await dossiersAPI.create(nouveauDossier);
        setDossiers([savedDossier, ...dossiers]);
        showNotification('Dossier ajouté avec succès !', 'success');
      }
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      if (editingDossier) {
        const updatedDossiers = dossiers.map(d => d.id === editingDossier.id ? nouveauDossier : d);
        setDossiers(updatedDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
        showNotification('Dossier modifié avec succès !', 'success');
      } else {
        const updatedDossiers = [nouveauDossier, ...dossiers];
        setDossiers(updatedDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
        showNotification('Dossier ajouté avec succès !', 'success');
      }
    }

    setShowForm(false);
    setEditingDossier(null);
    resetForm();
  };

  // Édition d'un dossier
  const handleEdit = (dossier) => {
    setEditingDossier(dossier);
    setFormData({
      nomUsager: dossier.nomUsager || '',
      prenomUsager: dossier.prenomUsager || '',
      dateNaissance: dossier.dateNaissance || '',
      lieuNaissance: dossier.lieuNaissance || '',
      nationalite: dossier.nationalite || '',
      adresse: dossier.adresse || '',
      telephone: dossier.telephone || '',
      email: dossier.email || '',
      typeDossier: dossier.typeDossier || 'Naissance',
      demandes: dossier.demandes || [{ typeDossier: 'Naissance', cout: 5000 }],
      dateDepot: dossier.dateDepot || new Date().toISOString().split('T')[0],
      dateRetrait: dossier.dateRetrait || '',
      statut: dossier.statut || 'En cours',
      agentId: dossier.agentId || '',
      observations: dossier.observations || ''
    });
    setShowForm(true);
  };

  // Suppression d'un dossier
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      try {
        await dossiersAPI.delete(id);
        setDossiers(dossiers.filter(d => d.id !== id));
        showNotification('Dossier supprimé avec succès !', 'success');
      } catch (error) {
        console.log('API non disponible, utilisation localStorage');
        const updatedDossiers = dossiers.filter(d => d.id !== id);
        setDossiers(updatedDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
        showNotification('Dossier supprimé avec succès !', 'success');
      }
    }
  };

  // Nouveau dossier
  const handleNewDossier = () => {
    setEditingDossier(null);
    resetForm();
    setShowForm(true);
  };

  // Couleurs des statuts
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Prêt pour création d\'acte': return 'bg-purple-100 text-purple-800';
      case 'Acte créé': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistiques
  const getStatistiques = () => {
    const total = dossiers.length;
    const enCours = dossiers.filter(d => d.statut === 'En cours').length;
    const termines = dossiers.filter(d => d.statut === 'Terminé').length;
    const recettesTotales = dossiers.reduce((total, d) => total + (d.coutTotal || 0), 0);
    const cemois = dossiers.filter(d => {
      const date = new Date(d.dateCreation);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return { total, enCours, termines, recettesTotales, cemois };
  };

  // Filtrage des dossiers
  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = !searchTerm || 
      (dossier.nomUsager && dossier.nomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dossier.prenomUsager && dossier.prenomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dossier.numeroSuivi && dossier.numeroSuivi.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filterType || 
      (dossier.demandes && dossier.demandes.some(d => d.typeDossier === filterType));
    
    return matchesSearch && matchesType;
  });

  // Notifications
  const showNotification = (message, type = 'success') => {
    // Implémentation simple de notification
    alert(message);
  };

  // Validation du formulaire
  const validateForm = () => {
    if (!formData.nomUsager || !formData.prenomUsager) {
      showNotification('Veuillez remplir les informations de l\'usager', 'error');
      return false;
    }
    return true;
  };

  const statistiques = getStatistiques();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registre d'État Civil</h1>
              <p className="text-sm text-gray-600">Diplomatie Ivoirienne</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que {currentUser?.username}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dossiers', label: 'Dossiers', icon: FileText },
              { id: 'statistiques', label: 'Statistiques', icon: BarChart3 },
              { id: 'agents', label: 'Agents', icon: User },
              { id: 'utilisateurs', label: 'Utilisateurs', icon: User },
              { id: 'actes', label: 'Actes', icon: FileText },
              { id: 'dispatching', label: 'Dispatching', icon: Clock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Dossiers */}
        {activeTab === 'dossiers' && (
          <div>
            {/* Barre d'outils */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par numéro, nom, acte..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">Tous les types</option>
                    {typesDossier.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleNewDossier}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau Dossier
                  </button>
                </div>
              </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDossiers.map(dossier => (
                      <tr key={dossier.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dossier.numeroSuivi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dossier.nomUsager} {dossier.prenomUsager}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dossier.demandes && dossier.demandes.map(dem => dem.typeDossier).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dossier.statut)}`}>
                            {dossier.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(dossier.coutTotal || 0).toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(dossier)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Modifier le dossier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(dossier.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer le dossier"
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

        {/* Section Statistiques */}
        {activeTab === 'statistiques' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistiques</h2>
            
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-blue-100 text-sm">Total Dossiers</p>
                    <p className="text-2xl font-bold">{statistiques.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-green-100 text-sm">Recettes Totales</p>
                    <p className="text-2xl font-bold">{(statistiques.recettesTotales || 0).toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-yellow-100 text-sm">Ce Mois</p>
                    <p className="text-2xl font-bold">{statistiques.cemois}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-purple-100 text-sm">Terminés</p>
                    <p className="text-2xl font-bold">{statistiques.termines}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Agents */}
        {activeTab === 'agents' && (
          <div className="p-6">
            <GestionAgents
              agents={agents}
              setAgents={setAgents}
              dossiers={dossiers}
              onAssignDossier={() => {}}
            />
          </div>
        )}

        {/* Section Utilisateurs */}
        {activeTab === 'utilisateurs' && (
          <div className="p-6">
            <GestionUtilisateurs
              utilisateurs={utilisateurs}
              setUtilisateurs={setUtilisateurs}
              currentUser={currentUser}
            />
          </div>
        )}
        
        {/* Section Actes */}
        {activeTab === 'actes' && (
          <div className="p-6">
            <GestionActes dossiers={dossiers} onClose={() => setActiveTab('dossiers')} />
          </div>
        )}

        {/* Section Dispatching */}
        {activeTab === 'dispatching' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestion du Dispatching</h2>
            <p className="text-gray-600">Interface de dispatching en cours de développement...</p>
          </div>
        )}
      </div>

      {/* Modal de création/édition de dossier */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingDossier ? 'Modifier le Dossier' : 'Nouveau Dossier'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de l'usager */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informations de l'Usager</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={formData.nomUsager}
                        onChange={(e) => setFormData({...formData, nomUsager: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        value={formData.prenomUsager}
                        onChange={(e) => setFormData({...formData, prenomUsager: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                      <input
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                      <input
                        type="text"
                        value={formData.lieuNaissance}
                        onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations du dossier */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informations du Dossier</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type de dossier</label>
                      <select
                        value={formData.typeDossier}
                        onChange={(e) => setFormData({...formData, typeDossier: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {typesDossier.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de dépôt</label>
                      <input
                        type="date"
                        value={formData.dateDepot}
                        onChange={(e) => setFormData({...formData, dateDepot: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de retrait prévue</label>
                      <input
                        type="date"
                        value={formData.dateRetrait}
                        onChange={(e) => setFormData({...formData, dateRetrait: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Observations</label>
                      <textarea
                        value={formData.observations}
                        onChange={(e) => setFormData({...formData, observations: e.target.value})}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingDossier ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
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

export default RegistreEtatCivil; 