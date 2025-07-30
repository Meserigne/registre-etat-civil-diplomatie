import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [dossiers, setDossiers] = useState([]);
  const [agents, setAgents] = useState([
    { id: 1, nom: 'Agent 1', matricule: 'AG001', actif: true },
    { id: 2, nom: 'Agent 2', matricule: 'AG002', actif: true },
    { id: 3, nom: 'Agent 3', matricule: 'AG003', actif: true }
  ]);
  const [modifications, setModifications] = useState([]);

  // Chargement des données depuis localStorage
  useEffect(() => {
    const savedDossiers = localStorage.getItem('registreDossiers');
    const savedAgents = localStorage.getItem('registreAgents');
    const savedModifications = localStorage.getItem('registreModifications');
    
    if (savedDossiers) {
      setDossiers(JSON.parse(savedDossiers));
    }
    
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    }
    
    if (savedModifications) {
      setModifications(JSON.parse(savedModifications));
    }
  }, []);

  // Sauvegarde des dossiers
  useEffect(() => {
    localStorage.setItem('registreDossiers', JSON.stringify(dossiers));
  }, [dossiers]);

  // Sauvegarde des agents
  useEffect(() => {
    localStorage.setItem('registreAgents', JSON.stringify(agents));
  }, [agents]);

  // Sauvegarde des modifications
  useEffect(() => {
    localStorage.setItem('registreModifications', JSON.stringify(modifications));
  }, [modifications]);

  const value = {
    dossiers,
    setDossiers,
    agents,
    setAgents,
    modifications,
    setModifications
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 