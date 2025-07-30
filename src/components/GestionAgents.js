import React, { useState, useEffect } from 'react';
import { User, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, BarChart3, Calendar, Phone, Mail, MapPin } from 'lucide-react';

const GestionAgents = ({ agents, setAgents, dossiers, onAssignDossier }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    matricule: '',
    telephone: '',
    email: '',
    adresse: '',
    specialite: '',
    actif: true
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDispatching, setShowDispatching] = useState(false);

  const resetForm = () => {
    setFormData({
      nom: '',
      matricule: '',
      telephone: '',
      email: '',
      adresse: '',
      specialite: '',
      actif: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAgent) {
      setAgents(agents.map(a => a.id === editingAgent.id ? { ...formData, id: editingAgent.id } : a));
      setEditingAgent(null);
    } else {
      const newAgent = {
        ...formData,
        id: Date.now(),
        dateCreation: new Date().toISOString(),
        dossiersAssignes: [],
        statistiques: {
          totalTraites: 0,
          enCours: 0,
          termines: 0,
          recettes: 0
        }
      };
      setAgents([...agents, newAgent]);
    }
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (agent) => {
    setFormData(agent);
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      setAgents(agents.filter(a => a.id !== id));
    }
  };

  const getAgentStats = (agentId) => {
    const agentDossiers = dossiers.filter(d => d.agentId === agentId);
    return {
      total: agentDossiers.length,
      enCours: agentDossiers.filter(d => d.statut === 'En cours').length,
      termines: agentDossiers.filter(d => d.statut === 'Terminé').length,
      recettes: agentDossiers.reduce((total, d) => total + (d.coutTotal || 0), 0)
    };
  };

  const getDossiersNonAssignes = () => {
    return dossiers.filter(d => !d.agentId && d.statut === 'En cours');
  };

  const assignDossierToAgent = (dossierId, agentId) => {
    onAssignDossier(dossierId, agentId);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Agents</h2>
          <p className="text-gray-600">Gérez les agents et assignez les dossiers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDispatching(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Dispatching
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingAgent(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvel Agent
          </button>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agents Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.actif).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers Non Assignés</p>
              <p className="text-2xl font-bold text-gray-900">{getDossiersNonAssignes().length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recettes</p>
              <p className="text-2xl font-bold text-gray-900">
                {dossiers.reduce((total, d) => total + (d.coutTotal || 0), 0).toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des agents */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Agents</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dossiers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map(agent => {
                const stats = getAgentStats(agent.id);
                return (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.nom}</div>
                          <div className="text-sm text-gray-500">Matricule: {agent.matricule}</div>
                          {agent.specialite && (
                            <div className="text-xs text-blue-600">{agent.specialite}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {agent.telephone && (
                          <div className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{agent.telephone}</span>
                          </div>
                        )}
                        {agent.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{agent.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium">{stats.total}</span>
                          <span className="text-gray-500">total</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-yellow-600">{stats.enCours}</span>
                          <span className="text-gray-400">en cours</span>
                          <span className="text-green-600">{stats.termines}</span>
                          <span className="text-gray-400">terminés</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium text-green-600">
                          {stats.recettes.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          {stats.total > 0 ? Math.round((stats.termines / stats.total) * 100) : 0}% taux de réussite
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agent.actif 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agent)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour le formulaire d'agent */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAgent ? 'Modifier l\'Agent' : 'Nouvel Agent'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matricule *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.matricule}
                    onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.specialite}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    placeholder="Ex: Actes de naissance, Mariage..."
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="actif"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.actif}
                  onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                />
                <label htmlFor="actif" className="ml-2 block text-sm text-gray-900">
                  Agent actif
                </label>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAgent ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour le dispatching */}
      {showDispatching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Dispatching des Dossiers</h2>
              <p className="text-gray-600 text-sm mt-1">Assignez les dossiers non assignés aux agents</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dossiers non assignés */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Dossiers Non Assignés</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getDossiersNonAssignes().map(dossier => (
                      <div key={dossier.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">
                              {dossier.nomUsager} {dossier.prenomUsager}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dossier.numeroSuivi} - {dossier.demandes?.map(d => d.typeDossier).join(', ')}
                            </div>
                            <div className="text-xs text-gray-400">
                              Arrivée: {dossier.dateArrivee}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {(dossier.coutTotal || 0).toLocaleString()} FCFA
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getDossiersNonAssignes().length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Aucun dossier non assigné
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Agents disponibles */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Agents Disponibles</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {agents.filter(a => a.actif).map(agent => {
                      const stats = getAgentStats(agent.id);
                      return (
                        <div key={agent.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">{agent.nom}</div>
                              <div className="text-sm text-gray-500">{agent.matricule}</div>
                              {agent.specialite && (
                                <div className="text-xs text-blue-600">{agent.specialite}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {stats.total} dossiers
                              </div>
                              <div className="text-xs text-gray-400">
                                {stats.enCours} en cours
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDispatching(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAgents; 