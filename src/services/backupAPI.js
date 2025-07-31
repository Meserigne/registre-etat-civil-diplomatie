// Service pour gérer les sauvegardes via l'API
const API_BASE_URL = 'http://localhost:3001';

export const backupAPI = {
  // Créer une sauvegarde complète
  async creerBackupComplet() {
    try {
      const response = await fetch(`${API_BASE_URL}/backup-complet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la sauvegarde complète');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur backup complet:', error);
      throw error;
    }
  },

  // Créer une sauvegarde simple
  async creerSauvegardeSimple() {
    try {
      const response = await fetch(`${API_BASE_URL}/sauvegarde`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la sauvegarde simple');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur sauvegarde simple:', error);
      throw error;
    }
  },

  // Lister les sauvegardes disponibles
  async listerSauvegardes() {
    try {
      const response = await fetch(`${API_BASE_URL}/sauvegardes`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des sauvegardes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur liste sauvegardes:', error);
      throw error;
    }
  },

  // Restaurer une sauvegarde
  async restaurerSauvegarde(nomSauvegarde) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomSauvegarde }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la restauration');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur restauration:', error);
      throw error;
    }
  }
}; 