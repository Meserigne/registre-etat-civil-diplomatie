import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import RegistreEtatCivil from './components/RegistreEtatCivil';
import InterfaceAgent from './components/InterfaceAgent';
import GestionAgents from './components/GestionAgents';
import ReponsesPredefinies from './components/ReponsesPredefinies';
import NotificationSystem from './components/NotificationSystem';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dossiers');

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Si pas connecté, afficher la page de connexion
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Si c'est un agent, afficher l'interface agent
  if (currentUser.role === 'agent') {
    return (
      <>
        <NotificationSystem />
        <InterfaceAgent
          currentUser={currentUser}
          dossiers={[]} // Sera géré par le contexte global
          setDossiers={() => {}} // Sera géré par le contexte global
          onLogout={handleLogout}
        />
      </>
    );
  }

  // Si c'est un admin, afficher l'interface complète
  return (
    <>
      <NotificationSystem />
      <RegistreEtatCivil
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}

export default App; 