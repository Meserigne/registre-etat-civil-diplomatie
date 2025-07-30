import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Users, FileText, 
  CheckCircle, Clock, AlertTriangle, DollarSign, Calendar,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

const Statistiques = ({ dossiers, agents, actes }) => {
  const [activePeriod, setActivePeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  // Fonctions utilitaires
  const getTypeColor = (type) => {
    const colors = {
      'Naissance': '#3B82F6',
      'Décès': '#EF4444',
      'Mariage': '#10B981',
      'Divorce': '#F59E0B',
      'Adoption': '#8B5CF6',
      'Autre': '#6B7280'
    };
    return colors[type] || colors['Autre'];
  };

  const getStatutColor = (statut) => {
    const colors = {
      'En cours': '#F59E0B',
      'Terminé': '#10B981',
      'En attente': '#EF4444'
    };
    return colors[statut] || '#6B7280';
  };

  // Calculs optimisés avec useMemo
  const statistiques = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrer les données par période
    const filterByPeriod = (data, period) => {
      const date = new Date(data.dateCreation || data.dateDepot);
      switch (period) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return date >= weekAgo;
        case 'month':
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        case 'quarter':
          const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1);
          return date >= quarterStart;
        case 'year':
          return date.getFullYear() === currentYear;
        default:
          return true;
      }
    };

    const dossiersFiltres = dossiers.filter(d => filterByPeriod(d, activePeriod));
    const actesFiltres = actes.filter(a => filterByPeriod(a, activePeriod));

    // Statistiques générales
    const totalDossiers = dossiersFiltres.length;
    const dossiersEnCours = dossiersFiltres.filter(d => d.statut === 'En cours').length;
    const dossiersTermines = dossiersFiltres.filter(d => d.statut === 'Terminé').length;
    const dossiersEnAttente = dossiersFiltres.filter(d => d.statut === 'En attente').length;

    // Statistiques financières
    const recettesTotal = dossiersFiltres.reduce((total, d) => total + (d.coutTotal || 0), 0);
    const recettesMoyennes = totalDossiers > 0 ? recettesTotal / totalDossiers : 0;

    // Statistiques des agents
    const agentsActifs = agents.filter(a => a.actif).length;
    const agentsParDossier = totalDossiers > 0 ? totalDossiers / agentsActifs : 0;

    // Statistiques des actes
    const totalActes = actesFiltres.length;
    const actesParDossier = totalDossiers > 0 ? totalActes / totalDossiers : 0;

    // Évolution (comparaison avec la période précédente)
    const getPreviousPeriodData = (period) => {
      const prevPeriod = new Date();
      switch (period) {
        case 'week':
          prevPeriod.setDate(prevPeriod.getDate() - 14);
          break;
        case 'month':
          prevPeriod.setMonth(prevPeriod.getMonth() - 1);
          break;
        case 'quarter':
          prevPeriod.setMonth(prevPeriod.getMonth() - 3);
          break;
        case 'year':
          prevPeriod.setFullYear(prevPeriod.getFullYear() - 1);
          break;
      }
      return dossiers.filter(d => {
        const date = new Date(d.dateCreation || d.dateDepot);
        return date >= prevPeriod && date < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }).length;
    };

    const prevPeriodTotal = getPreviousPeriodData(activePeriod);
    const evolution = prevPeriodTotal > 0 ? ((totalDossiers - prevPeriodTotal) / prevPeriodTotal) * 100 : 0;

    // Répartition par type
    const repartitionTypes = dossiersFiltres.reduce((acc, d) => {
      const type = d.demandes?.[0]?.typeDossier || 'Autre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Répartition par statut
    const repartitionStatuts = {
      'En cours': dossiersEnCours,
      'Terminé': dossiersTermines,
      'En attente': dossiersEnAttente
    };

    // Performance des agents
    const performanceAgents = agents.map(agent => {
      const agentDossiers = dossiersFiltres.filter(d => d.agentId === agent.id);
      const termines = agentDossiers.filter(d => d.statut === 'Terminé').length;
      const total = agentDossiers.length;
      return {
        nom: agent.nom,
        matricule: agent.matricule,
        total,
        termines,
        taux: total > 0 ? (termines / total) * 100 : 0
      };
    }).filter(p => p.total > 0).sort((a, b) => b.taux - a.taux);

    return {
      generales: {
        totalDossiers,
        dossiersEnCours,
        dossiersTermines,
        dossiersEnAttente,
        evolution
      },
      financieres: {
        recettesTotal,
        recettesMoyennes,
        recettesParJour: recettesTotal / 30 // approximation
      },
      agents: {
        agentsActifs,
        agentsParDossier,
        performanceAgents
      },
      actes: {
        totalActes,
        actesParDossier
      },
      repartitions: {
        types: repartitionTypes,
        statuts: repartitionStatuts
      }
    };
  }, [dossiers, agents, actes, activePeriod]);

  // Données pour les graphiques
  const chartData = useMemo(() => {
    const { repartitions } = statistiques;
    
    return {
      types: Object.entries(repartitions.types).map(([type, count]) => ({
        name: type,
        value: count,
        color: getTypeColor(type)
      })),
      statuts: Object.entries(repartitions.statuts).map(([statut, count]) => ({
        name: statut,
        value: count,
        color: getStatutColor(statut)
      }))
    };
  }, [statistiques]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteurs */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
            <p className="text-gray-600">Statistiques et analyses de performance</p>
          </div>
          
          <div className="flex gap-2">
            <select
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Vue d'ensemble</option>
              <option value="performance">Performance</option>
              <option value="finances">Finances</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Dossiers</p>
              <p className="text-2xl font-bold text-gray-900">{statistiques.generales.totalDossiers}</p>
              <div className="flex items-center mt-2">
                {statistiques.generales.evolution > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ml-1 ${
                  statistiques.generales.evolution > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(statistiques.generales.evolution)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-2xl font-bold text-yellow-600">{statistiques.generales.dossiersEnCours}</p>
              <p className="text-sm text-gray-500 mt-1">
                {statistiques.generales.totalDossiers > 0 
                  ? `${((statistiques.generales.dossiersEnCours / statistiques.generales.totalDossiers) * 100).toFixed(1)}%`
                  : '0%'
                } du total
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-green-600">{statistiques.generales.dossiersTermines}</p>
              <p className="text-sm text-gray-500 mt-1">
                {statistiques.generales.totalDossiers > 0 
                  ? `${((statistiques.generales.dossiersTermines / statistiques.generales.totalDossiers) * 100).toFixed(1)}%`
                  : '0%'
                } du total
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recettes</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(statistiques.financieres.recettesTotal)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Moyenne: {formatCurrency(statistiques.financieres.recettesMoyennes)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par type */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
          <div className="space-y-3">
            {chartData.types.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.value / Math.max(...chartData.types.map(t => t.value))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance des agents */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Agents</h3>
          <div className="space-y-3">
            {statistiques.agents.performanceAgents.slice(0, 5).map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{agent.nom}</p>
                  <p className="text-xs text-gray-500">{agent.matricule}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {agent.termines}/{agent.total}
                  </p>
                  <p className="text-xs text-gray-500">
                    {agent.taux.toFixed(1)}% de réussite
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques avancées */}
      {selectedView === 'performance' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs de Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Taux de Traitement</p>
              <p className="text-2xl font-bold text-blue-600">
                {statistiques.generales.totalDossiers > 0 
                  ? `${((statistiques.generales.dossiersTermines / statistiques.generales.totalDossiers) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Dossiers/Agent</p>
              <p className="text-2xl font-bold text-green-600">
                {statistiques.agents.agentsParDossier.toFixed(1)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Actes/Dossier</p>
              <p className="text-2xl font-bold text-purple-600">
                {statistiques.actes.actesParDossier.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'finances' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse Financière</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Recettes par Type</h4>
              <div className="space-y-2">
                {Object.entries(statistiques.repartitions.types).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{type}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(count * 5000)} {/* Approximation du coût */}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Projections</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recettes/jour</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(statistiques.financieres.recettesParJour)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recettes/mois</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(statistiques.financieres.recettesParJour * 30)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistiques; 