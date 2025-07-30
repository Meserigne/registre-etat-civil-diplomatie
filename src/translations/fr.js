export const fr = {
  // Navigation et menus
  nav: {
    title: 'Registre d\'État Civil',
    subtitle: 'Ministère des Affaires Étrangères - Diplomatie Ivoirienne',
    dashboard: 'Tableau de bord',
    dossiers: 'Dossiers',
    actes: 'Actes',
    agents: 'Agents',
    users: 'Utilisateurs',
    statistics: 'Statistiques',
    settings: 'Paramètres',
    logout: 'Déconnexion'
  },

  // Boutons et actions
  buttons: {
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    print: 'Imprimer',
    download: 'Télécharger',
    view: 'Voir',
    select: 'Sélectionner',
    create: 'Créer',
    update: 'Mettre à jour',
    submit: 'Soumettre',
    reset: 'Réinitialiser'
  },

  // Formulaires
  forms: {
    // Informations usager
    userInfo: 'Informations de l\'Usager',
    lastName: 'Nom',
    firstName: 'Prénom',
    birthDate: 'Date de naissance',
    birthPlace: 'Lieu de naissance',
    nationality: 'Nationalité',
    gender: 'Sexe',
    male: 'Masculin',
    female: 'Féminin',
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'Email',
    
    // Informations dossier
    fileInfo: 'Informations du Dossier',
    fileType: 'Type de dossier',
    fileNumber: 'Numéro de dossier',
    trackingNumber: 'Numéro de suivi',
    depositDate: 'Date de dépôt',
    withdrawalDate: 'Date de retrait',
    status: 'Statut',
    agent: 'Agent',
    observations: 'Observations',
    
    // Validation
    required: 'Ce champ est obligatoire',
    invalidEmail: 'Email invalide',
    invalidPhone: 'Numéro de téléphone invalide'
  },

  // Statuts
  status: {
    inProgress: 'En cours',
    completed: 'Terminé',
    pending: 'En attente',
    readyForActe: 'Prêt pour création d\'acte',
    acteCreated: 'Acte créé',
    cancelled: 'Annulé'
  },

  // Types de dossiers
  fileTypes: {
    birth: 'Naissance',
    death: 'Décès',
    marriage: 'Mariage',
    divorce: 'Divorce',
    adoption: 'Adoption',
    recognition: 'Reconnaissance',
    legitimation: 'Légitimation',
    correction: 'Rectification',
    transcription: 'Transcription'
  },

  // Types d'actes
  acteTypes: {
    birthExtract: 'Extrait acte Naissance',
    deathExtract: 'Extrait acte Décès',
    marriageExtract: 'Extrait acte Mariage',
    marriageCopy: 'Copie intégrale Mariage',
    birthCopy: 'Copie intégrale Naissance',
    deathCopy: 'Copie intégrale Décès',
    familyBook: 'Livret de famille',
    correction: 'Rectification',
    transcription: 'Transcription'
  },

  // Gestion des actes
  actes: {
    title: 'Gestion des Actes',
    newConsularActe: 'Acte Consulaire (Nouveau Format)',
    originalActe: 'Acte Original (Format Classique)',
    selectEligibleFile: 'Sélectionner un Dossier Éligible',
    eligibleFilesIndicator: 'dossier(s) éligible(s) pour création d\'acte',
    noEligibleFiles: 'Aucun dossier éligible (statut doit être "Terminé" ou "Prêt pour création d\'acte")',
    acteNumber: 'N° Acte',
    user: 'Usager',
    type: 'Type',
    fileStatus: 'Statut Dossier',
    date: 'Date',
    officer: 'Officier',
    actions: 'Actions',
    preview: 'Prévisualisation',
    downloadPDF: 'Télécharger PDF',
    
    // Création d'acte
    createActe: 'Créer un Acte',
    acteCreation: 'Création d\'Acte',
    acteInfo: 'Informations de l\'Acte',
    creationDate: 'Date de création',
    creationPlace: 'Lieu de création',
    officer: 'Officier',
    parentsInfo: 'Informations des Parents',
    fatherName: 'Nom du père',
    fatherBirthDate: 'Date de naissance du père',
    fatherBirthPlace: 'Lieu de naissance du père',
    fatherProfession: 'Profession du père',
    fatherAddress: 'Adresse du père',
    motherName: 'Nom de la mère',
    motherBirthDate: 'Date de naissance de la mère',
    motherBirthPlace: 'Lieu de naissance de la mère',
    motherProfession: 'Profession de la mère',
    motherAddress: 'Adresse de la mère'
  },

  // Messages
  messages: {
    success: {
      fileCreated: 'Dossier créé avec succès !',
      fileUpdated: 'Dossier mis à jour avec succès !',
      fileDeleted: 'Dossier supprimé avec succès !',
      acteCreated: 'Acte créé avec succès !',
      acteUpdated: 'Acte mis à jour avec succès !',
      settingsSaved: 'Paramètres sauvegardés avec succès !'
    },
    error: {
      requiredFields: 'Veuillez remplir tous les champs obligatoires',
      fileNotFound: 'Dossier non trouvé',
      acteNotFound: 'Acte non trouvé',
      noFileSelected: 'Aucun dossier sélectionné',
      serverError: 'Erreur serveur, veuillez réessayer',
      unauthorized: 'Accès non autorisé'
    },
    confirm: {
      deleteFile: 'Êtes-vous sûr de vouloir supprimer ce dossier ?',
      deleteActe: 'Êtes-vous sûr de vouloir supprimer cet acte ?',
      logout: 'Êtes-vous sûr de vouloir vous déconnecter ?'
    }
  },

  // Acte de naissance (document officiel)
  birthCertificate: {
    title: 'Document Officiel - Extrait d\'Acte de Naissance',
    consularCircumscription: 'CIRCONSCRIPTION CONSULAIRE',
    denmark: 'DE DANEMARK',
    copenhagenCenter: 'CENTRE DE COPENHAGUE',
    registry: 'du Registre',
    civilRegistry: 'Du Registre des Actes de l\'État Civil',
    forYear: 'Pour l\'année',
    birthOf: 'NAISSANCE DE :',
    bornOn: 'Le',
    at: 'À',
    minutes: 'minutes',
    bornIn: 'Est né(e) à',
    child: 'L\'enfant',
    gender: 'De sexe',
    daughterOf: 'Fille de',
    sonOf: 'Fils de',
    financialAttache: 'Attaché Financier',
    secretary: 'Secrétaire',
    spouse: 'son épouse',
    mentions: 'MENTIONS (Éventuellement)',
    marriedOn: 'Marié(e) le',
    with: 'Avec',
    marriageDissolvedBy: 'Mariage dissous par décision de divorce en date du',
    deceasedOn: 'Décédé(e) le',
    certifyExtract: 'Certifie le présent extrait conforme aux indications',
    containedInRegistry: 'contenues dans le registre.',
    deliveredIn: 'Délivré à',
    civilStatusOfficer: 'L\'Officier de l\'État Civil',
    signature: '(Signature)',
    fiscalStamp: 'TIMBRE FISCAL',
    seal: 'SCEAU',
    printDocument: 'Imprimer le document',
    downloadPDF: 'Télécharger PDF'
  },

  // Paramètres de langue
  language: {
    title: 'Langue',
    french: 'Français',
    english: 'English',
    switchTo: 'Passer à',
    currentLanguage: 'Langue actuelle'
  }
};

export default fr;
