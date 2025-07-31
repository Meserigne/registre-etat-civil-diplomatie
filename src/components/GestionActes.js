import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Copy, Edit, Trash2, Plus, Search, Filter, 
  Eye, CheckCircle, AlertTriangle, X, Calendar, User, Clock, MapPin, 
  FileCheck, FileX, FilePlus, BarChart3, Settings, RefreshCw, Filter as FilterIcon
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FormulaireActeOriginal from './FormulaireActeOriginal';
import CreationActes from './CreationActes';

const GestionActes = ({ dossiers, onClose }) => {
  const [actes, setActes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOriginalForm, setShowOriginalForm] = useState(false);
  const [showCreationActe, setShowCreationActe] = useState(false);
  const [showDossierSelection, setShowDossierSelection] = useState(false);
  const [editingActe, setEditingActe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedActe, setSelectedActe] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfPreviewData, setPdfPreviewData] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'cards'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'type'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' ou 'desc'
  
  const [acteData, setActeData] = useState({
    typeActe: '',
    numeroActe: '',
    dateCreation: new Date().toISOString().split('T')[0],
    heureNaissance: '',
    lieuCreation: 'ABIDJAN',
    circonscriptionConsulaire: '',
    centreDe: '',
    officier: '',
    observations: '',
    nomPere: '',
    lieuNaissancePere: '',
    professionPere: '',
    nomMere: '',
    lieuNaissanceMere: '',
    professionMere: ''
  });

  const typesActes = [
    'Extrait acte Naissance',
    'Extrait acte Décès', 
    'Extrait acte Mariage',
    'Copie intégrale Mariage',
    'Copie intégrale Naissance',
    'Copie intégrale Décès',
    'Livret de famille',
    'Acte Consulaire (Nouveau Format)',
    'Rectification',
    'Transcription'
  ];

  const statusOptions = [
    'Tous les statuts',
    'En cours',
    'Terminé',
    'En attente',
    'Prêt pour création d\'acte',
    'Acte créé'
  ];

  // Fonction pour obtenir les couleurs des statuts
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Terminé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Prêt pour création d\'acte': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Acte créé': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      case 'En attente': return <AlertTriangle className="w-4 h-4" />;
      case 'Prêt pour création d\'acte': return <FileCheck className="w-4 h-4" />;
      case 'Acte créé': return <FilePlus className="w-4 h-4" />;
      default: return <FileX className="w-4 h-4" />;
    }
  };

  // Fonction pour vérifier si un dossier peut créer un acte
  const canCreateActe = (statut) => {
    return statut === 'Prêt pour création d\'acte';
  };

  // Charger les actes au démarrage
  useEffect(() => {
    const savedActes = JSON.parse(localStorage.getItem('registreActes') || '[]');
    setActes(savedActes);
  }, []);

  // Statistiques des actes
  const getStats = () => {
    const totalActes = actes.length;
    const actesConsulaires = actes.filter(a => a.typeActe === 'Acte Consulaire (Nouveau Format)').length;
    const actesOriginaux = actes.filter(a => a.typeActe !== 'Acte Consulaire (Nouveau Format)').length;
    const dossiersEligibles = dossiers.filter(d => canCreateActe(d.statut)).length;
    
    return { totalActes, actesConsulaires, actesOriginaux, dossiersEligibles };
  };

  const generateNumeroActe = (type) => {
    const currentYear = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    switch (type) {
      case 'Extrait acte Naissance':
        return `NAIS-${currentYear}-${random}`;
      case 'Extrait acte Décès':
        return `DEC-${currentYear}-${random}`;
      case 'Extrait acte Mariage':
        return `MAR-${currentYear}-${random}`;
      case 'Copie intégrale Mariage':
        return `CIM-${currentYear}-${random}`;
      case 'Copie intégrale Naissance':
        return `CIN-${currentYear}-${random}`;
      case 'Copie intégrale Décès':
        return `CID-${currentYear}-${random}`;
      case 'Livret de famille':
        return `LF-${currentYear}-${random}`;
      case 'Acte Consulaire (Nouveau Format)':
        return `65-001-COP/86`;
      case 'Rectification':
        return `RECT-${currentYear}-${random}`;
      case 'Transcription':
        return `TRANS-${currentYear}-${random}`;
      default:
        return `ACTE-${currentYear}-${random}`;
    }
  };

  const handleTypeChange = (type) => {
    setActeData({
      ...acteData,
      typeActe: type,
      numeroActe: generateNumeroActe(type)
    });
  };

  const resetForm = () => {
    setActeData({
      typeActe: '',
      numeroActe: '',
      dateCreation: new Date().toISOString().split('T')[0],
      heureNaissance: '',
      lieuCreation: 'ABIDJAN',
      circonscriptionConsulaire: '',
      centreDe: '',
      officier: '',
      observations: '',
      nomPere: '',
      lieuNaissancePere: '',
      professionPere: '',
      nomMere: '',
      lieuNaissanceMere: '',
      professionMere: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDossier || !acteData.typeActe || !acteData.officier) {
      if (window.showNotification) {
        window.showNotification('Veuillez remplir tous les champs obligatoires', 'warning');
      } else {
        alert('Veuillez remplir tous les champs obligatoires');
      }
      return;
    }

    // Vérifier le statut du dossier
    if (selectedDossier.statut !== 'Prêt pour création d\'acte') {
      const message = `Impossible de créer un acte. Le dossier doit avoir le statut "Prêt pour création d'acte".\nStatut actuel: ${selectedDossier.statut}\n\nVeuillez modifier le statut du dossier dans l'onglet "Statuts".`;
      if (window.showNotification) {
        window.showNotification(message, 'error');
      } else {
        alert(message);
      }
      return;
    }

    // Générer une observation automatique selon le type d'acte
    let autoObservation = '';
    const observationOptions = {
      'Acte Consulaire (Nouveau Format)': [
        'Acte consulaire créé selon le nouveau format officiel.',
        'Acte consulaire généré avec le format diplomatique.',
        'Acte consulaire validé selon les normes internationales.',
        'Acte consulaire officiel créé pour la diplomatie.'
      ],
      'Extrait acte Naissance': [
        'Extrait d\'acte de naissance généré automatiquement.',
        'Extrait de naissance créé et validé.',
        'Extrait d\'acte de naissance disponible.',
        'Extrait de naissance généré avec succès.'
      ],
      'Copie intégrale Naissance': [
        'Copie intégrale d\'acte de naissance générée automatiquement.',
        'Copie intégrale de naissance créée et validée.',
        'Copie intégrale d\'acte de naissance disponible.',
        'Copie intégrale de naissance générée avec succès.'
      ],
      'Extrait acte Mariage': [
        'Extrait d\'acte de mariage généré automatiquement.',
        'Extrait de mariage créé et validé.',
        'Extrait d\'acte de mariage disponible.',
        'Extrait de mariage généré avec succès.'
      ],
      'Copie intégrale Mariage': [
        'Copie intégrale d\'acte de mariage générée automatiquement.',
        'Copie intégrale de mariage créée et validée.',
        'Copie intégrale d\'acte de mariage disponible.',
        'Copie intégrale de mariage générée avec succès.'
      ],
      'Extrait acte Décès': [
        'Extrait d\'acte de décès généré automatiquement.',
        'Extrait de décès créé et validé.',
        'Extrait d\'acte de décès disponible.',
        'Extrait de décès généré avec succès.'
      ],
      'Copie intégrale Décès': [
        'Copie intégrale d\'acte de décès générée automatiquement.',
        'Copie intégrale de décès créée et validée.',
        'Copie intégrale d\'acte de décès disponible.',
        'Copie intégrale de décès générée avec succès.'
      ],
      'Livret de famille': [
        'Livret de famille généré automatiquement.',
        'Livret de famille créé et validé.',
        'Livret de famille disponible.',
        'Livret de famille généré avec succès.'
      ],
      'Rectification': [
        'Rectification d\'acte générée automatiquement.',
        'Rectification créée et validée.',
        'Rectification d\'acte disponible.',
        'Rectification générée avec succès.'
      ],
      'Transcription': [
        'Transcription d\'acte générée automatiquement.',
        'Transcription créée et validée.',
        'Transcription d\'acte disponible.',
        'Transcription générée avec succès.'
      ]
    };
    
    const options = observationOptions[acteData.typeActe] || [`Acte de type "${acteData.typeActe}" créé automatiquement.`];
    const randomIndex = Math.floor(Math.random() * options.length);
    autoObservation = options[randomIndex];

    const newActe = {
      id: Date.now(),
      dossierId: selectedDossier.id,
      dossierInfo: selectedDossier,
      ...acteData,
      observations: autoObservation,
      dateCreationActe: new Date().toISOString(),
      statut: 'Créé'
    };

    const updatedActes = [...actes, newActe];
    setActes(updatedActes);
    localStorage.setItem('registreActes', JSON.stringify(updatedActes));
    
    // Mettre à jour le statut du dossier
    const updatedDossiers = dossiers.map(d => 
      d.id === selectedDossier.id ? { 
        ...d, 
        statut: 'Acte créé',
        observations: autoObservation
      } : d
    );
    localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
    
    setShowForm(false);
    setSelectedDossier(null);
    resetForm();
    
    if (window.showNotification) {
      window.showNotification(`Acte "${acteData.typeActe}" créé avec succès !`, 'success');
    } else {
      alert(`Acte créé avec succès !\n\nObservation automatique: ${autoObservation}`);
    }
  };

  const handleEdit = (acte) => {
    setEditingActe(acte);
    setActeData({
      typeActe: acte.typeActe,
      numeroActe: acte.numeroActe,
      dateCreation: acte.dateCreation,
      heureNaissance: acte.heureNaissance || '',
      lieuCreation: acte.lieuCreation,
      circonscriptionConsulaire: acte.circonscriptionConsulaire || '',
      centreDe: acte.centreDe || '',
      officier: acte.officier,
      observations: acte.observations,
      nomPere: acte.nomPere || '',
      lieuNaissancePere: acte.lieuNaissancePere || '',
      professionPere: acte.professionPere || '',
      nomMere: acte.nomMere || '',
      lieuNaissanceMere: acte.lieuNaissanceMere || '',
      professionMere: acte.professionMere || ''
    });
    setSelectedDossier(acte.dossierInfo);
    setShowForm(true);
  };

  const handleDelete = (acteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet acte ?')) {
      const updatedActes = actes.filter(a => a.id !== acteId);
      setActes(updatedActes);
      localStorage.setItem('registreActes', JSON.stringify(updatedActes));
      
      if (window.showNotification) {
        window.showNotification('Acte supprimé avec succès !', 'success');
      } else {
        alert('Acte supprimé avec succès !');
      }
    }
  };

  // Fonction pour trier les actes
  const sortActes = (actesToSort) => {
    return actesToSort.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.dateCreation);
          bValue = new Date(b.dateCreation);
          break;
        case 'name':
          aValue = `${a.dossierInfo?.nomUsager || ''} ${a.dossierInfo?.prenomUsager || ''}`.toLowerCase();
          bValue = `${b.dossierInfo?.nomUsager || ''} ${b.dossierInfo?.prenomUsager || ''}`.toLowerCase();
          break;
        case 'type':
          aValue = a.typeActe.toLowerCase();
          bValue = b.typeActe.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Filtrer et trier les actes
  const filteredAndSortedActes = sortActes(
    actes.filter(acte => {
      const matchesSearch = !searchTerm || 
        (acte.dossierInfo?.nomUsager && acte.dossierInfo.nomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (acte.dossierInfo?.prenomUsager && acte.dossierInfo.prenomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (acte.numeroActe && acte.numeroActe.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = !filterType || acte.typeActe === filterType;
      const matchesStatus = !filterStatus || filterStatus === 'Tous les statuts' || acte.dossierInfo?.statut === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
  );

  const stats = getStats();

  const generateActeHTML = (acte) => {
    const dossier = acte.dossierInfo || {};
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const getCurrentTime = () => {
      return new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const currentYear = new Date().getFullYear();

    if (acte.typeActe === 'Acte Consulaire (Nouveau Format)') {
      return generateActeConsulaireHTML(acte, dossier, formatDate, getCurrentTime, currentYear);
    }

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Extrait d'Acte de Naissance - ${(dossier.nomUsager || '').toUpperCase()} ${(dossier.prenomUsager || '').toUpperCase()}</title>
          <style>
              @page {
                  size: A4 portrait;
                  margin: 1.5cm;
              }
              
              @media print {
                  body { 
                      margin: 0;
                      font-size: 11pt;
                      line-height: 1.4;
                  }
                  .no-print { display: none; }
                  .document-container {
                      padding: 0;
                      box-shadow: none;
                      border: none;
                  }
              }
              
              body {
                  font-family: 'Times New Roman', serif;
                  max-width: 21cm;
                  margin: 0 auto;
                  padding: 1.5cm;
                  background: white;
                  color: black;
                  line-height: 1.4;
                  font-size: 11pt;
                  min-height: 29.7cm;
                  padding-bottom: 5cm; /* Ajout de 3cm d'espace en bas (2cm + 3cm) */
              }
              
              .document-container {
                  background: white;
                  padding: 1.5cm;
                  padding-top: 0.5cm;
                  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  border: 1px solid #e0e0e0;
                  margin-bottom: 5cm; /* Ajout de 3cm d'espace en bas (2cm + 3cm) */
              }
              
              .header {
                  text-align: left;
                  margin-bottom: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
                  font-weight: bold;
                  text-transform: uppercase;
                  font-size: 12pt;
                  padding-left: 0cm;
                  margin-top: 2cm; /* Réduction significative de 5cm à 2cm */
              }
              
              .separator {
                  text-align: left;
                  margin: 0.1cm 0;
                  font-weight: bold;
                  letter-spacing: 2px;
                  padding-left: 0cm;
              }
              
              .reference {
                  text-align: left;
                  margin: 0.25cm 0;
                  font-weight: bold;
                  font-size: 11pt;
                  padding-left: 0cm;
              }
              
              .title-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin: 0.3cm 0 0.25cm 0;
                  padding: 0 0cm;
              }
              
              .title {
                  text-align: left;
                  font-size: 13pt;
                  font-weight: bold;
                  text-decoration: underline;
                  flex: 1;
              }
              
              .name-section {
                  text-align: left;
                  font-size: 14pt;
                  font-weight: bold;
                  margin: 0.25cm 0;
                  line-height: 1.4;
                  letter-spacing: 1px;
                  padding-left: 0cm;
              }
              
              .subtitle {
                  text-align: right;
                  font-weight: bold;
                  font-size: 11pt;
                  letter-spacing: 0.5px;
                  flex: 1;
                  margin-left: 1cm;
                  margin-top: -15cm;
              }
              
              .content {
                  margin: -8cm 0 0.3cm 0; /* Décalage de 5cm vers le haut (-3cm à -8cm) */
                  text-align: left;
                  font-size: 11pt;
                  padding: 0 2cm 0 9cm;
              }
              
              .content-line {
                  margin: 0.4cm 0;
                  line-height: 1.8;
                  text-align: left;
                  padding-left: 1cm;
                  display: flex;
                  justify-content: space-between;
                  align-items: baseline;
              }
              
              .mentions {
                  margin-top: 0.8cm; /* Réduction de 1.5cm à 0.8cm */
                  margin-bottom: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
                  font-size: 11pt;
                  text-align: left;
                  padding-left: 2cm;
              }
              
              .mentions-title {
                  font-weight: bold;
                  margin-bottom: 0.3cm;
                  text-align: left;
                  color: red;
                  padding-left: 4cm;
              }
              
              .mention-line {
                  margin: 0.3cm 0;
                  line-height: 1.8;
                  text-align: left;
                  margin-left: -2cm;
              }
              
              .certification {
                  margin-top: 0.2cm; /* Réduction de 0.3cm à 0.2cm */
                  text-align: right;
                  font-size: 11pt;
                  padding: 0 2cm;
              }
              
              .certification-text {
                  margin-bottom: 0.4cm; /* Réduction de 0.8cm à 0.4cm */
                  line-height: 1.6;
              }
              
              .certification-location {
                  margin-bottom: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
                  font-weight: bold;
              }
              
              .signature-section {
                  margin-top: -0.3cm; /* Réduction de l'espace négatif de -0.7cm à -0.3cm */
                  text-align: right;
                  font-size: 11pt;
                  padding-right: 2cm;
              }
              
              .timbre-section {
                  margin-top: -0.5cm; /* Réduction de l'espace négatif de -1cm à -0.5cm */
                  text-align: left;
                  font-weight: bold;
                  font-size: 11pt;
                  padding-left: 2cm;
                  margin-bottom: 0.3cm; /* Réduction de l'espace en bas de 0.5cm à 0.3cm */
              }
              
              .highlight-info {
                  font-weight: bold;
                  text-decoration: none;
                  display: inline-block;
                  margin: 0 2px;
              }
              
              .document-container {
                  animation: fadeInUp 0.8s ease-out;
              }
              
              @keyframes fadeInUp {
                  from {
                      opacity: 0;
                      transform: translateY(30px);
                  }
                  to {
                      opacity: 1;
                      transform: translateY(0);
                  }
              }
              
              .dotted-fill {
                  border-bottom: 1px dotted #ccc;
                  display: inline-block;
                  min-width: 120px;
                  margin: 0 5px;
              }
          </style>
      </head>
      <body>
          <div class="document-container">
              <div class="header">
                  CIRCONSCRIPTION CONSULAIRE<br>
                  DE ${acte.circonscriptionConsulaire || 'DANEMARK'}
                  <div class="separator">-------------</div>
                  CENTRE DE ${acte.centreDe || 'COPENHAGUE'}
                  <div class="separator">------------</div>
              </div>
              
              <div class="reference">
                  N° ${acte.numeroActe || '65-001-COP/86'} du ${formatDate(acte.dateCreation)}
                  <div class="separator">-------------</div>
              </div>
              
              <div class="title-row">
                  <div class="title">
                      NAISSANCE DE
                  </div>
                  <div class="subtitle">
                      Pour l'année <span class="highlight-info">${currentYear}</span>
                  </div>
              </div>
              
              <div class="name-section">
                  <span class="highlight-info">${dossier.prenomUsager} ${dossier.nomUsager}</span>
              </div>
              
              <div class="content">
                  <div class="content-line">
                      <span>Le <span class="highlight-info">${formatDate(acte.dateCreation)}</span></span>
                      <span>…..................................................</span>
                  </div>
                  
                  <div class="content-line">
                      <span>À <span class="highlight-info">${acte.heureNaissance || getCurrentTime()}</span> heures</span>
                      <span>…..................................................</span>
                  </div>
                  
                  <div class="content-line">
                      <span>Est né(e) à <span class="highlight-info">${dossier.lieuNaissance}</span></span>
                      <span>…..................................................</span>
                  </div>
                  
                  <div class="content-line">
                      <span>L'enfant <span class="highlight-info">${dossier.prenomUsager} ${dossier.nomUsager}</span></span>
                      <span>…..................................................</span>
                  </div>
                  
                  <div class="content-line">
                      <span>De sexe <span class="highlight-info">${dossier.sexe || 'Non spécifié'}</span></span>
                      <span>…..................................................</span>
                  </div>
                  
                  <div class="content-line">
                      <span>Fils/Fille de <span class="highlight-info">${acte.nomPere || '[Nom du père]'}</span>, <span class="highlight-info">${acte.professionPere || '[Profession]'}</span></span>
                      <span>…..................................................</span>
                  </div>
                  
                  <div class="content-line">
                      <span>Et de <span class="highlight-info">${acte.nomMere || '[Nom de la mère]'}</span>, <span class="highlight-info">${acte.professionMere || '[Profession]'}</span>, son épouse</span>
                      <span>…..................................................</span>
                  </div>
              </div>
              
              <div class="mentions">
                  <div class="mentions-title">MENTIONS (Éventuellement)</div>
                  
                  <div class="mention-line">
                      Marié(e) le : <span class="dotted-fill">………………………………</span>à…………N.<span class="dotted-fill">…………………………………………………</span>
                  </div>
                  
                  <div class="mention-line">
                      Avec : .<span class="dotted-fill">………………………………..…..……………………</span>E<span class="dotted-fill">……………………….……..…………..……..</span>
                  </div>
                  
                  <div class="mention-line">
                      Mariage dissous par décision de divorce en date du <span class="dotted-fill">......………</span>A..<span class="dotted-fill">……………………………...….……</span>
                  </div>
                  
                  <div class="mention-line">
                      <span class="dotted-fill">………………………………………………………………………………</span>N<span class="dotted-fill">………………………………………</span>
                  </div>
                  
                  <div class="mention-line">
                      Décédé(e) le <span class="dotted-fill">……………………………………………</span> à <span class="dotted-fill">………………………</span>T.<span class="dotted-fill">………………..…….………</span>
                  </div>
              </div>
              
              <div class="certification">
                  <div class="certification-text">
                      Certifie le présent extrait conforme aux indications<br>
                      contenues dans le registre.
                  </div>
                  
                  <div class="certification-location">
                      Délivré à <span class="highlight-info">Abidjan</span>, le <span class="highlight-info">${formatDate(acte.dateCreation)}</span>
                  </div>
              </div>
              
              <div style="height: 0.5cm;"></div> <!-- Réduction de l'espace avant signature -->
              
              <div class="signature-section">
                  L'Officier de l'État Civil<br>
                  (Signature)<br>
              </div>
              
              <div class="timbre-section">
                  <strong>TIMBRE FISCAL</strong><br>
                  <strong>SCEAU</strong>
              </div>
          </div>
      </body>
      </html>
    `;
  };

  const generateActeConsulaireHTML = (acte, dossier, formatDate, getCurrentTime, currentYear) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Acte Consulaire - ${dossier.prenomUsager} ${dossier.nomUsager}</title>
          <style>
              @page {
                  size: A4 portrait;
                  margin: 1.5cm;
              }
              
              @media print {
                  body { 
                      margin: 0;
                      font-size: 11pt;
                      line-height: 1.4;
                  }
                  .no-print { display: none; }
                  .document-container {
                      padding: 0;
                      box-shadow: none;
                      border: none;
                  }
              }
              
              body {
                  font-family: 'Times New Roman', serif;
                  max-width: 21cm;
                  margin: 0 auto;
                  padding: 1.5cm;
                  background: white;
                  color: black;
                  line-height: 1.4;
                  font-size: 11pt;
                  min-height: 29.7cm;
                  padding-bottom: 5cm; /* Ajout de 3cm d'espace en bas (2cm + 3cm) */
              }
              
              .document-container {
                  background: white;
                  padding: 1.5cm;
                  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  border: 1px solid #e0e0e0;
                  margin-bottom: 5cm; /* Ajout de 3cm d'espace en bas (2cm + 3cm) */
              }
              
              .header {
                  text-align: center;
                  margin-bottom: 0.5cm; /* Réduction de 1cm à 0.5cm */
                  border-bottom: 2px solid #1a365d;
                  padding-bottom: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
              }
              
              .header-title {
                  font-size: 16pt;
                  font-weight: bold;
                  color: #1a365d;
                  margin-bottom: 0.3cm;
                  text-transform: uppercase;
              }
              
              .header-subtitle {
                  font-size: 12pt;
                  color: #2d3748;
                  margin-bottom: 0.2cm;
              }
              
              .header-address {
                  font-size: 10pt;
                  color: #4a5568;
                  font-style: italic;
              }
              
              .document-number {
                  text-align: right;
                  margin: 0.5cm 0;
                  font-weight: bold;
                  font-size: 11pt;
                  color: #2d3748;
              }
              
              .main-title {
                  text-align: center;
                  font-size: 14pt;
                  font-weight: bold;
                  margin: 0.5cm 0; /* Réduction de 1cm à 0.5cm */
                  text-decoration: underline;
                  color: #1a365d;
              }
              
              .person-name {
                  text-align: center;
                  font-size: 16pt;
                  font-weight: bold;
                  margin: 0.3cm 0; /* Réduction de 0.5cm à 0.3cm */
                  color: #1a365d;
                  letter-spacing: 1px;
              }
              
              .content-section {
                  margin: 0.5cm 0; /* Réduction de 1cm à 0.5cm */
                  padding: 0 1cm;
              }
              
              .content-line {
                  margin: 0.4cm 0;
                  line-height: 1.8;
                  text-align: justify;
                  font-size: 11pt;
              }
              
              .highlight {
                  font-weight: bold;
                  color: #1a365d;
              }
              
              .fill-space {
                  border-bottom: 1px dotted #cbd5e0;
                  display: inline-block;
                  min-width: 150px;
                  margin: 0 5px;
              }
              
              .mentions-section {
                  margin-top: 0.8cm; /* Réduction de 1.5cm à 0.8cm */
                  padding: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
                  border: 1px solid #e2e8f0;
                  border-radius: 4px;
                  background-color: #f7fafc;
              }
              
              .mentions-title {
                  font-weight: bold;
                  color: #e53e3e;
                  margin-bottom: 0.3cm;
                  font-size: 11pt;
              }
              
              .mention-line {
                  margin: 0.3cm 0;
                  line-height: 1.6;
                  font-size: 10pt;
                  color: #4a5568;
              }
              
              .certification-section {
                  margin-top: 0.5cm; /* Réduction de 1cm à 0.5cm */
                  text-align: right;
                  padding: 0 1cm;
              }
              
              .certification-text {
                  margin-bottom: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
                  line-height: 1.6;
                  font-size: 11pt;
              }
              
              .certification-location {
                  margin-bottom: 0.3cm;
                  font-weight: bold;
                  color: #2d3748;
              }
              
              .signature-section {
                  margin-top: 0.5cm; /* Réduction de 1cm à 0.5cm */
                  text-align: right;
                  padding-right: 2cm;
              }
              
              .signature-line {
                  margin-bottom: 0.3cm; /* Réduction de 0.5cm à 0.3cm */
                  font-size: 11pt;
              }
              
              .stamp-section {
                  position: absolute;
                  bottom: 0.5cm; /* Réduction de l'espace en bas de 1cm à 0.5cm */
                  left: 2cm;
                  text-align: center;
                  margin-bottom: 0.5cm; /* Réduction de l'espace en bas de 1cm à 0.5cm */
              }
              
              .stamp-box {
                  border: 2px solid #1a365d;
                  padding: 0.5cm;
                  display: inline-block;
                  font-weight: bold;
                  font-size: 10pt;
                  color: #1a365d;
              }
              
              .watermark {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 48pt;
                  color: rgba(26, 54, 93, 0.1);
                  font-weight: bold;
                  pointer-events: none;
                  z-index: -1;
              }
          </style>
      </head>
      <body>
          <div class="document-container">
              <div class="watermark">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
              
              <div class="header">
                  <div class="header-title">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
                  <div class="header-subtitle">MINISTÈRE DES AFFAIRES ÉTRANGÈRES</div>
                  <div class="header-subtitle">CIRCONSCRIPTION CONSULAIRE DE ${acte.circonscriptionConsulaire || 'DANEMARK'}</div>
                  <div class="header-address">Centre de ${acte.centreDe || 'COPENHAGUE'}</div>
              </div>
              
              <div class="document-number">
                  N° ${acte.numeroRegistre || acte.numeroActe || '65-001-COP/86'} du ${formatDate(acte.dateCreation)}
              </div>
              
              <div class="main-title">
                  ACTE DE NAISSANCE
              </div>
              
              <div class="person-name">
                  ${dossier.prenomUsager} ${dossier.nomUsager}
              </div>
              
              <div class="content-section">
                  <div class="content-line">
                      Le <span class="highlight">${formatDate(dossier.dateNaissance)}</span> à <span class="fill-space">${acte.heureNaissance || '14h55'}</span>
                  </div>
                  
                  <div class="content-line">
                      Est né(e) à <span class="highlight">Copenhague, DANEMARK</span>
                  </div>
                  
                  <div class="content-line">
                      L'enfant <span class="highlight">${dossier.prenomUsager} ${dossier.nomUsager}</span>
                  </div>
                  
                  <div class="content-line">
                      De sexe <span class="fill-space">${dossier.sexe || 'féminin'}</span>
                  </div>
                  
                  <div class="content-line">
                      Fille de <span class="highlight">${acte.nomPere || 'N\'Dri Julien KOFFI'}</span>, 
                      <span class="fill-space">${acte.professionPere || 'Attaché Financier'}</span>
                  </div>
                  
                  <div class="content-line">
                      Et de <span class="highlight">${acte.nomMere || 'Fouzia RHRISSI'}</span>, 
                      <span class="fill-space">${acte.professionMere || 'Secrétaire'}</span>, son épouse
                  </div>
                  
                  <div class="content-line">
                      Domicilié(e) à <span class="fill-space">Copenhague, Danemark</span>
                  </div>
              </div>
              
              <div class="mentions-section">
                  <div class="mentions-title">MENTIONS MARGINALES (Éventuellement)</div>
                  
                  <div class="mention-line">
                      • Marié(e) le : <span class="fill-space"></span> à <span class="fill-space"></span>
                  </div>
                  
                  <div class="mention-line">
                      • Mariage dissous par divorce le : <span class="fill-space"></span>
                  </div>
                  
                  <div class="mention-line">
                      • Décédé(e) le : <span class="fill-space"></span> à <span class="fill-space"></span>
                  </div>
                  
                  <div class="mention-line">
                      • Rectification : <span class="fill-space"></span>
                  </div>
              </div>
              
              <div class="certification-section">
                  <div class="certification-text">
                      Certifie le présent extrait conforme aux indications<br>
                      contenues dans le registre de l'état civil.
                  </div>
                  
                  <div class="certification-location">
                      Délivré à <span class="highlight">Copenhague</span>, le <span class="highlight">${formatDate(acte.dateCreation)}</span>
                  </div>
              </div>
              
              <div style="height: 1cm;"></div> <!-- Réduction de l'espace -->
              
              <div class="signature-section">
                  <div class="signature-line">L'Officier de l'État Civil</div>
                  <div class="signature-line">Consulat de Côte d'Ivoire</div>
                  <div class="signature-line">à Copenhague</div>
                  <br><br>
                  <div class="signature-line">(Signature et cachet)</div>
              </div>
              
              <div class="stamp-section">
                  <div class="stamp-box">
                      TIMBRE FISCAL<br>
                      SCEAU OFFICIEL
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
  };

  const generatePDFPreview = async (acte) => {
    try {
      const acteHTML = generateActeHTML(acte);
      
      // Créer un élément temporaire avec les dimensions A4
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = acteHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // Largeur A4
      tempDiv.style.height = '297mm'; // Hauteur A4
      tempDiv.style.margin = '0';
      tempDiv.style.padding = '0';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);
      
      // Configuration optimisée pour A4
      const canvas = await html2canvas(tempDiv, {
        scale: 1, // Qualité réduite pour la prévisualisation
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // Largeur A4 en pixels (210mm)
        height: 1123, // Hauteur A4 en pixels (297mm)
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123
      });
      
      const imgData = canvas.toDataURL('image/png', 0.8);
      
      // Calculer les dimensions A4
      const a4Width = 210; // mm
      const a4Height = 297; // mm
      const aspectRatio = a4Height / a4Width; // 1.414 (√2)
      
      setPdfPreviewData({
        imgData,
        dimensions: {
          width: a4Width,
          height: a4Height,
          aspectRatio
        },
        acte: acte
      });
      
      setShowPDFPreview(true);
      
    } catch (error) {
      console.error('Erreur lors de la génération de la prévisualisation:', error);
      if (window.showNotification) {
        window.showNotification('Erreur lors de la génération de la prévisualisation', 'error');
      }
    } finally {
      // Nettoyer l'élément temporaire
      const tempDiv = document.querySelector('div[style*="-9999px"]');
      if (tempDiv) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  const generateActePDF = async (acte) => {
    try {
      const acteHTML = generateActeHTML(acte);
      
      // Créer un élément temporaire avec les dimensions A4
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = acteHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // Largeur A4
      tempDiv.style.height = '297mm'; // Hauteur A4
      tempDiv.style.margin = '0';
      tempDiv.style.padding = '0';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);
      
      // Configuration optimisée pour A4
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Qualité élevée
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // Largeur A4 en pixels (210mm)
        height: 1123, // Hauteur A4 en pixels (297mm)
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123
      });
      
      // Créer le PDF en format A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Dimensions A4 standard
      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm
      
      // Calculer les proportions pour s'adapter parfaitement à A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ajouter l'image au PDF en format A4
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Nom du fichier
      const dossier = acte.dossierInfo;
      const fileName = `${acte.typeActe.replace(/\s+/g, '-')}-${dossier.nomUsager}-${dossier.prenomUsager}.pdf`;
      
      // Sauvegarder le PDF
      pdf.save(fileName);
      
      // Notification de succès
      if (window.showNotification) {
        window.showNotification('PDF généré avec succès en format A4 !', 'success');
      }
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      if (window.showNotification) {
        window.showNotification('Erreur lors de la génération du PDF', 'error');
      } else {
        alert('Erreur lors de la génération du PDF');
      }
    } finally {
      // Nettoyer l'élément temporaire
      const tempDiv = document.querySelector('div[style*="-9999px"]');
      if (tempDiv) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  const printActe = async (acte) => {
    try {
      const acteHTML = generateActeHTML(acte);
      const newWindow = window.open('', '_blank');
      newWindow.document.write(acteHTML);
      newWindow.document.close();
      
      setTimeout(() => {
        newWindow.print();
      }, 500);
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      alert('Erreur lors de l\'impression');
    }
  };

  const duplicateActe = (acte) => {
    const newActe = {
      ...acte,
      id: Date.now(),
      numeroActe: generateNumeroActe(acte.typeActe),
      dateCreationActe: new Date().toISOString()
    };
    
    const updatedActes = [...actes, newActe];
    setActes(updatedActes);
    localStorage.setItem('registreActes', JSON.stringify(updatedActes));
    alert('Acte dupliqué avec succès !');
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Actes</h2>
            <p className="text-gray-600">Créez et gérez les actes d'état civil avec facilité</p>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Actes</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalActes}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consulaires</p>
                  <p className="text-2xl font-bold text-green-600">{stats.actesConsulaires}</p>
                </div>
                <FileCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Originaux</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.actesOriginaux}</p>
                </div>
                <FilePlus className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Éligibles</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.dossiersEligibles}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions principales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDossierSelection(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={dossiers.filter(d => canCreateActe(d.statut)).length === 0}
            >
              <Plus className="w-5 h-5" />
              Acte Consulaire (Nouveau Format)
            </button>
            
            <button
              onClick={() => setShowOriginalForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
              disabled={dossiers.filter(d => canCreateActe(d.statut)).length === 0}
            >
              <FileText className="w-5 h-5" />
              Acte Original (Format Classique)
            </button>
          </div>
          
          {/* Indicateur des dossiers éligibles */}
          <div className="flex items-center gap-3">
            {dossiers.filter(d => canCreateActe(d.statut)).length > 0 ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">
                  {dossiers.filter(d => canCreateActe(d.statut)).length} dossier(s) éligible(s)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-800">
                  Aucun dossier éligible
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres améliorés */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, numéro d'acte..."
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtre par type */}
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none bg-white transition-all duration-200"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tous les types</option>
              {typesActes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Filtre par statut */}
          <div className="relative">
            <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full appearance-none bg-white transition-all duration-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          {/* Tri */}
          <div className="flex gap-2">
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="name">Nom</option>
              <option value="type">Type</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              title={`Trier par ordre ${sortOrder === 'asc' ? 'décroissant' : 'croissant'}`}
            >
              <RefreshCw className={`w-5 h-5 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Mode d'affichage */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Mode d'affichage:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tableau
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cartes
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredAndSortedActes.length} acte(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Liste des actes */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">N° Acte</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usager</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Officier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedActes.map(acte => (
                  <tr key={acte.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{acte.numeroActe}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {acte.dossierInfo?.nomUsager} {acte.dossierInfo?.prenomUsager}
                          </div>
                          <div className="text-xs text-gray-500">
                            {acte.dossierInfo?.numeroSuivi}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-900">{acte.typeActe}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(acte.dossierInfo?.statut || 'En cours')}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(acte.dossierInfo?.statut || 'En cours')}`}>
                          {acte.dossierInfo?.statut || 'En cours'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(acte.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{acte.officier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedActe(acte)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          title="Voir l'acte"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateActePDF(acte)}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-lg transition-all duration-200"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => printActe(acte)}
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition-all duration-200"
                          title="Imprimer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(acte)}
                          className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-100 rounded-lg transition-all duration-200"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateActe(acte)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(acte.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedActes.length === 0 && (
            <div className="text-center py-12">
              <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun acte trouvé</h3>
              <p className="text-gray-500">Aucun acte ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      ) : (
        // Vue en cartes
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedActes.map(acte => (
            <div key={acte.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(acte.dossierInfo?.statut || 'En cours')}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(acte.dossierInfo?.statut || 'En cours')}`}>
                      {acte.dossierInfo?.statut || 'En cours'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(acte.dateCreation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {acte.dossierInfo?.nomUsager} {acte.dossierInfo?.prenomUsager}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{acte.numeroActe}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="w-4 h-4 mr-1" />
                    {acte.typeActe}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Officier: {acte.officier}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {acte.lieuCreation}
                  </div>
                </div>
                
                {acte.observations && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">{acte.observations}</p>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedActe(acte)}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    title="Voir l'acte"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => generateActePDF(acte)}
                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-lg transition-all duration-200"
                    title="Télécharger PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => printActe(acte)}
                    className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition-all duration-200"
                    title="Imprimer"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(acte)}
                    className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-100 rounded-lg transition-all duration-200"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateActe(acte)}
                    className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(acte.id)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all duration-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAndSortedActes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun acte trouvé</h3>
              <p className="text-gray-500">Aucun acte ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de création/édition d'acte */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingActe ? 'Modifier l\'Acte' : 'Nouvel Acte'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingActe(null);
                  setSelectedDossier(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Message d'aide sur les exigences de statut */}
              {selectedDossier && (
                <div className={`mb-4 p-4 rounded-lg border ${
                  selectedDossier.statut === 'Prêt pour création d\'acte' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      selectedDossier.statut === 'Prêt pour création d\'acte' 
                        ? 'bg-green-500' 
                        : 'bg-orange-500'
                    }`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Statut du dossier sélectionné: {selectedDossier.statut}
                      </h4>
                      {selectedDossier.statut === 'Prêt pour création d\'acte' ? (
                        <p className="text-sm text-green-700 mt-1">
                          ✅ Ce dossier peut être utilisé pour créer un acte. L'observation sera générée automatiquement.
                        </p>
                      ) : (
                        <p className="text-sm text-orange-700 mt-1">
                          ⚠️ Ce dossier ne peut pas être utilisé pour créer un acte. 
                          Le statut doit être "Prêt pour création d'acte". 
                          Veuillez modifier le statut dans l'onglet "Statuts".
                        </p>
                      )}
                      
                      {/* Affichage des observations du dossier */}
                      {selectedDossier.observations && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <h5 className="text-sm font-medium text-blue-900 mb-2">Observations du dossier:</h5>
                          <div className="space-y-2">
                            {selectedDossier.observations && (
                              <div className="text-sm">
                                <span className="font-medium text-blue-800">Automatique:</span>
                                <span className="text-blue-700 ml-2">{selectedDossier.observations}</span>
                              </div>
                            )}
                            {selectedDossier.observationPersonnalisee && (
                              <div className="text-sm">
                                <span className="font-medium text-blue-800">Personnalisée:</span>
                                <span className="text-blue-700 ml-2">{selectedDossier.observationPersonnalisee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sélection du dossier */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Sélection du Dossier</h4>
                  <select
                    value={selectedDossier?.id || ''}
                    onChange={(e) => {
                      const dossier = dossiers.find(d => d.id === parseInt(e.target.value));
                      setSelectedDossier(dossier);
                      if (dossier) {
                        handleTypeChange(dossier.demandes?.[0]?.typeDossier || 'Extrait acte Naissance');
                      }
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un dossier</option>
                    {dossiers.filter(d => d.statut !== 'Acte créé').map(dossier => (
                      <option key={dossier.id} value={dossier.id}>
                        {dossier.numeroSuivi} - {dossier.nomUsager} {dossier.prenomUsager}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Informations de l'acte */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informations de l'Acte</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type d'acte</label>
                      <select
                        value={acteData.typeActe}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        {typesActes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Numéro d'acte</label>
                      <input
                        type="text"
                        value={acteData.numeroActe}
                        onChange={(e) => setActeData({...acteData, numeroActe: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de création</label>
                      <input
                        type="date"
                        value={acteData.dateCreation}
                        onChange={(e) => setActeData({...acteData, dateCreation: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Heure de naissance</label>
                      <input
                        type="time"
                        value={acteData.heureNaissance}
                        onChange={(e) => setActeData({...acteData, heureNaissance: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="HH:MM"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lieu de création</label>
                      <input
                        type="text"
                        value={acteData.lieuCreation}
                        onChange={(e) => setActeData({...acteData, lieuCreation: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Circonscription consulaire de</label>
                      <input
                        type="text"
                        value={acteData.circonscriptionConsulaire}
                        onChange={(e) => setActeData({...acteData, circonscriptionConsulaire: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: ABIDJAN"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Centre de</label>
                      <input
                        type="text"
                        value={acteData.centreDe}
                        onChange={(e) => setActeData({...acteData, centreDe: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: CONSULAT GÉNÉRAL DE CÔTE D'IVOIRE"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Officier d'état civil</label>
                      <input
                        type="text"
                        value={acteData.officier}
                        onChange={(e) => setActeData({...acteData, officier: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations des parents */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Informations des Parents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Père */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Père</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Nom</label>
                        <input
                          type="text"
                          value={acteData.nomPere}
                          onChange={(e) => setActeData({...acteData, nomPere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Date de naissance</label>
                        <input
                          type="date"
                          value={acteData.dateNaissancePere}
                          onChange={(e) => setActeData({...acteData, dateNaissancePere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Lieu de naissance</label>
                        <input
                          type="text"
                          value={acteData.lieuNaissancePere}
                          onChange={(e) => setActeData({...acteData, lieuNaissancePere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Profession</label>
                        <input
                          type="text"
                          value={acteData.professionPere}
                          onChange={(e) => setActeData({...acteData, professionPere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Adresse</label>
                        <input
                          type="text"
                          value={acteData.adressePere}
                          onChange={(e) => setActeData({...acteData, adressePere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mère */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Mère</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Nom</label>
                        <input
                          type="text"
                          value={acteData.nomMere}
                          onChange={(e) => setActeData({...acteData, nomMere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Date de naissance</label>
                        <input
                          type="date"
                          value={acteData.dateNaissanceMere}
                          onChange={(e) => setActeData({...acteData, dateNaissanceMere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Lieu de naissance</label>
                        <input
                          type="text"
                          value={acteData.lieuNaissanceMere}
                          onChange={(e) => setActeData({...acteData, lieuNaissanceMere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Profession</label>
                        <input
                          type="text"
                          value={acteData.professionMere}
                          onChange={(e) => setActeData({...acteData, professionMere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Adresse</label>
                        <input
                          type="text"
                          value={acteData.adresseMere}
                          onChange={(e) => setActeData({...acteData, adresseMere: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Observations</label>
                <textarea
                  value={acteData.observations}
                  onChange={(e) => setActeData({...acteData, observations: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingActe(null);
                    setSelectedDossier(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingActe ? 'Modifier' : 'Créer'} l'acte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation améliorée */}
      {selectedActe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] flex flex-col">
            {/* En-tête avec actions flottantes */}
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Prévisualisation - {selectedActe.typeActe}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{selectedActe.numeroActe}</span>
                </div>
              </div>
              
              {/* Actions principales dans l'en-tête */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generatePDFPreview(selectedActe)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                  title="Prévisualiser le PDF"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Prévisualiser PDF</span>
                </button>
                
                <button
                  onClick={() => generateActePDF(selectedActe)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                  title="Télécharger le PDF"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Télécharger PDF</span>
                </button>
                
                <button
                  onClick={() => printActe(selectedActe)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all duration-200 transform hover:scale-105"
                  title="Imprimer l'acte"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>
                
                <button
                  onClick={() => setSelectedActe(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Informations de l'acte */}
            <div className="px-6 py-3 bg-gray-50 border-b">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span><strong>Usager:</strong> {selectedActe.dossierInfo?.nomUsager} {selectedActe.dossierInfo?.prenomUsager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span><strong>Date:</strong> {new Date(selectedActe.dateCreation).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span><strong>Lieu:</strong> {selectedActe.lieuCreation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span><strong>Officier:</strong> {selectedActe.officier}</span>
                </div>
              </div>
            </div>
            
            {/* Contenu de l'acte avec scroll */}
            <div className="flex-1 overflow-y-auto p-6">
              <div 
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{ __html: generateActeHTML(selectedActe) }} 
                onError={() => {
                  if (window.showNotification) {
                    window.showNotification('Erreur lors de l\'affichage de l\'acte', 'error');
                  }
                }}
              />
            </div>
            
            {/* Barre d'actions flottante en bas (optionnelle) */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Actions rapides:</span> Utilisez les boutons en haut à droite pour télécharger ou imprimer
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => generateActePDF(selectedActe)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  PDF
                </button>
                <button
                  onClick={() => printActe(selectedActe)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'acte original */}
      {showOriginalForm && selectedDossier && (
        <FormulaireActeOriginal
          dossier={selectedDossier}
          onClose={() => {
            setShowOriginalForm(false);
            setSelectedDossier(null);
          }}
        />
      )}

      {/* Sélection de dossier pour formulaire original */}
      {showOriginalForm && !selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner un Dossier</h3>
            <p className="text-gray-600 mb-4">Choisissez le dossier pour lequel créer l'acte original :</p>
            <select
              onChange={(e) => {
                const dossierId = e.target.value;
                const dossier = dossiers.find(d => d.id === parseInt(dossierId));
                setSelectedDossier(dossier);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">Sélectionner un dossier</option>
              {dossiers.filter(d => d.statut !== 'Acte créé').map(dossier => (
                <option key={dossier.id} value={dossier.id}>
                  {dossier.numeroSuivi} - {dossier.nomUsager} {dossier.prenomUsager}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowOriginalForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sélection de dossiers éligibles */}
      {showDossierSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Sélectionner un Dossier Éligible</h3>
              <p className="text-gray-600 mt-1">Choisissez un dossier avec le statut "Terminé" ou "Prêt pour création d'acte"</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid gap-4">
                {dossiers.filter(d => canCreateActe(d.statut)).map(dossier => (
                  <div key={dossier.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                       onClick={() => {
                         setSelectedDossier(dossier);
                         setShowDossierSelection(false);
                         setShowCreationActe(true);
                       }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {dossier.nomUsager} {dossier.prenomUsager}
                          </h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(dossier.statut)}`}>
                            {dossier.statut}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">N° Suivi:</span> {dossier.numeroSuivi}
                          </div>
                          <div>
                            <span className="font-medium">Date de naissance:</span> {new Date(dossier.dateNaissance).toLocaleDateString('fr-FR')}
                          </div>
                          <div>
                            <span className="font-medium">Lieu de naissance:</span> {dossier.lieuNaissance}
                          </div>
                          <div>
                            <span className="font-medium">Sexe:</span> {dossier.sexe || 'Non spécifié'}
                          </div>
                          <div>
                            <span className="font-medium">Type de demande:</span> {dossier.demandes?.map(d => d.typeDossier).join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Date de dépôt:</span> {new Date(dossier.dateDepot).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Sélectionner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {dossiers.filter(d => canCreateActe(d.statut)).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Aucun dossier éligible</p>
                    <p className="text-sm">Les dossiers doivent avoir le statut "Terminé" ou "Prêt pour création d'acte"</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowDossierSelection(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation PDF */}
      {showPDFPreview && pdfPreviewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] flex flex-col">
            {/* En-tête */}
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Prévisualisation PDF - {pdfPreviewData.acte.typeActe}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>Format A4 (210×297mm)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generateActePDF(pdfPreviewData.acte)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 shadow-lg transition-all duration-200"
                  title="Télécharger le PDF"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Télécharger PDF</span>
                </button>
                
                <button
                  onClick={() => setShowPDFPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Informations du PDF */}
            <div className="px-6 py-3 bg-gray-50 border-b">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span><strong>Usager:</strong> {pdfPreviewData.acte.dossierInfo?.nomUsager} {pdfPreviewData.acte.dossierInfo?.prenomUsager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span><strong>Date:</strong> {new Date(pdfPreviewData.acte.dateCreation).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span><strong>Lieu:</strong> {pdfPreviewData.acte.lieuCreation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span><strong>Officier:</strong> {pdfPreviewData.acte.officier}</span>
                </div>
              </div>
            </div>
            
            {/* Prévisualisation du PDF */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex justify-center">
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Format A4 - Prévisualisation</h4>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <span>Largeur: {pdfPreviewData.dimensions.width}mm</span>
                      <span>Hauteur: {pdfPreviewData.dimensions.height}mm</span>
                      <span>Ratio: 1:{pdfPreviewData.dimensions.aspectRatio.toFixed(3)}</span>
                    </div>
                  </div>
                  
                  {/* Image du PDF avec dimensions A4 */}
                  <div className="flex justify-center">
                    <div 
                      className="border border-gray-400 rounded shadow-lg overflow-hidden"
                      style={{
                        width: '400px', // Taille fixe pour la prévisualisation
                        height: `${400 * pdfPreviewData.dimensions.aspectRatio}px`,
                        maxHeight: '600px'
                      }}
                    >
                      <img 
                        src={pdfPreviewData.imgData} 
                        alt="Prévisualisation PDF"
                        className="w-full h-full object-contain"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Informations techniques */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Informations techniques du PDF :</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      <div><strong>Format:</strong> A4 Portrait</div>
                      <div><strong>Dimensions:</strong> 210×297mm</div>
                      <div><strong>Résolution:</strong> Haute qualité</div>
                      <div><strong>Compression:</strong> Optimisée</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Barre d'actions */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Prévisualisation:</span> Le PDF sera généré exactement comme affiché ci-dessus
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => generateActePDF(pdfPreviewData.acte)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </button>
                <button
                  onClick={() => printActe(pdfPreviewData.acte)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composant CreationActes */}
      {showCreationActe && selectedDossier && (
        <CreationActes
          dossier={selectedDossier}
          onClose={() => {
            setShowCreationActe(false);
            setSelectedDossier(null);
          }}
        />
      )}
    </div>
  );
};

export default GestionActes;