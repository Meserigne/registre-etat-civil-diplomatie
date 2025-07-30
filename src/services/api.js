const API_BASE_URL = 'http://localhost:3001';

// Fonctions génériques pour les appels API
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Retourner un tableau vide pour les GET requests en cas d'erreur
    if (options.method === 'GET' || !options.method) {
      return [];
    }
    throw error;
  }
};

// Fonctions pour les dossiers
export const dossiersAPI = {
  getAll: () => apiCall('/dossiers'),
  getById: (id) => apiCall(`/dossiers/${id}`),
  create: (dossier) => apiCall('/dossiers', {
    method: 'POST',
    body: JSON.stringify(dossier)
  }),
  update: (id, dossier) => apiCall(`/dossiers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dossier)
  }),
  delete: (id) => apiCall(`/dossiers/${id}`, {
    method: 'DELETE'
  })
};

// Fonctions pour les modifications
export const modificationsAPI = {
  getAll: () => apiCall('/modifications'),
  create: (modification) => apiCall('/modifications', {
    method: 'POST',
    body: JSON.stringify(modification)
  }),
  getByDossierId: (dossierId) => apiCall(`/modifications?dossierId=${dossierId}`)
};

// Fonctions pour les agents
export const agentsAPI = {
  getAll: () => apiCall('/agents'),
  create: (agent) => apiCall('/agents', {
    method: 'POST',
    body: JSON.stringify(agent)
  }),
  update: (id, agent) => apiCall(`/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(agent)
  }),
  delete: (id) => apiCall(`/agents/${id}`, {
    method: 'DELETE'
  })
};

// Fonctions pour les utilisateurs
export const utilisateursAPI = {
  getAll: () => apiCall('/utilisateurs'),
  getById: (id) => apiCall(`/utilisateurs/${id}`),
  create: (utilisateur) => apiCall('/utilisateurs', {
    method: 'POST',
    body: JSON.stringify(utilisateur)
  }),
  update: (id, utilisateur) => apiCall(`/utilisateurs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(utilisateur)
  }),
  delete: (id) => apiCall(`/utilisateurs/${id}`, {
    method: 'DELETE'
  }),
  login: (username, password) => apiCall(`/utilisateurs?username=${username}&password=${password}`)
};

// Fonctions pour les actes
export const actesAPI = {
  getAll: () => apiCall('/actes'),
  getById: (id) => apiCall(`/actes/${id}`),
  create: (acte) => apiCall('/actes', {
    method: 'POST',
    body: JSON.stringify(acte)
  }),
  update: (id, acte) => apiCall(`/actes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(acte)
  }),
  delete: (id) => apiCall(`/actes/${id}`, {
    method: 'DELETE'
  })
}; 