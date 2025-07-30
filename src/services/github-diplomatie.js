import { Octokit } from '@octokit/rest';

// Configuration GitHub pour Aw.coulibaly@diplomatie.gouv.ci
const GITHUB_CLIENT_ID = 'votre_client_id'; // À remplacer par votre Client ID
const GITHUB_CLIENT_SECRET = 'votre_client_secret'; // À remplacer par votre Client Secret
const GITHUB_REDIRECT_URI = 'http://localhost:3000/auth/callback';
const GITHUB_SCOPE = 'user:email repo';
const GITHUB_OWNER = 'AwCoulibaly'; // Votre username GitHub
const GITHUB_REPO = 'registre-etat-civil-diplomatie';

class GitHubDiplomatieService {
  constructor() {
    this.octokit = null;
    this.accessToken = localStorage.getItem('github_diplomatie_token');
    
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
    localStorage.setItem('github_diplomatie_state', state);
    return state;
  }

  // Vérifier l'état reçu
  verifyState(receivedState) {
    const savedState = localStorage.getItem('github_diplomatie_state');
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
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: GITHUB_REDIRECT_URI
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        localStorage.setItem('github_diplomatie_token', this.accessToken);
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

  // Sauvegarder les données diplomatiques sur GitHub
  async saveDataToGitHub(data, filename = 'registre-diplomatie-data.json') {
    if (!this.octokit) return false;
    
    try {
      // Ajouter les métadonnées diplomatiques
      const dataWithMetadata = {
        ...data,
        metadata: {
          organisation: "Ministère des Affaires Étrangères",
          pays: "Côte d'Ivoire",
          centre: "ABIDJAN",
          email: "Aw.coulibaly@diplomatie.gouv.ci",
          version: "1.0.0",
          derniereSynchronisation: new Date().toISOString()
        }
      };

      const content = JSON.stringify(dataWithMetadata, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));
      
      // Essayer de récupérer le fichier existant pour obtenir le SHA
      let sha = null;
      try {
        const { data: existingFile } = await this.octokit.repos.getContent({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          path: filename
        });
        sha = existingFile.sha;
      } catch (error) {
        // Le fichier n'existe pas encore
      }

      await this.octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: filename,
        message: `Mise à jour registre état civil diplomatique - ${new Date().toISOString()}`,
        content: encodedContent,
        sha: sha
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde sur GitHub:', error);
      return false;
    }
  }

  // Récupérer les données diplomatiques depuis GitHub
  async getDataFromGitHub(filename = 'registre-diplomatie-data.json') {
    if (!this.octokit) return null;
    
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
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
    localStorage.removeItem('github_diplomatie_token');
    localStorage.removeItem('github_diplomatie_state');
  }

  // Vérifier si connecté
  isAuthenticated() {
    return !!this.accessToken;
  }

  // Obtenir les informations du repository
  async getRepositoryInfo() {
    if (!this.octokit) return null;
    
    try {
      const { data } = await this.octokit.repos.get({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des infos repository:', error);
      return null;
    }
  }
}

export default new GitHubDiplomatieService(); 