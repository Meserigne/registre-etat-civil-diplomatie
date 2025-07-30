import { Octokit } from '@octokit/rest';

// Configuration GitHub OAuth
const GITHUB_CLIENT_ID = 'votre_client_id'; // À remplacer par votre Client ID
const GITHUB_REDIRECT_URI = 'http://localhost:3000/auth/callback';
const GITHUB_SCOPE = 'user:email repo';

class GitHubService {
  constructor() {
    this.octokit = null;
    this.accessToken = localStorage.getItem('github_access_token');
    
    if (this.accessToken) {
      this.initializeOctokit();
    }
  }

  // Initialiser Octokit avec le token
  initializeOctokit() {
    this.octokit = new Octokit({
      auth: this.accessToken
    });
  }

  // Générer l'URL d'autorisation GitHub
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: GITHUB_SCOPE,
      state: this.generateState()
    });
    
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  // Générer un état aléatoire pour la sécurité
  generateState() {
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('github_state', state);
    return state;
  }

  // Vérifier l'état reçu
  verifyState(receivedState) {
    const savedState = localStorage.getItem('github_state');
    return receivedState === savedState;
  }

  // Échanger le code contre un token d'accès
  async exchangeCodeForToken(code) {
    try {
      // Note: En production, cette requête devrait être faite côté serveur
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: 'votre_client_secret', // À remplacer
          code: code,
          redirect_uri: GITHUB_REDIRECT_URI
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        localStorage.setItem('github_access_token', this.accessToken);
        this.initializeOctokit();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'échange du token:', error);
      return false;
    }
  }

  // Obtenir les informations de l'utilisateur
  async getUserInfo() {
    if (!this.octokit) return null;
    
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des infos utilisateur:', error);
      return null;
    }
  }

  // Sauvegarder les données sur GitHub
  async saveDataToGitHub(data, filename = 'registre-data.json') {
    if (!this.octokit) return false;
    
    try {
      const content = JSON.stringify(data, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));
      
      // Essayer de récupérer le fichier existant pour obtenir le SHA
      let sha = null;
      try {
        const { data: existingFile } = await this.octokit.repos.getContent({
          owner: 'votre_username', // À remplacer
          repo: 'registre-etat-civil', // À remplacer
          path: filename
        });
        sha = existingFile.sha;
      } catch (error) {
        // Le fichier n'existe pas encore
      }

      await this.octokit.repos.createOrUpdateFileContents({
        owner: 'votre_username', // À remplacer
        repo: 'registre-etat-civil', // À remplacer
        path: filename,
        message: `Mise à jour registre état civil - ${new Date().toISOString()}`,
        content: encodedContent,
        sha: sha
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde sur GitHub:', error);
      return false;
    }
  }

  // Récupérer les données depuis GitHub
  async getDataFromGitHub(filename = 'registre-data.json') {
    if (!this.octokit) return null;
    
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: 'votre_username', // À remplacer
        repo: 'registre-etat-civil', // À remplacer
        path: filename
      });

      const content = atob(data.content);
      return JSON.parse(content);
    } catch (error) {
      console.error('Erreur lors de la récupération depuis GitHub:', error);
      return null;
    }
  }

  // Se déconnecter
  logout() {
    this.accessToken = null;
    this.octokit = null;
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_state');
  }

  // Vérifier si connecté
  isAuthenticated() {
    return !!this.accessToken;
  }
}

export default new GitHubService(); 