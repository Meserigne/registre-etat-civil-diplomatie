import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, Building, Flag } from 'lucide-react';
import { LogoMinistereComplet } from './LogoMinistere';

const Login = ({ onLogin }) => {
  alert('Page de connexion chargée - Connectez-vous pour voir l\'interface');
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulation d'une vérification d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.username && credentials.password) {
        onLogin({
          username: credentials.username,
          role: credentials.username === 'admin' ? 'admin' : 'agent'
        });
    } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Logo officiel en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-6xl font-bold text-green-800">🇨🇮</div>
          <div className="text-2xl font-bold text-green-800 mt-2">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* En-tête officiel */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <LogoMinistereComplet size="xl" className="text-green-800" />
          </div>
          
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            RÉPUBLIQUE DE CÔTE D'IVOIRE
          </h1>
          <h2 className="text-lg font-semibold text-green-700 mb-1">
            MINISTÈRE DES AFFAIRES ÉTRANGÈRES
          </h2>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="w-8 h-1 bg-orange-500"></div>
            <div className="w-8 h-1 bg-green-600"></div>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* En-tête du formulaire */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-center">
              {/* Logo officiel */}
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <div className="text-white text-sm font-bold">🇨🇮</div>
                </div>
              </div>
              <Shield className="w-6 h-6 text-white mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Système de Gestion du Registre d'État Civil
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-red-700 text-sm">{error}</span>
            </div>
              </div>
            )}

            {/* Champ nom d'utilisateur */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Informations de test */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Comptes de test :</p>
                  <p>• Admin : <code className="bg-blue-100 px-1 rounded">admin</code> / <code className="bg-blue-100 px-1 rounded">admin123</code></p>
                  <p>• Agent : <code className="bg-blue-100 px-1 rounded">agent</code> / <code className="bg-blue-100 px-1 rounded">agent123</code></p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Pied de page */}
        <div className="text-center mt-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            {/* Logo officiel */}
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <div className="text-white text-xs font-bold">🇨🇮</div>
            </div>
            <Building className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Système Officiel</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2024 Ministère des Affaires Étrangères - Côte d'Ivoire
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 