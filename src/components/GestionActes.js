import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Copy, Edit, Trash2, Plus, Search, Filter, Eye, CheckCircle, AlertTriangle, X } from 'lucide-react';
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
  const [selectedActe, setSelectedActe] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
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
    // Informations des parents
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
    'Acte Consulaire (Nouveau Format)', // <-- Ajouté
    'Rectification',
    'Transcription'
  ];

  // Fonction pour obtenir les couleurs des statuts
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Prêt pour création d\'acte': return 'bg-purple-100 text-purple-800';
      case 'Acte créé': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
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
        return `65-001-COP/86`; // Format spécifique pour l'acte consulaire
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
      observations: autoObservation, // Observation automatique
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
        observations: autoObservation // Mettre à jour l'observation du dossier
      } : d
    );
    localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
    
    setShowForm(false);
    setSelectedDossier(null);
    resetForm();
    
    // Notification de succès
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
      
      // Notification de succès
      if (window.showNotification) {
        window.showNotification('Acte supprimé avec succès !', 'success');
      } else {
        alert('Acte supprimé avec succès !');
      }
    }
  };

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

    // Obtenir l'année actuelle pour l'en-tête
    const currentYear = new Date().getFullYear();

    // Si c'est un acte consulaire, utiliser le format spécial
    if (acte.typeActe === 'Acte Consulaire (Nouveau Format)') {
      return generateActeConsulaireHTML(acte, dossier, formatDate, getCurrentTime, currentYear);
    }

    // Format standard pour les autres types d'actes
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
                  padding-bottom: 20cm; /* Ajout de la marge de 20cm en bas */
              }
              
              .document-container {
                  background: white;
                  padding: 1.5cm;
                  padding-top: 0.5cm; /* Réduction de la marge supérieure de 5cm */
                  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  border: 1px solid #e0e0e0;
                  margin-bottom: 20cm; /* Marge supplémentaire pour le conteneur */
              }
              
              .header {
                  text-align: left;
                  margin-bottom: 0.5cm;
                  font-weight: bold;
                  text-transform: uppercase;
                  font-size: 12pt;
                  padding-left: 0cm;
                  margin-top: 3cm;
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
                  margin: -9cm 0 0.4cm 0;
                  text-align: left;
                  font-size: 11pt;
                  padding: 0 2cm 0 9cm;
              }
              
              .content-line {
                  margin: 0.4cm 0;
                  line-height: 1.8;
                  text-align: left;
                  padding-left: 1cm;
              }
              
              .mentions {
                  margin-top: 3cm;
                  margin-bottom: 0.8cm;
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
                  margin-top: 0.5cm;
                  text-align: right;
                  font-size: 11pt;
                  padding: 0 2cm;
              }
              
              .certification-text {
                  margin-bottom: 0.8cm;
                  line-height: 1.6;
              }
              
              .certification-location {
                  margin-bottom: 0.5cm;
                  font-weight: bold;
              }
              
              .signature-section {
                  margin-top: -0.7cm;
                  text-align: right;
                  font-size: 11pt;
                  padding-right: 2cm;
              }
              
              .timbre-section {
                  margin-top: -4.7cm;
                  text-align: left;
                  font-weight: bold;
                  font-size: 11pt;
                  padding-left: 2cm;
                  margin-bottom: 5cm; /* Ajout de la marge de 5cm en bas */
              }
              

              
              /* Informations importantes */
              .highlight-info {
                  font-weight: bold;
                  text-decoration: none;
                  display: inline-block;
                  margin: 0 2px;
              }
              
              /* Animation d'apparition */
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
                  N° ${acte.numeroActe || '65-001-COP/86'} du ${formatDate(acte.dateCreation)}<br>
                  du Registre
                  <div class="separator">-------------</div>
              </div>
              
              <div class="title-row">
                  <div class="title">
                      NAISSANCE DE
                  </div>
                  <div class="subtitle">
                      Du Registre des Actes de l'État Civil<br>
                      Pour l'année <span class="highlight-info">${currentYear}</span>
                  </div>
              </div>
              
              <div class="name-section">
                  <span class="highlight-info">${dossier.prenomUsager} ${dossier.nomUsager}</span>
              </div>
              
              <div class="content">
                  <div class="content-line">
                      Le <span class="highlight-info">${formatDate(acte.dateCreation)}</span>…..................................................
                  </div>
                  
                  <div class="content-line">
                      À <span class="highlight-info">${acte.heureNaissance || getCurrentTime()}</span> heures…..................................................
                  </div>
                  
                  <div class="content-line">
                      Est né(e) à <span class="highlight-info">${dossier.lieuNaissance}</span>…..................................................
                  </div>
                  
                  <div class="content-line">
                      L'enfant <span class="highlight-info">${dossier.prenomUsager} ${dossier.nomUsager}</span>…..................................................
                  </div>
                  
                  <div class="content-line">
                      De sexe <span class="highlight-info">${dossier.sexe || 'Non spécifié'}</span>…..................................................
                  </div>
                  
                  <div class="content-line">
                      Fils/Fille de <span class="highlight-info">${acte.nomPere || '[Nom du père]'}</span>, <span class="highlight-info">${acte.professionPere || '[Profession]'}</span>…..................................................
                  </div>
                  
                  <div class="content-line">
                      Et de <span class="highlight-info">${acte.nomMere || '[Nom de la mère]'}</span>, <span class="highlight-info">${acte.professionMere || '[Profession]'}</span>, son épouse…..................................................
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
              
              <!-- Décalage de 3cm en bas de la certification -->
              <div style="height: 3cm;"></div>
              
              <div class="signature-section">
                  L'Officier de l'État Civil<br><br><br>
                  (Signature)<br><br><br>
              </div>
              
              <div class="timbre-section">
                  <strong>TIMBRE FISCAL</strong><br><br>
                  <strong>SCEAU</strong>
              </div>
          </div>

          <script>
              function downloadAsPDF() {
                  // Simulation du téléchargement PDF
                  alert('📥 Fonctionnalité de téléchargement PDF\n\n' +
                        'Pour télécharger ce document en PDF :\n' +
                        '1. Utilisez Ctrl+P (ou Cmd+P sur Mac)\n' +
                        '2. Sélectionnez "Enregistrer au format PDF"\n' +
                        '3. Choisissez votre dossier de destination\n\n' +
                        'Le document sera sauvegardé avec la mise en page officielle.');
              }
              
              // Animation d'entrée retardée pour les éléments
              document.addEventListener('DOMContentLoaded', function() {
                  const highlights = document.querySelectorAll('.highlight-info');
                  highlights.forEach((element, index) => {
                      setTimeout(() => {
                          element.style.animation = \`fadeInUp 0.5s ease-out \${index * 0.1}s both\`;
                      }, 500);
                  });
              });
              
              // Effet de survol sur le document
              const documentContainer = document.querySelector('.document-container');
              documentContainer.addEventListener('mouseenter', function() {
                  this.style.transform = 'scale(1.02)';
                  this.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              });
              
              documentContainer.addEventListener('mouseleave', function() {
                  this.style.transform = 'scale(1)';
                  this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
              });
          </script>
      </body>
      </html>
    `;
  };

  // Nouvelle fonction pour générer l'acte consulaire selon le format spécifié
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
                  padding-bottom: 25cm; /* Ajout de la marge de 25cm en bas (20cm + 5cm) */
              }
              
              .document-container {
                  background: white;
                  padding: 1.5cm;
                  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  border: 1px solid #e0e0e0;
                  margin-bottom: 25cm; /* Marge supplémentaire pour le conteneur (20cm + 5cm) */
              }
              
              .header {
                  text-align: center;
                  margin-bottom: 1cm;
                  border-bottom: 2px solid #1a365d;
                  padding-bottom: 0.5cm;
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
                  margin: 1cm 0;
                  text-decoration: underline;
                  color: #1a365d;
              }
              
              .person-name {
                  text-align: center;
                  font-size: 16pt;
                  font-weight: bold;
                  margin: 0.5cm 0;
                  color: #1a365d;
                  letter-spacing: 1px;
              }
              
              .content-section {
                  margin: 1cm 0;
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
                  margin-top: 1.5cm;
                  padding: 0.5cm;
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
                  margin-top: 2cm;
                  text-align: right;
                  padding: 0 1cm;
              }
              
              .certification-text {
                  margin-bottom: 0.5cm;
                  line-height: 1.6;
                  font-size: 11pt;
              }
              
              .certification-location {
                  margin-bottom: 0.3cm;
                  font-weight: bold;
                  color: #2d3748;
              }
              
              .signature-section {
                  margin-top: 1cm;
                  text-align: right;
                  padding-right: 2cm;
              }
              
              .signature-line {
                  margin-bottom: 0.5cm;
                  font-size: 11pt;
              }
              
              .stamp-section {
                  position: absolute;
                  bottom: 3cm;
                  left: 2cm;
                  text-align: center;
                  margin-bottom: 5cm; /* Ajout de la marge de 5cm en bas */
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
                  <div class="header-subtitle">CIRCONSCRIPTION CONSULAIRE DE DANEMARK</div>
                  <div class="header-address">Centre de Copenhague</div>
              </div>
              
              <div class="document-number">
                  N° ${acte.numeroActe || '65-001-COP/86'} du ${formatDate(acte.dateCreation)}
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
              
              <!-- Décalage de 3cm en bas de la certification -->
              <div style="height: 3cm;"></div>
              
              <div class="signature-section">
                  <div class="signature-line">L'Officier de l'État Civil</div>
                  <div class="signature-line">Consulat de Côte d'Ivoire</div>
                  <div class="signature-line">à Copenhague</div>
                  <br><br><br>
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

  const generateActePDF = async (acte) => {
    try {
      const acteHTML = generateActeHTML(acte);
      
      // Créer un élément temporaire pour le HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = acteHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);
      
      // Convertir HTML en canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 794,
        height: 1123
      });
      
      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculer les dimensions pour A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ajouter l'image au PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Sauvegarder le PDF
      const dossier = acte.dossierInfo;
      pdf.save(`${acte.typeActe.replace(/\s+/g, '-')}-${dossier.nomUsager}-${dossier.prenomUsager}.pdf`);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
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

  const filteredActes = actes.filter(acte => {
    const matchesSearch = !searchTerm || 
      (acte.dossierInfo?.nomUsager && acte.dossierInfo.nomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (acte.dossierInfo?.prenomUsager && acte.dossierInfo.prenomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (acte.numeroActe && acte.numeroActe.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filterType || acte.typeActe === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6" style={{ marginTop: '-10cm' }}>
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Actes</h2>
          <p className="text-gray-600">Créez et gérez les actes d'état civil</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDossierSelection(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            disabled={dossiers.filter(d => canCreateActe(d.statut)).length === 0}
          >
            <Plus className="w-4 h-4" />
            Acte Consulaire (Nouveau Format)
          </button>
          <button
            onClick={() => setShowOriginalForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={dossiers.filter(d => canCreateActe(d.statut)).length === 0}
          >
            <FileText className="w-4 h-4" />
            Acte Original (Format Classique)
          </button>
        </div>
        
        {/* Indicateur des dossiers éligibles */}
        <div className="text-sm text-gray-600">
          {dossiers.filter(d => canCreateActe(d.statut)).length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{dossiers.filter(d => canCreateActe(d.statut)).length} dossier(s) éligible(s) pour création d'acte</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Aucun dossier éligible (statut doit être "Terminé" ou "Prêt pour création d'acte")</span>
            </div>
          )}
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, numéro d'acte..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Tous les types</option>
            {typesActes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des actes */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Acte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut Dossier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActes.map(acte => (
                <tr key={acte.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {acte.numeroActe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {acte.dossierInfo?.nomUsager} {acte.dossierInfo?.prenomUsager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {acte.typeActe}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(acte.dossierInfo?.statut || 'En cours')}`}>
                      {acte.dossierInfo?.statut || 'En cours'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(acte.dateCreation).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {acte.officier}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <div className="space-y-1">
                      {acte.observations && (
                        <div className="text-xs">
                          <span className="font-medium text-blue-600">Auto:</span>
                          <span className="ml-1">{acte.observations}</span>
                        </div>
                      )}
                      {acte.dossierInfo?.observationPersonnalisee && (
                        <div className="text-xs">
                          <span className="font-medium text-green-600">Perso:</span>
                          <span className="ml-1">{acte.dossierInfo.observationPersonnalisee}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedActe(acte)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir l'acte"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generateActePDF(acte)}
                        className="text-green-600 hover:text-green-900"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printActe(acte)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Imprimer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(acte)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateActe(acte)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(acte.id)}
                        className="text-red-600 hover:text-red-900"
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
      </div>

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
                <AlertTriangle className="w-6 h-6" />
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

      {/* Modal de prévisualisation */}
      {selectedActe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Prévisualisation - {selectedActe.typeActe}
              </h3>
              <button
                onClick={() => setSelectedActe(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div 
                dangerouslySetInnerHTML={{ __html: generateActeHTML(selectedActe) }} 
                onError={() => {
                  if (window.showNotification) {
                    window.showNotification('Erreur lors de l\'affichage de l\'acte', 'error');
                  }
                }}
              />
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => generateActePDF(selectedActe)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger PDF
              </button>
              <button
                onClick={() => printActe(selectedActe)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dossier.statut)}`}>
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