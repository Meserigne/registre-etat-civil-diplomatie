import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  FileText,
  Settings,
  Trash2,
  Copy,
  Archive
} from 'lucide-react';

const SauvegardeAutomatique = ({ dossiers = [], agents = [], utilisateurs = [], modifications = [] }) => {
  const [sauvegardes, setSauvegardes] = useState([]);
  const [derniereSauvegarde, setDerniereSauvegarde] = useState(null);
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);
  const [autoSauvegarde, setAutoSauvegarde] = useState(true);
  const [intervalleSauvegarde, setIntervalleSauvegarde] = useState(5); // minutes
  const [statistiques, setStatistiques] = useState({});

  // Charger les sauvegardes existantes
  useEffect(() => {
    const sauvegardesExistentes = localStorage.getItem('sauvegardesAutomatiques');
    if (sauvegardesExistentes) {
      setSauvegardes(JSON.parse(sauvegardesExistentes));
    }
    
    const derniere = localStorage.getItem('derniereSauvegarde');
    if (derniere) {
      setDerniereSauvegarde(JSON.parse(derniere));
    }

    const auto = localStorage.getItem('autoSauvegarde');
    if (auto !== null) {
      setAutoSauvegarde(JSON.parse(auto));
    }

    const intervalle = localStorage.getItem('intervalleSauvegarde');
    if (intervalle) {
      setIntervalleSauvegarde(JSON.parse(intervalle));
    }
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (!autoSauvegarde) return;

    const interval = setInterval(() => {
      effectuerSauvegardeAutomatique();
    }, intervalleSauvegarde * 60 * 1000); // Convertir en millisecondes

    return () => clearInterval(interval);
  }, [autoSauvegarde, intervalleSauvegarde, dossiers, agents, utilisateurs, modifications]);

  // Calculer les statistiques
  useEffect(() => {
    // Vérifier que toutes les props sont des tableaux
    const dossiersArray = Array.isArray(dossiers) ? dossiers : [];
    const agentsArray = Array.isArray(agents) ? agents : [];
    const utilisateursArray = Array.isArray(utilisateurs) ? utilisateurs : [];
    const modificationsArray = Array.isArray(modifications) ? modifications : [];
    
    const stats = {
      totalDossiers: dossiersArray.length,
      totalAgents: agentsArray.length,
      totalUtilisateurs: utilisateursArray.length,
      totalModifications: modificationsArray.length,
      tailleDonnees: JSON.stringify({ dossiers: dossiersArray, agents: agentsArray, utilisateurs: utilisateursArray, modifications: modificationsArray }).length,
      derniereSauvegarde: derniereSauvegarde ? new Date(derniereSauvegarde.timestamp).toLocaleString() : 'Aucune'
    };
    setStatistiques(stats);
  }, [dossiers, agents, utilisateurs, modifications, derniereSauvegarde]);

  const effectuerSauvegardeAutomatique = () => {
    // Vérifier que toutes les props sont des tableaux
    const dossiersArray = Array.isArray(dossiers) ? dossiers : [];
    const agentsArray = Array.isArray(agents) ? agents : [];
    const utilisateursArray = Array.isArray(utilisateurs) ? utilisateurs : [];
    const modificationsArray = Array.isArray(modifications) ? modifications : [];
    
    setSauvegardeEnCours(true);
    
    const sauvegarde = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'automatique',
      donnees: {
        dossiers: dossiersArray,
        agents: agentsArray,
        utilisateurs: utilisateursArray,
        modifications: modificationsArray
      },
      taille: JSON.stringify({ dossiers: dossiersArray, agents: agentsArray, utilisateurs: utilisateursArray, modifications: modificationsArray }).length
    };

    // Ajouter à la liste des sauvegardes
    const nouvellesSauvegardes = [sauvegarde, ...sauvegardes].slice(0, 20); // Garder les 20 dernières
    setSauvegardes(nouvellesSauvegardes);
    localStorage.setItem('sauvegardesAutomatiques', JSON.stringify(nouvellesSauvegardes));
    
    // Mettre à jour la dernière sauvegarde
    setDerniereSauvegarde(sauvegarde);
    localStorage.setItem('derniereSauvegarde', JSON.stringify(sauvegarde));
    
    setTimeout(() => setSauvegardeEnCours(false), 1000);
  };

  const effectuerSauvegardeManuelle = () => {
    // Vérifier que toutes les props sont des tableaux
    const dossiersArray = Array.isArray(dossiers) ? dossiers : [];
    const agentsArray = Array.isArray(agents) ? agents : [];
    const utilisateursArray = Array.isArray(utilisateurs) ? utilisateurs : [];
    const modificationsArray = Array.isArray(modifications) ? modifications : [];
    
    setSauvegardeEnCours(true);
    
    const sauvegarde = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'manuelle',
      donnees: {
        dossiers: dossiersArray,
        agents: agentsArray,
        utilisateurs: utilisateursArray,
        modifications: modificationsArray
      },
      taille: JSON.stringify({ dossiers: dossiersArray, agents: agentsArray, utilisateurs: utilisateursArray, modifications: modificationsArray }).length
    };

    const nouvellesSauvegardes = [sauvegarde, ...sauvegardes].slice(0, 20);
    setSauvegardes(nouvellesSauvegardes);
    localStorage.setItem('sauvegardesAutomatiques', JSON.stringify(nouvellesSauvegardes));
    
    setDerniereSauvegarde(sauvegarde);
    localStorage.setItem('derniereSauvegarde', JSON.stringify(sauvegarde));
    
    setTimeout(() => setSauvegardeEnCours(false), 1000);
  };

  const restaurerSauvegarde = (sauvegarde) => {
    if (window.confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Cela remplacera toutes les données actuelles.')) {
      // Restaurer les données
      localStorage.setItem('registreDossiers', JSON.stringify(sauvegarde.donnees.dossiers));
      localStorage.setItem('registreAgents', JSON.stringify(sauvegarde.donnees.agents));
      localStorage.setItem('registreUtilisateurs', JSON.stringify(sauvegarde.donnees.utilisateurs));
      localStorage.setItem('registreModifications', JSON.stringify(sauvegarde.donnees.modifications));
      
      // Recharger la page pour appliquer les changements
      window.location.reload();
    }
  };

  const supprimerSauvegarde = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      const nouvellesSauvegardes = sauvegardes.filter(s => s.id !== id);
      setSauvegardes(nouvellesSauvegardes);
      localStorage.setItem('sauvegardesAutomatiques', JSON.stringify(nouvellesSauvegardes));
    }
  };

  const exporterSauvegarde = (sauvegarde) => {
    const dataStr = JSON.stringify(sauvegarde, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sauvegarde_${new Date(sauvegarde.timestamp).toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importerSauvegarde = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const sauvegarde = JSON.parse(e.target.result);
          const nouvellesSauvegardes = [sauvegarde, ...sauvegardes].slice(0, 20);
          setSauvegardes(nouvellesSauvegardes);
          localStorage.setItem('sauvegardesAutomatiques', JSON.stringify(nouvellesSauvegardes));
          alert('Sauvegarde importée avec succès !');
        } catch (error) {
          alert('Erreur lors de l\'importation de la sauvegarde.');
        }
      };
      reader.readAsText(file);
    }
  };

  const viderSauvegardes = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les sauvegardes ?')) {
      setSauvegardes([]);
      localStorage.removeItem('sauvegardesAutomatiques');
      localStorage.removeItem('derniereSauvegarde');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Save className="w-5 h-5 text-blue-600" />
          Sauvegarde Automatique
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={effectuerSauvegardeManuelle}
            disabled={sauvegardeEnCours}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {sauvegardeEnCours ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {sauvegardeEnCours ? 'Sauvegarde...' : 'Sauvegarde Manuelle'}
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSauvegarde"
              checked={autoSauvegarde}
              onChange={(e) => {
                setAutoSauvegarde(e.target.checked);
                localStorage.setItem('autoSauvegarde', JSON.stringify(e.target.checked));
              }}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="autoSauvegarde" className="text-sm font-medium text-gray-700">
              Sauvegarde automatique
            </label>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Intervalle :</label>
            <select
              value={intervalleSauvegarde}
              onChange={(e) => {
                setIntervalleSauvegarde(Number(e.target.value));
                localStorage.setItem('intervalleSauvegarde', JSON.stringify(Number(e.target.value)));
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{statistiques.totalDossiers || 0}</div>
              <div className="text-sm text-blue-700">Dossiers</div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">{statistiques.totalAgents || 0}</div>
              <div className="text-sm text-green-700">Agents</div>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-900">{sauvegardes.length}</div>
              <div className="text-sm text-purple-700">Sauvegardes</div>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-sm font-bold text-orange-900">
                {derniereSauvegarde ? 'Récente' : 'Aucune'}
              </div>
              <div className="text-xs text-orange-700">
                {derniereSauvegarde ? new Date(derniereSauvegarde.timestamp).toLocaleTimeString() : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dernière sauvegarde */}
      {derniereSauvegarde && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Dernière sauvegarde</h4>
                <p className="text-sm text-green-700">
                  {new Date(derniereSauvegarde.timestamp).toLocaleString()} 
                  ({derniereSauvegarde.type})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exporterSauvegarde(derniereSauvegarde)}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={() => restaurerSauvegarde(derniereSauvegarde)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Importer Sauvegarde
          <input
            type="file"
            accept=".json"
            onChange={importerSauvegarde}
            className="hidden"
          />
        </label>
        <button
          onClick={viderSauvegardes}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Vider Toutes
        </button>
      </div>

      {/* Liste des sauvegardes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Historique des Sauvegardes</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sauvegardes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Archive className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Aucune sauvegarde disponible</p>
            </div>
          ) : (
            sauvegardes.map((sauvegarde) => (
              <div key={sauvegarde.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      sauvegarde.type === 'automatique' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(sauvegarde.timestamp).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {sauvegarde.type} • {(sauvegarde.taille / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => exporterSauvegarde(sauvegarde)}
                      className="p-1 text-gray-600 hover:text-blue-600"
                      title="Exporter"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => restaurerSauvegarde(sauvegarde)}
                      className="p-1 text-gray-600 hover:text-green-600"
                      title="Restaurer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => supprimerSauvegarde(sauvegarde.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SauvegardeAutomatique; 