import React, { useState, useEffect } from 'react';
import { Github, LogOut, Save, Download, Shield, Building2, MapPin } from 'lucide-react';
import githubDiplomatieService from '../services/github-diplomatie';

const GitHubDiplomatieAuth = ({ onUserChange, onDataSync }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [repositoryInfo, setRepositoryInfo] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (githubDiplomatieService.isAuthenticated()) {
      const userInfo = await githubDiplomatieService.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        onUserChange && onUserChange(userInfo);
        
        // Récupérer les infos du repository
        const repoInfo = await githubDiplomatieService.getRepositoryInfo();
        setRepositoryInfo(repoInfo);
      }
    }
  };

  const handleLogin = () => {
    const authUrl = githubDiplomatieService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    githubDiplomatieService.logout();
    setUser(null);
    setRepositoryInfo(null);
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

      const success = await githubDiplomatieService.saveDataToGitHub(localData);
      
      if (success) {
        setMessage('✅ Données diplomatiques sauvegardées sur GitHub avec succès !');
      } else {
        setMessage('❌ Erreur lors de la sauvegarde diplomatique sur GitHub');
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
      const data = await githubDiplomatieService.getDataFromGitHub();
      
      if (data) {
        // Restaurer les données locales
        if (data.dossiers) localStorage.setItem('registreDossiers', JSON.stringify(data.dossiers));
        if (data.modifications) localStorage.setItem('registreModifications', JSON.stringify(data.modifications));
        if (data.agents) localStorage.setItem('registreAgents', JSON.stringify(data.agents));
        if (data.actes) localStorage.setItem('registreActes', JSON.stringify(data.actes));
        if (data.utilisateurs) localStorage.setItem('registreUtilisateurs', JSON.stringify(data.utilisateurs));
        
        setMessage('✅ Données diplomatiques chargées depuis GitHub avec succès !');
        onDataSync && onDataSync();
      } else {
        setMessage('❌ Aucune donnée diplomatique trouvée sur GitHub');
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
    if (!githubDiplomatieService.verifyState(state)) {
      setMessage('❌ Erreur de sécurité lors de l\'authentification diplomatique');
      return;
    }

    setLoading(true);
    const success = await githubDiplomatieService.exchangeCodeForToken(code);
    
    if (success) {
      const userInfo = await githubDiplomatieService.getUserInfo();
      setUser(userInfo);
      onUserChange && onUserChange(userInfo);
      setMessage('✅ Connexion diplomatique GitHub réussie !');
      
      // Récupérer les infos du repository
      const repoInfo = await githubDiplomatieService.getRepositoryInfo();
      setRepositoryInfo(repoInfo);
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setMessage('❌ Erreur lors de l\'authentification diplomatique GitHub');
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-600" />
          Connexion Diplomatique GitHub
        </h3>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-600 font-medium">Côte d'Ivoire</span>
        </div>
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
          <div className="mb-4">
            <Shield className="w-12 h-12 mx-auto text-blue-600 mb-2" />
            <p className="text-gray-600 mb-2">
              Connectez-vous avec votre compte diplomatique GitHub
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Aw.coulibaly@diplomatie.gouv.ci
            </p>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto disabled:opacity-50 transition-colors"
          >
            <Github className="w-4 h-4 mr-2" />
            {loading ? 'Connexion diplomatique...' : 'Se connecter avec GitHub Diplomatique'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar_url} 
              alt={user.login}
              className="w-12 h-12 rounded-full border-2 border-blue-200"
            />
            <div>
              <p className="font-medium text-gray-900">{user.name || user.login}</p>
              <p className="text-sm text-blue-600">@{user.login}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {repositoryInfo && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Repository Diplomatique</p>
              <p className="text-xs text-blue-600">{repositoryInfo.full_name}</p>
              <p className="text-xs text-blue-500">{repositoryInfo.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={handleSaveToGitHub}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder Données Diplomatiques'}
            </button>
            
            <button
              onClick={handleLoadFromGitHub}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Chargement...' : 'Charger Données Diplomatiques'}
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion Diplomatique
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubDiplomatieAuth; 