import React, { useState, useEffect } from 'react';
import { Github, LogOut, Save, Download } from 'lucide-react';
import githubService from '../services/github';

const GitHubAuth = ({ onUserChange, onDataSync }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (githubService.isAuthenticated()) {
      const userInfo = await githubService.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        onUserChange && onUserChange(userInfo);
      }
    }
  };

  const handleLogin = () => {
    const authUrl = githubService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    githubService.logout();
    setUser(null);
    onUserChange && onUserChange(null);
    setMessage('Déconnecté de GitHub');
  };

  const handleSaveToGitHub = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Récupérer les données locales
      const localData = {
        dossiers: JSON.parse(localStorage.getItem('registreDossiers') || '[]'),
        modifications: JSON.parse(localStorage.getItem('registreModifications') || '[]'),
        agents: JSON.parse(localStorage.getItem('registreAgents') || '[]'),
        actes: JSON.parse(localStorage.getItem('registreActes') || '[]'),
        utilisateurs: JSON.parse(localStorage.getItem('registreUtilisateurs') || '[]')
      };

      const success = await githubService.saveDataToGitHub(localData);
      
      if (success) {
        setMessage('✅ Données sauvegardées sur GitHub avec succès !');
      } else {
        setMessage('❌ Erreur lors de la sauvegarde sur GitHub');
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la sauvegarde : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromGitHub = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const data = await githubService.getDataFromGitHub();
      
      if (data) {
        // Restaurer les données locales
        if (data.dossiers) localStorage.setItem('registreDossiers', JSON.stringify(data.dossiers));
        if (data.modifications) localStorage.setItem('registreModifications', JSON.stringify(data.modifications));
        if (data.agents) localStorage.setItem('registreAgents', JSON.stringify(data.agents));
        if (data.actes) localStorage.setItem('registreActes', JSON.stringify(data.actes));
        if (data.utilisateurs) localStorage.setItem('registreUtilisateurs', JSON.stringify(data.utilisateurs));
        
        setMessage('✅ Données chargées depuis GitHub avec succès !');
        onDataSync && onDataSync();
      } else {
        setMessage('❌ Aucune donnée trouvée sur GitHub');
      }
    } catch (error) {
      setMessage('❌ Erreur lors du chargement : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gérer le callback OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);

  const handleOAuthCallback = async (code, state) => {
    if (!githubService.verifyState(state)) {
      setMessage('❌ Erreur de sécurité lors de l\'authentification');
      return;
    }

    setLoading(true);
    const success = await githubService.exchangeCodeForToken(code);
    
    if (success) {
      const userInfo = await githubService.getUserInfo();
      setUser(userInfo);
      onUserChange && onUserChange(userInfo);
      setMessage('✅ Connexion GitHub réussie !');
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setMessage('❌ Erreur lors de l\'authentification GitHub');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Github className="w-5 h-5 mr-2" />
          Connexion GitHub
        </h3>
      </div>

      {message && (
        <div className={`p-3 rounded-md mb-4 ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {!user ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connectez-vous avec votre compte GitHub pour sauvegarder vos données
          </p>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto disabled:opacity-50"
          >
            <Github className="w-4 h-4 mr-2" />
            {loading ? 'Connexion...' : 'Se connecter avec GitHub'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar_url} 
              alt={user.login}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{user.name || user.login}</p>
              <p className="text-sm text-gray-500">@{user.login}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSaveToGitHub}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder sur GitHub'}
            </button>
            
            <button
              onClick={handleLoadFromGitHub}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Chargement...' : 'Charger depuis GitHub'}
            </button>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubAuth; 