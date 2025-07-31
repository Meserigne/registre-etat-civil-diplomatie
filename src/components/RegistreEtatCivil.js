import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Download, FileText, Settings, Upload,
  User, BarChart3, Calendar, PieChart, CheckCircle, Clock, Eye, AlertTriangle,
  Copy, Printer, X, Save
} from 'lucide-react';
import { LogoHeader } from './LogoMinistere';
import GestionAgents from './GestionAgents';
import GestionUtilisateurs from './GestionUtilisateurs';
import GestionActes from './GestionActes';
import CreationActes from './CreationActes';
import CompteAgent from './CompteAgent';
import LoginAgent from './LoginAgent';
import InterfaceAgent from './InterfaceAgent';
import Statistiques from './Statistiques';
import SauvegardeAutomatique from './SauvegardeAutomatique';
import GestionSauvegarde from './GestionSauvegarde';

import { dossiersAPI, modificationsAPI } from '../services/api';

const RegistreEtatCivil = ({ currentUser, onLogout, activeTab, setActiveTab }) => {
  // États principaux
  const [dossiers, setDossiers] = useState([]);
  const [modifications, setModifications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDossier, setEditingDossier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showCreationActe, setShowCreationActe] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showManualAssignModal, setShowManualAssignModal] = useState(false);
  const [showLoginAgent, setShowLoginAgent] = useState(false);
  const [showCompteAgent, setShowCompteAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [currentAgentSession, setCurrentAgentSession] = useState(null);
  const [showObservationsModal, setShowObservationsModal] = useState(false);
  const [selectedDossierForObservations, setSelectedDossierForObservations] = useState(null);

  // États du formulaire
  const [formData, setFormData] = useState({
    numeroRegistre: '',
    nomUsager: '',
    prenomUsager: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: '',
    adresse: '',
    telephone: '',
    email: '',
    typeDossier: 'Naissance',
    demandes: [{ typeDossier: 'Naissance', cout: 5000 }],
    dateDepot: new Date().toISOString().split('T')[0],
    dateRetrait: '',
    statut: 'En cours',
    agentId: '',
    observations: ''
  });

  // Types de dossiers disponibles
  const typesDossier = [
    'Naissance', 'Décès', 'Mariage', 'Divorce', 'Adoption', 
    'Reconnaissance', 'Légitimation', 'Rectification', 'Transcription'
  ];

  // Prix par type de dossier
  const prixParType = {
    'Naissance': 5000,
    'Décès': 3000,
    'Mariage': 8000,
    'Divorce': 10000,
    'Adoption': 15000,
    'Reconnaissance': 6000,
    'Légitimation': 7000,
    'Rectification': 4000,
    'Transcription': 3500
  };

  // Liste complète des pays avec Côte d'Ivoire mise en évidence
  const paysListe = [
    { code: 'CI', nom: '🇨🇮 Côte d\'Ivoire', region: 'Afrique de l\'Ouest' },
    { code: 'AF', nom: 'Afghanistan', region: 'Asie' },
    { code: 'ZA', nom: 'Afrique du Sud', region: 'Afrique' },
    { code: 'AL', nom: 'Albanie', region: 'Europe' },
    { code: 'DZ', nom: 'Algérie', region: 'Afrique' },
    { code: 'DE', nom: 'Allemagne', region: 'Europe' },
    { code: 'AD', nom: 'Andorre', region: 'Europe' },
    { code: 'AO', nom: 'Angola', region: 'Afrique' },
    { code: 'AI', nom: 'Anguilla', region: 'Amérique' },
    { code: 'AQ', nom: 'Antarctique', region: 'Antarctique' },
    { code: 'AG', nom: 'Antigua-et-Barbuda', region: 'Amérique' },
    { code: 'SA', nom: 'Arabie Saoudite', region: 'Asie' },
    { code: 'AR', nom: 'Argentine', region: 'Amérique' },
    { code: 'AM', nom: 'Arménie', region: 'Asie' },
    { code: 'AW', nom: 'Aruba', region: 'Amérique' },
    { code: 'AU', nom: 'Australie', region: 'Océanie' },
    { code: 'AT', nom: 'Autriche', region: 'Europe' },
    { code: 'AZ', nom: 'Azerbaïdjan', region: 'Asie' },
    { code: 'BS', nom: 'Bahamas', region: 'Amérique' },
    { code: 'BH', nom: 'Bahreïn', region: 'Asie' },
    { code: 'BD', nom: 'Bangladesh', region: 'Asie' },
    { code: 'BB', nom: 'Barbade', region: 'Amérique' },
    { code: 'BE', nom: 'Belgique', region: 'Europe' },
    { code: 'BZ', nom: 'Belize', region: 'Amérique' },
    { code: 'BJ', nom: 'Bénin', region: 'Afrique' },
    { code: 'BM', nom: 'Bermudes', region: 'Amérique' },
    { code: 'BT', nom: 'Bhoutan', region: 'Asie' },
    { code: 'BY', nom: 'Biélorussie', region: 'Europe' },
    { code: 'BO', nom: 'Bolivie', region: 'Amérique' },
    { code: 'BA', nom: 'Bosnie-Herzégovine', region: 'Europe' },
    { code: 'BW', nom: 'Botswana', region: 'Afrique' },
    { code: 'BR', nom: 'Brésil', region: 'Amérique' },
    { code: 'BN', nom: 'Brunei', region: 'Asie' },
    { code: 'BG', nom: 'Bulgarie', region: 'Europe' },
    { code: 'BF', nom: 'Burkina Faso', region: 'Afrique' },
    { code: 'BI', nom: 'Burundi', region: 'Afrique' },
    { code: 'KH', nom: 'Cambodge', region: 'Asie' },
    { code: 'CM', nom: 'Cameroun', region: 'Afrique' },
    { code: 'CA', nom: 'Canada', region: 'Amérique' },
    { code: 'CV', nom: 'Cap-Vert', region: 'Afrique' },
    { code: 'CL', nom: 'Chili', region: 'Amérique' },
    { code: 'CN', nom: 'Chine', region: 'Asie' },
    { code: 'CY', nom: 'Chypre', region: 'Europe' },
    { code: 'CO', nom: 'Colombie', region: 'Amérique' },
    { code: 'KM', nom: 'Comores', region: 'Afrique' },
    { code: 'CG', nom: 'Congo', region: 'Afrique' },
    { code: 'CD', nom: 'Congo (RDC)', region: 'Afrique' },
    { code: 'KR', nom: 'Corée du Sud', region: 'Asie' },
    { code: 'KP', nom: 'Corée du Nord', region: 'Asie' },
    { code: 'CR', nom: 'Costa Rica', region: 'Amérique' },
    { code: 'HR', nom: 'Croatie', region: 'Europe' },
    { code: 'CU', nom: 'Cuba', region: 'Amérique' },
    { code: 'DK', nom: 'Danemark', region: 'Europe' },
    { code: 'DJ', nom: 'Djibouti', region: 'Afrique' },
    { code: 'DM', nom: 'Dominique', region: 'Amérique' },
    { code: 'EG', nom: 'Égypte', region: 'Afrique' },
    { code: 'AE', nom: 'Émirats Arabes Unis', region: 'Asie' },
    { code: 'EC', nom: 'Équateur', region: 'Amérique' },
    { code: 'ER', nom: 'Érythrée', region: 'Afrique' },
    { code: 'ES', nom: 'Espagne', region: 'Europe' },
    { code: 'EE', nom: 'Estonie', region: 'Europe' },
    { code: 'SZ', nom: 'Eswatini', region: 'Afrique' },
    { code: 'US', nom: 'États-Unis', region: 'Amérique' },
    { code: 'ET', nom: 'Éthiopie', region: 'Afrique' },
    { code: 'FJ', nom: 'Fidji', region: 'Océanie' },
    { code: 'FI', nom: 'Finlande', region: 'Europe' },
    { code: 'FR', nom: 'France', region: 'Europe' },
    { code: 'GA', nom: 'Gabon', region: 'Afrique' },
    { code: 'GM', nom: 'Gambie', region: 'Afrique' },
    { code: 'GE', nom: 'Géorgie', region: 'Asie' },
    { code: 'GH', nom: 'Ghana', region: 'Afrique' },
    { code: 'GI', nom: 'Gibraltar', region: 'Europe' },
    { code: 'GR', nom: 'Grèce', region: 'Europe' },
    { code: 'GD', nom: 'Grenade', region: 'Amérique' },
    { code: 'GL', nom: 'Groenland', region: 'Amérique' },
    { code: 'GP', nom: 'Guadeloupe', region: 'Amérique' },
    { code: 'GU', nom: 'Guam', region: 'Océanie' },
    { code: 'GT', nom: 'Guatemala', region: 'Amérique' },
    { code: 'GG', nom: 'Guernesey', region: 'Europe' },
    { code: 'GN', nom: 'Guinée', region: 'Afrique' },
    { code: 'GQ', nom: 'Guinée équatoriale', region: 'Afrique' },
    { code: 'GW', nom: 'Guinée-Bissau', region: 'Afrique' },
    { code: 'GY', nom: 'Guyana', region: 'Amérique' },
    { code: 'GF', nom: 'Guyane française', region: 'Amérique' },
    { code: 'HT', nom: 'Haïti', region: 'Amérique' },
    { code: 'HN', nom: 'Honduras', region: 'Amérique' },
    { code: 'HK', nom: 'Hong Kong', region: 'Asie' },
    { code: 'HU', nom: 'Hongrie', region: 'Europe' },
    { code: 'IN', nom: 'Inde', region: 'Asie' },
    { code: 'ID', nom: 'Indonésie', region: 'Asie' },
    { code: 'IQ', nom: 'Irak', region: 'Asie' },
    { code: 'IR', nom: 'Iran', region: 'Asie' },
    { code: 'IE', nom: 'Irlande', region: 'Europe' },
    { code: 'IS', nom: 'Islande', region: 'Europe' },
    { code: 'IL', nom: 'Israël', region: 'Asie' },
    { code: 'IT', nom: 'Italie', region: 'Europe' },
    { code: 'JM', nom: 'Jamaïque', region: 'Amérique' },
    { code: 'JP', nom: 'Japon', region: 'Asie' },
    { code: 'JE', nom: 'Jersey', region: 'Europe' },
    { code: 'JO', nom: 'Jordanie', region: 'Asie' },
    { code: 'KZ', nom: 'Kazakhstan', region: 'Asie' },
    { code: 'KE', nom: 'Kenya', region: 'Afrique' },
    { code: 'KG', nom: 'Kirghizistan', region: 'Asie' },
    { code: 'KI', nom: 'Kiribati', region: 'Océanie' },
    { code: 'XK', nom: 'Kosovo', region: 'Europe' },
    { code: 'KW', nom: 'Koweït', region: 'Asie' },
    { code: 'LA', nom: 'Laos', region: 'Asie' },
    { code: 'LS', nom: 'Lesotho', region: 'Afrique' },
    { code: 'LV', nom: 'Lettonie', region: 'Europe' },
    { code: 'LB', nom: 'Liban', region: 'Asie' },
    { code: 'LR', nom: 'Libéria', region: 'Afrique' },
    { code: 'LY', nom: 'Libye', region: 'Afrique' },
    { code: 'LI', nom: 'Liechtenstein', region: 'Europe' },
    { code: 'LT', nom: 'Lituanie', region: 'Europe' },
    { code: 'LU', nom: 'Luxembourg', region: 'Europe' },
    { code: 'MO', nom: 'Macao', region: 'Asie' },
    { code: 'MK', nom: 'Macédoine du Nord', region: 'Europe' },
    { code: 'MG', nom: 'Madagascar', region: 'Afrique' },
    { code: 'MY', nom: 'Malaisie', region: 'Asie' },
    { code: 'MW', nom: 'Malawi', region: 'Afrique' },
    { code: 'MV', nom: 'Maldives', region: 'Asie' },
    { code: 'ML', nom: 'Mali', region: 'Afrique' },
    { code: 'MT', nom: 'Malte', region: 'Europe' },
    { code: 'MA', nom: 'Maroc', region: 'Afrique' },
    { code: 'MQ', nom: 'Martinique', region: 'Amérique' },
    { code: 'MU', nom: 'Maurice', region: 'Afrique' },
    { code: 'MR', nom: 'Mauritanie', region: 'Afrique' },
    { code: 'YT', nom: 'Mayotte', region: 'Afrique' },
    { code: 'MX', nom: 'Mexique', region: 'Amérique' },
    { code: 'MD', nom: 'Moldavie', region: 'Europe' },
    { code: 'MC', nom: 'Monaco', region: 'Europe' },
    { code: 'MN', nom: 'Mongolie', region: 'Asie' },
    { code: 'ME', nom: 'Monténégro', region: 'Europe' },
    { code: 'MS', nom: 'Montserrat', region: 'Amérique' },
    { code: 'MZ', nom: 'Mozambique', region: 'Afrique' },
    { code: 'MM', nom: 'Myanmar', region: 'Asie' },
    { code: 'NA', nom: 'Namibie', region: 'Afrique' },
    { code: 'NP', nom: 'Népal', region: 'Asie' },
    { code: 'NI', nom: 'Nicaragua', region: 'Amérique' },
    { code: 'NE', nom: 'Niger', region: 'Afrique' },
    { code: 'NG', nom: 'Nigeria', region: 'Afrique' },
    { code: 'NO', nom: 'Norvège', region: 'Europe' },
    { code: 'NC', nom: 'Nouvelle-Calédonie', region: 'Océanie' },
    { code: 'NZ', nom: 'Nouvelle-Zélande', region: 'Océanie' },
    { code: 'OM', nom: 'Oman', region: 'Asie' },
    { code: 'UG', nom: 'Ouganda', region: 'Afrique' },
    { code: 'UZ', nom: 'Ouzbékistan', region: 'Asie' },
    { code: 'PK', nom: 'Pakistan', region: 'Asie' },
    { code: 'PW', nom: 'Palaos', region: 'Océanie' },
    { code: 'PA', nom: 'Panama', region: 'Amérique' },
    { code: 'PG', nom: 'Papouasie-Nouvelle-Guinée', region: 'Océanie' },
    { code: 'PY', nom: 'Paraguay', region: 'Amérique' },
    { code: 'NL', nom: 'Pays-Bas', region: 'Europe' },
    { code: 'PE', nom: 'Pérou', region: 'Amérique' },
    { code: 'PH', nom: 'Philippines', region: 'Asie' },
    { code: 'PL', nom: 'Pologne', region: 'Europe' },
    { code: 'PF', nom: 'Polynésie française', region: 'Océanie' },
    { code: 'PT', nom: 'Portugal', region: 'Europe' },
    { code: 'PR', nom: 'Porto Rico', region: 'Amérique' },
    { code: 'RE', nom: 'Réunion', region: 'Afrique' },
    { code: 'RO', nom: 'Roumanie', region: 'Europe' },
    { code: 'GB', nom: 'Royaume-Uni', region: 'Europe' },
    { code: 'RU', nom: 'Russie', region: 'Europe' },
    { code: 'RW', nom: 'Rwanda', region: 'Afrique' },
    { code: 'EH', nom: 'Sahara occidental', region: 'Afrique' },
    { code: 'BL', nom: 'Saint-Barthélemy', region: 'Amérique' },
    { code: 'KN', nom: 'Saint-Kitts-et-Nevis', region: 'Amérique' },
    { code: 'SM', nom: 'Saint-Marin', region: 'Europe' },
    { code: 'MF', nom: 'Saint-Martin', region: 'Amérique' },
    { code: 'PM', nom: 'Saint-Pierre-et-Miquelon', region: 'Amérique' },
    { code: 'VA', nom: 'Saint-Siège (Vatican)', region: 'Europe' },
    { code: 'VC', nom: 'Saint-Vincent-et-les-Grenadines', region: 'Amérique' },
    { code: 'LC', nom: 'Sainte-Lucie', region: 'Amérique' },
    { code: 'SB', nom: 'Îles Salomon', region: 'Océanie' },
    { code: 'WS', nom: 'Samoa', region: 'Océanie' },
    { code: 'AS', nom: 'Samoa américaines', region: 'Océanie' },
    { code: 'ST', nom: 'Sao Tomé-et-Principe', region: 'Afrique' },
    { code: 'SN', nom: 'Sénégal', region: 'Afrique' },
    { code: 'RS', nom: 'Serbie', region: 'Europe' },
    { code: 'SC', nom: 'Seychelles', region: 'Afrique' },
    { code: 'SL', nom: 'Sierra Leone', region: 'Afrique' },
    { code: 'SG', nom: 'Singapour', region: 'Asie' },
    { code: 'SK', nom: 'Slovaquie', region: 'Europe' },
    { code: 'SI', nom: 'Slovénie', region: 'Europe' },
    { code: 'SO', nom: 'Somalie', region: 'Afrique' },
    { code: 'SD', nom: 'Soudan', region: 'Afrique' },
    { code: 'SS', nom: 'Soudan du Sud', region: 'Afrique' },
    { code: 'LK', nom: 'Sri Lanka', region: 'Asie' },
    { code: 'SE', nom: 'Suède', region: 'Europe' },
    { code: 'CH', nom: 'Suisse', region: 'Europe' },
    { code: 'SR', nom: 'Suriname', region: 'Amérique' },
    { code: 'SY', nom: 'Syrie', region: 'Asie' },
    { code: 'TJ', nom: 'Tadjikistan', region: 'Asie' },
    { code: 'TW', nom: 'Taïwan', region: 'Asie' },
    { code: 'TZ', nom: 'Tanzanie', region: 'Afrique' },
    { code: 'TD', nom: 'Tchad', region: 'Afrique' },
    { code: 'CZ', nom: 'République tchèque', region: 'Europe' },
    { code: 'TF', nom: 'Terres australes françaises', region: 'Antarctique' },
    { code: 'TH', nom: 'Thaïlande', region: 'Asie' },
    { code: 'TL', nom: 'Timor oriental', region: 'Asie' },
    { code: 'TG', nom: 'Togo', region: 'Afrique' },
    { code: 'TK', nom: 'Tokelau', region: 'Océanie' },
    { code: 'TO', nom: 'Tonga', region: 'Océanie' },
    { code: 'TT', nom: 'Trinité-et-Tobago', region: 'Amérique' },
    { code: 'TN', nom: 'Tunisie', region: 'Afrique' },
    { code: 'TM', nom: 'Turkménistan', region: 'Asie' },
    { code: 'TR', nom: 'Turquie', region: 'Asie' },
    { code: 'TV', nom: 'Tuvalu', region: 'Océanie' },
    { code: 'UA', nom: 'Ukraine', region: 'Europe' },
    { code: 'UY', nom: 'Uruguay', region: 'Amérique' },
    { code: 'VU', nom: 'Vanuatu', region: 'Océanie' },
    { code: 'VE', nom: 'Venezuela', region: 'Amérique' },
    { code: 'VN', nom: 'Vietnam', region: 'Asie' },
    { code: 'WF', nom: 'Wallis-et-Futuna', region: 'Océanie' },
    { code: 'YE', nom: 'Yémen', region: 'Asie' },
    { code: 'ZM', nom: 'Zambie', region: 'Afrique' },
    { code: 'ZW', nom: 'Zimbabwe', region: 'Afrique' }
  ];

  // Chargement des données
  useEffect(() => {
    loadData();
    console.log('RegistreEtatCivil: Chargement des données...');
  }, []);

  const loadData = async () => {
    try {
      console.log('Tentative de chargement depuis l\'API...');
      // Charger depuis l'API
      const [dossiersData, modificationsData, agentsData, utilisateursData] = await Promise.all([
        dossiersAPI.getAll(),
        modificationsAPI.getAll(),
        Promise.resolve([]), // agents
        Promise.resolve([])  // utilisateurs
      ]);

      console.log('Données API chargées:', { dossiersData, agentsData, utilisateursData });
      setDossiers(dossiersData);
      setModifications(modificationsData);
      setAgents(agentsData);
      setUtilisateurs(utilisateursData);
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      // Fallback vers localStorage
      const savedDossiers = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
      const savedModifications = JSON.parse(localStorage.getItem('registreModifications') || '[]');
      const savedAgents = JSON.parse(localStorage.getItem('registreAgents') || '[]');
      const savedUtilisateurs = JSON.parse(localStorage.getItem('registreUtilisateurs') || '[]');

      // Ajouter des données de test si aucune donnée n'existe
      if (savedDossiers.length === 0) {
        const testDossiers = [
          {
            id: 1,
            numeroSuivi: 'REG-202412-001',
            numeroDossier: 'DOS-1703123456789',
            nomUsager: 'Kouassi',
            prenomUsager: 'Jean',
            dateNaissance: '1990-05-15',
            lieuNaissance: 'Abidjan',
            nationalite: 'Ivoirienne',
            adresse: 'Cocody, Abidjan',
            telephone: '+2250701234567',
            email: 'jean.kouassi@email.com',
            typeDossier: 'Naissance',
            demandes: [{ typeDossier: 'Naissance', cout: 5000 }],
            dateDepot: '2024-12-15',
            dateRetrait: '2024-12-29',
            statut: 'En cours',
            agentId: '',
            observations: 'Dossier test',
            coutTotal: 5000,
            dateCreation: '2024-12-15T10:00:00.000Z'
          }
        ];
        setDossiers(testDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(testDossiers));
      } else {
        setDossiers(savedDossiers);
      }

      if (savedAgents.length === 0) {
        const testAgents = [
          {
            id: 1,
            nom: 'Traoré',
            matricule: 'AGT-001',
            telephone: '+2250701234567',
            email: 'traore@diplomatie.gouv.ci',
            adresse: 'Abidjan',
            specialite: 'État Civil',
            actif: true,
            dateCreation: '2024-12-15T10:00:00.000Z',
            dossiersAssignes: [],
            statistiques: { totalTraites: 0, enCours: 0, termines: 0, recettes: 0 }
          }
        ];
        setAgents(testAgents);
        localStorage.setItem('registreAgents', JSON.stringify(testAgents));
      } else {
        setAgents(savedAgents);
      }

      if (savedUtilisateurs.length === 0) {
        const testUtilisateurs = [
          {
            id: 1,
            nom: 'Admin',
            matricule: 'ADM-001',
            email: 'admin@diplomatie.gouv.ci',
            motDePasse: 'admin123',
            role: 'super_admin',
            actif: true,
            dateCreation: '2024-12-15T10:00:00.000Z'
          }
        ];
        setUtilisateurs(testUtilisateurs);
        localStorage.setItem('registreUtilisateurs', JSON.stringify(testUtilisateurs));
      } else {
        setUtilisateurs(savedUtilisateurs);
      }

      setModifications(savedModifications);
    }
  };

  // Génération des numéros
  const generateNumeroSuivi = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = dossiers.filter(d => {
      const dDate = new Date(d.dateCreation);
      return dDate.getFullYear() === year && dDate.getMonth() === date.getMonth();
    }).length + 1;
    return `REG-${year}${month}-${String(count).padStart(3, '0')}`;
  };

  const generateNumeroDossier = () => {
    return `DOS-${Date.now()}`;
  };

  // Reset du formulaire
  const resetForm = () => {
    const dateDepot = new Date().toISOString().split('T')[0];
    const dateRetrait = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setFormData({
      nomUsager: '',
      prenomUsager: '',
      dateNaissance: '',
      lieuNaissance: '',
      adresse: '',
      telephone: '',
      email: '',
      typeDossier: 'Naissance',
      demandes: [{ typeDossier: 'Naissance', cout: 5000 }],
      dateDepot: dateDepot,
      dateRetrait: dateRetrait,
      statut: 'En cours',
      agentId: '',
      observations: ''
    });
  };

  // Calcul du coût total
  const calculateCoutTotal = (demandes) => {
    return demandes.reduce((total, demande) => total + (demande.cout || 0), 0);
  };

  // Gestion des demandes
  const addDemande = () => {
    setFormData(prev => ({
      ...prev,
      demandes: [...prev.demandes, { typeDossier: 'Naissance', cout: prixParType['Naissance'] }]
    }));
  };

  const removeDemande = (index) => {
    setFormData(prev => ({
      ...prev,
      demandes: prev.demandes.filter((_, i) => i !== index)
    }));
  };

  const updateDemande = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      demandes: prev.demandes.map((demande, i) => {
      if (i === index) {
          const updatedDemande = { ...demande, [field]: value };
          // Si le type de dossier change, mettre à jour automatiquement le prix
          if (field === 'typeDossier') {
            updatedDemande.cout = prixParType[value] || 0;
          }
          return updatedDemande;
      }
      return demande;
      })
    }));
  };

  // Ajout de modifications
  const addModification = async (dossierId, champ, ancienneValeur, nouvelleValeur) => {
    const modification = {
      id: Date.now(),
      dossierId,
      champ,
      ancienneValeur,
      nouvelleValeur,
      dateModification: new Date().toISOString(),
      utilisateur: currentUser?.username || 'Système'
    };

    try {
      await modificationsAPI.create(modification);
    setModifications([modification, ...modifications]);
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      const updatedModifications = [modification, ...modifications];
      setModifications(updatedModifications);
      localStorage.setItem('registreModifications', JSON.stringify(updatedModifications));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const nouveauDossier = {
      ...formData,
      id: editingDossier ? editingDossier.id : Date.now(),
      numeroSuivi: generateNumeroSuivi(),
      numeroDossier: generateNumeroDossier(),
      coutTotal: calculateCoutTotal(formData.demandes),
      dateCreation: editingDossier ? editingDossier.dateCreation : new Date().toISOString()
    };

    try {
      if (editingDossier) {
        const updatedDossier = await dossiersAPI.update(editingDossier.id, nouveauDossier);
        setDossiers(dossiers.map(d => d.id === editingDossier.id ? updatedDossier : d));
        showNotification('Dossier modifié avec succès !', 'success');
      } else {
        const savedDossier = await dossiersAPI.create(nouveauDossier);
        setDossiers([savedDossier, ...dossiers]);
        showNotification('Dossier ajouté avec succès !', 'success');
      }
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      if (editingDossier) {
        const updatedDossiers = dossiers.map(d => d.id === editingDossier.id ? nouveauDossier : d);
        setDossiers(updatedDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
        showNotification('Dossier modifié avec succès !', 'success');
      } else {
        const updatedDossiers = [nouveauDossier, ...dossiers];
        setDossiers(updatedDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
        showNotification('Dossier ajouté avec succès !', 'success');
      }
    }

      setShowForm(false);
    setEditingDossier(null);
      resetForm();
  };

  // Édition d'un dossier
  const handleEdit = (dossier) => {
    setEditingDossier(dossier);
    setFormData({
      nomUsager: dossier.nomUsager || '',
      prenomUsager: dossier.prenomUsager || '',
      dateNaissance: dossier.dateNaissance || '',
      lieuNaissance: dossier.lieuNaissance || '',
      nationalite: dossier.nationalite || '',
      adresse: dossier.adresse || '',
      telephone: dossier.telephone || '',
      email: dossier.email || '',
      typeDossier: dossier.typeDossier || 'Naissance',
      demandes: dossier.demandes || [{ typeDossier: 'Naissance', cout: 5000 }],
      dateDepot: dossier.dateDepot || new Date().toISOString().split('T')[0],
      dateRetrait: dossier.dateRetrait || '',
      statut: dossier.statut || 'En cours',
      agentId: dossier.agentId || '',
      observations: dossier.observations || ''
    });
    setShowForm(true);
  };

  // Suppression d'un dossier
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      try {
        await dossiersAPI.delete(id);
      setDossiers(dossiers.filter(d => d.id !== id));
        showNotification('Dossier supprimé avec succès !', 'success');
      } catch (error) {
        console.log('API non disponible, utilisation localStorage');
        const updatedDossiers = dossiers.filter(d => d.id !== id);
        setDossiers(updatedDossiers);
        localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
      showNotification('Dossier supprimé avec succès !', 'success');
      }
    }
  };

  // Nouveau dossier
  const handleNewDossier = () => {
    setEditingDossier(null);
    resetForm();
    setShowForm(true);
  };

  // Couleurs des statuts
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

  // Statistiques
  const getStatistiques = () => {
    const total = dossiers.length;
    const enCours = dossiers.filter(d => d.statut === 'En cours').length;
    const termines = dossiers.filter(d => d.statut === 'Terminé').length;
    const recettesTotales = dossiers.reduce((total, d) => total + (d.coutTotal || 0), 0);
    const cemois = dossiers.filter(d => {
      const date = new Date(d.dateCreation);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return { total, enCours, termines, recettesTotales, cemois };
  };

  // Filtrage des dossiers
  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = !searchTerm || 
      (dossier.nomUsager && dossier.nomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dossier.prenomUsager && dossier.prenomUsager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dossier.numeroSuivi && dossier.numeroSuivi.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filterType || 
      (dossier.demandes && dossier.demandes.some(d => d.typeDossier === filterType));
    
    return matchesSearch && matchesType;
  });

  // Notifications
  const showNotification = (message, type = 'success') => {
    // Implémentation simple de notification
    alert(message);
  };

  // Validation du formulaire
  const validateForm = () => {
    if (!formData.nomUsager || !formData.prenomUsager) {
      showNotification('Veuillez remplir les informations de l\'usager', 'error');
      return false;
    }
    return true;
  };

  // Fonctions d'export
  const exportToCSV = () => {
    const headers = ['N° Suivi', 'Nom', 'Prénom', 'Type', 'Statut', 'Coût', 'Date Dépôt', 'Date Retrait'];
      const csvContent = [
        headers.join(','),
      ...filteredDossiers.map(dossier => [
        dossier.numeroSuivi,
        dossier.nomUsager,
        dossier.prenomUsager,
        dossier.demandes?.map(d => d.typeDossier).join(';') || '',
        dossier.statut,
            dossier.coutTotal || 0,
        dossier.dateDepot,
        dossier.dateRetrait
      ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dossiers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    showNotification('Export CSV réussi !', 'success');
  };

  const exportToExcel = () => {
    // Simulation d'export Excel (en réalité, on génère un CSV)
    exportToCSV();
  };

  const exportToPDF = () => {
    // Simulation d'export PDF
    showNotification('Export PDF en cours de développement...', 'info');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const importedDossiers = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            id: Date.now() + Math.random(),
            numeroSuivi: values[0] || '',
            nomUsager: values[1] || '',
            prenomUsager: values[2] || '',
            typeDossier: values[3] || 'Naissance',
            statut: values[4] || 'En cours',
            coutTotal: parseInt(values[5]) || 0,
            dateDepot: values[6] || new Date().toISOString().split('T')[0],
            dateRetrait: values[7] || '',
              dateCreation: new Date().toISOString()
            };
        }).filter(d => d.nomUsager); // Filtrer les lignes vides
        
        setDossiers([...importedDossiers, ...dossiers]);
        localStorage.setItem('registreDossiers', JSON.stringify([...importedDossiers, ...dossiers]));
        showNotification(`${importedDossiers.length} dossiers importés avec succès !`, 'success');
      } catch (error) {
        showNotification('Erreur lors de l\'import du fichier', 'error');
      }
    };
    reader.readAsText(file);
  };

  const downloadDossier = (dossier) => {
    const dossierData = {
      ...dossier,
      dateTelechargement: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { 
      type: 'application/json' 
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dossier_${dossier.numeroSuivi}.json`;
    link.click();
    showNotification('Dossier téléchargé avec succès !', 'success');
  };

  const statistiques = getStatistiques();

  const assignerDossier = async (dossierId) => {
    const dossier = dossiers.find(d => d.id === dossierId);
    if (!dossier) return;

    const agent = agents.find(a => a.actif); // Prendre le premier agent actif
    if (!agent) {
      showNotification('Aucun agent actif trouvé pour assigner le dossier.', 'error');
      return;
    }

    const updatedDossier = { ...dossier, agentId: agent.id, statut: 'En cours' };

    try {
      await dossiersAPI.update(dossierId, updatedDossier);
      setDossiers(dossiers.map(d => d.id === dossierId ? updatedDossier : d));
    showNotification('Dossier assigné avec succès !', 'success');
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      const updatedDossiers = dossiers.map(d => d.id === dossierId ? updatedDossier : d);
      setDossiers(updatedDossiers);
      localStorage.setItem('registreDossiers', JSON.stringify(updatedDossiers));
      showNotification('Dossier assigné avec succès !', 'success');
    }
  };

  const assignerDossiersAutomatiquement = async () => {
    const nonAssignes = dossiers.filter(d => !d.agentId && d.statut === 'En cours');
    if (nonAssignes.length === 0) {
      showNotification('Aucun dossier non assigné en cours.', 'info');
      return;
    }

    const agent = agents.find(a => a.actif); // Prendre le premier agent actif
    if (!agent) {
      showNotification('Aucun agent actif trouvé pour assigner les dossiers.', 'error');
      return;
    }

    const updatedDossiers = nonAssignes.map(d => ({ ...d, agentId: agent.id, statut: 'En cours' }));

    try {
      await Promise.all(updatedDossiers.map(d => dossiersAPI.update(d.id, d)));
      setDossiers([...dossiers.filter(d => d.id !== updatedDossiers[0].id), ...updatedDossiers]); // Mettre à jour l'état local
      showNotification(`${updatedDossiers.length} dossiers assignés avec succès !`, 'success');
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      const updatedDossiers = nonAssignes.map(d => ({ ...d, agentId: agent.id, statut: 'En cours' }));
      setDossiers([...dossiers.filter(d => d.id !== updatedDossiers[0].id), ...updatedDossiers]);
      localStorage.setItem('registreDossiers', JSON.stringify([...dossiers.filter(d => d.id !== updatedDossiers[0].id), ...updatedDossiers]));
      showNotification(`${updatedDossiers.length} dossiers assignés avec succès !`, 'success');
    }
  };

  const voirDossiersAgent = (agent) => {
    const agentDossiers = dossiers.filter(d => d.agentId === agent.id);
    setSelectedDossier(null); // Clear previous selection
    setShowCreationActe(false); // Close acte modal
    setShowForm(false); // Close form
    setActiveTab('dossiers'); // Switch to dossiers tab
    setSearchTerm(`${agent.nom} ${agent.prenomUsager}`); // Search for agent's dossiers
    setFilterType(''); // Show all types
  };

  const assignerDossiersAgent = (agent) => {
    const agentDossiers = dossiers.filter(d => d.agentId === agent.id);
    if (agentDossiers.length === 0) {
      showNotification('Aucun dossier assigné à cet agent.', 'info');
      return;
    }

    const nonAssignes = dossiers.filter(d => !d.agentId && d.statut === 'En cours');
    if (nonAssignes.length === 0) {
      showNotification('Aucun dossier non assigné en cours.', 'info');
      return;
    }

    const updatedDossiers = nonAssignes.map(d => ({ ...d, agentId: agent.id, statut: 'En cours' }));

    try {
      Promise.all(updatedDossiers.map(d => dossiersAPI.update(d.id, d)));
      setDossiers([...dossiers.filter(d => d.id !== updatedDossiers[0].id), ...updatedDossiers]); // Mettre à jour l'état local
      showNotification(`${updatedDossiers.length} dossiers assignés avec succès à ${agent.nom} !`, 'success');
    } catch (error) {
      console.log('API non disponible, utilisation localStorage');
      const updatedDossiers = nonAssignes.map(d => ({ ...d, agentId: agent.id, statut: 'En cours' }));
      setDossiers([...dossiers.filter(d => d.id !== updatedDossiers[0].id), ...updatedDossiers]);
      localStorage.setItem('registreDossiers', JSON.stringify([...dossiers.filter(d => d.id !== updatedDossiers[0].id), ...updatedDossiers]));
      showNotification(`${updatedDossiers.length} dossiers assignés avec succès à ${agent.nom} !`, 'success');
    }
  };

  // Fonctions pour les comptes agents
  const handleAgentLogin = (agent) => {
    setCurrentAgentSession(agent);
    setShowLoginAgent(false);
  };

  const handleAgentLogout = () => {
    setCurrentAgentSession(null);
    localStorage.removeItem('agentSession');
  };

  const handleGestionCompteAgent = (agent) => {
    setSelectedAgent(agent);
    setShowCompteAgent(true);
  };

  const handleUpdateAgent = (updatedAgent) => {
    const updatedAgents = agents.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    );
    setAgents(updatedAgents);
    localStorage.setItem('registreAgents', JSON.stringify(updatedAgents));
  };

  // Fonction pour ouvrir le modal des observations
  const openObservationsModal = (dossier) => {
    setSelectedDossierForObservations(dossier);
    setShowObservationsModal(true);
  };

  // Liste complète des observations par statut
  const getAllObservationsForStatut = (statut) => {
    const observationsByStatut = {
      'En cours': [
        'Dossier en cours de traitement',
        'En attente de documents complémentaires',
        'Vérification en cours',
        'Traitement administratif en cours',
        'Analyse des documents en cours',
        'Contrôle qualité en cours',
        'Validation des informations en cours',
        'Préparation du dossier en cours'
      ],
      'En attente': [
        'En attente de validation',
        'En attente de paiement',
        'En attente de documents',
        'En attente de confirmation',
        'En attente de signature',
        'En attente de vérification',
        'En attente de décision',
        'En attente de finalisation'
      ],
      'Prêt pour création d\'acte': [
        'Dossier complet, prêt pour création d\'acte',
        'Tous les documents validés, prêt pour acte',
        'Validation terminée, prêt pour génération',
        'Dossier validé, prêt pour création d\'acte',
        'Documents conformes, prêt pour acte',
        'Vérification terminée, prêt pour acte',
        'Contrôle passé, prêt pour création',
        'Dossier approuvé, prêt pour acte'
      ],
      'Acte créé': [
        'Acte généré avec succès',
        'Acte créé et validé',
        'Acte disponible pour retrait',
        'Acte finalisé et prêt',
        'Acte produit avec succès',
        'Acte validé et disponible',
        'Acte terminé et prêt',
        'Acte complété avec succès'
      ],
      'Terminé': [
        'Traitement terminé avec succès',
        'Dossier clôturé',
        'Processus complet',
        'Mission accomplie',
        'Dossier finalisé avec succès',
        'Traitement achevé',
        'Dossier complété',
        'Mission terminée avec succès'
      ]
    };
    return observationsByStatut[statut] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <LogoHeader className="text-white" />
              <div className="border-l border-green-400 h-12 mx-4"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Registre d'État Civil</h1>
                <p className="text-green-100">Diplomatie Ivoirienne</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentAgentSession ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Agent: {currentAgentSession.nom}</span>
                  <button
                    onClick={handleAgentLogout}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Déconnexion Agent
                  </button>
              </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginAgent(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Connexion Agent
                  </button>
                  <span className="text-sm text-gray-600">
                    Connecté en tant que {currentUser?.username}
                  </span>
                <button
                  onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dossiers', label: 'Dossiers', icon: FileText },
              { id: 'statistiques', label: 'Statistiques', icon: BarChart3 },
              { id: 'statuts', label: 'Statuts', icon: CheckCircle }, // <-- Ajouté
              { id: 'agents', label: 'Agents', icon: User },
              { id: 'utilisateurs', label: 'Utilisateurs', icon: User },
              { id: 'actes', label: 'Actes', icon: FileText },
              { id: 'dispatching', label: 'Dispatching', icon: Clock },
              { id: 'sauvegarde', label: 'Sauvegarde', icon: Save }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
            </div>
          </div>

      {/* Contenu principal */}
      {currentAgentSession ? (
        <InterfaceAgent 
          agent={currentAgentSession} 
          onLogout={handleAgentLogout}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Dossiers */}
          {activeTab === 'dossiers' && (
          <div>

              {/* Barre d'outils */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher par numéro, nom, acte..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80"
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
                      {typesDossier.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <button
                    onClick={handleNewDossier}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau Dossier
                  </button>
                  
                  {/* Options d'export/import */}
                  <div className="relative group">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => exportToCSV()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                      Export CSV
                    </button>
                    <button
                          onClick={() => exportToExcel()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                          Export Excel
                    </button>
                    <button
                          onClick={() => exportToPDF()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                          Export PDF
                    </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      Import
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        <label className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleImport}
                        className="hidden"
                      />
                          Import CSV/Excel
                    </label>
                      </div>
                    </div>
                  </div>
                  
                    <button
                    onClick={() => setShowForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des dossiers */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Suivi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDossiers.map(dossier => (
                      <tr key={dossier.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dossier.numeroSuivi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dossier.nomUsager} {dossier.prenomUsager}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dossier.demandes && dossier.demandes.map(dem => dem.typeDossier).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dossier.statut)}`}>
                            {dossier.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(dossier.coutTotal || 0).toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(dossier)}
                              className="text-blue-600 hover:text-blue-900"
                                          title="Modifier le dossier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(dossier.id)}
                              className="text-red-600 hover:text-red-900"
                                          title="Supprimer le dossier"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                                        <button
                                          onClick={() => {
                                            setSelectedDossier(dossier);
                                            setShowCreationActe(true);
                                          }}
                                          className="text-green-600 hover:text-green-900"
                                          title="Créer un acte"
                                        >
                                          <FileText className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => downloadDossier(dossier)}
                                          className="text-purple-600 hover:text-purple-900"
                                          title="Télécharger le dossier"
                                        >
                                          <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section Statistiques */}
        {activeTab === 'statistiques' && (
          <Statistiques 
            dossiers={dossiers}
            agents={agents}
            actes={JSON.parse(localStorage.getItem('registreActes') || '[]')}
          />
        )}

        {/* Section Statuts */}
        {activeTab === 'statuts' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /> Gestion des Statuts des Dossiers
            </h2>
            
            {/* Informations sur les observations automatiques */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-blue-900">Système Automatisé d'Observations</h3>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  🔄 Automatisé
                </span>
                    </div>
              <p className="text-sm text-blue-700 mb-3">
                Les observations sont générées automatiquement selon le statut choisi. 
                Le système sélectionne aléatoirement une observation appropriée parmi les options disponibles.
                <span className="font-medium text-blue-800 ml-1">Aucune intervention manuelle requise !</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-blue-800">En cours:</strong>
                  <ul className="list-disc list-inside text-blue-700 ml-2">
                    <li>"Dossier en cours de traitement"</li>
                    <li>"En attente de documents complémentaires"</li>
                    <li>"Vérification en cours"</li>
                    <li>"Traitement administratif en cours"</li>
                    <li>"Analyse des documents en cours"</li>
                    <li>"Contrôle qualité en cours"</li>
                    <li>"Validation des informations en cours"</li>
                    <li>"Préparation du dossier en cours"</li>
                  </ul>
                    </div>
                <div>
                  <strong className="text-blue-800">En attente:</strong>
                  <ul className="list-disc list-inside text-blue-700 ml-2">
                    <li>"En attente de validation"</li>
                    <li>"En attente de paiement"</li>
                    <li>"En attente de documents"</li>
                    <li>"En attente de confirmation"</li>
                    <li>"En attente de signature"</li>
                    <li>"En attente de vérification"</li>
                    <li>"En attente de décision"</li>
                    <li>"En attente de finalisation"</li>
                  </ul>
                  </div>
                <div>
                  <strong className="text-blue-800">Prêt pour création d'acte:</strong>
                  <ul className="list-disc list-inside text-blue-700 ml-2">
                    <li>"Dossier complet, prêt pour création d'acte"</li>
                    <li>"Tous les documents validés, prêt pour acte"</li>
                    <li>"Validation terminée, prêt pour génération"</li>
                    <li>"Dossier validé, prêt pour création d'acte"</li>
                    <li>"Documents conformes, prêt pour acte"</li>
                    <li>"Vérification terminée, prêt pour acte"</li>
                    <li>"Contrôle passé, prêt pour création"</li>
                    <li>"Dossier approuvé, prêt pour acte"</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-800">Acte créé:</strong>
                  <ul className="list-disc list-inside text-blue-700 ml-2">
                    <li>"Acte généré avec succès"</li>
                    <li>"Acte créé et validé"</li>
                    <li>"Acte disponible pour retrait"</li>
                    <li>"Acte finalisé et prêt"</li>
                    <li>"Acte produit avec succès"</li>
                    <li>"Acte validé et disponible"</li>
                    <li>"Acte terminé et prêt"</li>
                    <li>"Acte complété avec succès"</li>
                  </ul>
                    </div>
                <div>
                  <strong className="text-blue-800">Terminé:</strong>
                  <ul className="list-disc list-inside text-blue-700 ml-2">
                    <li>"Traitement terminé avec succès"</li>
                    <li>"Dossier clôturé"</li>
                    <li>"Processus complet"</li>
                    <li>"Mission accomplie"</li>
                    <li>"Dossier finalisé avec succès"</li>
                    <li>"Traitement achevé"</li>
                    <li>"Dossier complété"</li>
                    <li>"Mission terminée avec succès"</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-blue-800">Automatisation:</strong>
                  <ul className="list-disc list-inside text-blue-700 ml-2">
                    <li>Changement de statut → Observation automatique</li>
                    <li>Sélection aléatoire parmi 8 options</li>
                    <li>Sauvegarde automatique</li>
                    <li>Pas d'intervention manuelle requise</li>
                  </ul>
                    </div>
                  </div>
                </div>
                
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">N° Suivi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usager</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observation Automatique</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Observation Personnalisée</th>
                  </tr>
                </thead>
                <tbody>
                  {dossiers.map((dossier) => (
                    <tr key={dossier.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{dossier.numeroSuivi}</td>
                      <td className="px-4 py-2">{dossier.nomUsager} {dossier.prenomUsager}</td>
                      <td className="px-4 py-2">
                        <select
                          className="border rounded px-2 py-1"
                          value={dossier.statut}
                          onChange={e => {
                            const newStatut = e.target.value;
                            // Générer une observation automatique selon le statut
                            let autoObs = '';
                            const autoObsOptions = {
                              'En cours': [
                                'Dossier en cours de traitement',
                                'En attente de documents complémentaires',
                                'Vérification en cours',
                                'Traitement administratif en cours',
                                'Analyse des documents en cours',
                                'Contrôle qualité en cours',
                                'Validation des informations en cours',
                                'Préparation du dossier en cours'
                              ],
                              'En attente': [
                                'En attente de validation',
                                'En attente de paiement',
                                'En attente de documents',
                                'En attente de confirmation',
                                'En attente de signature',
                                'En attente de vérification',
                                'En attente de décision',
                                'En attente de finalisation'
                              ],
                              'Prêt pour création d\'acte': [
                                'Dossier complet, prêt pour création d\'acte',
                                'Tous les documents validés, prêt pour acte',
                                'Validation terminée, prêt pour génération',
                                'Dossier validé, prêt pour création d\'acte',
                                'Documents conformes, prêt pour acte',
                                'Vérification terminée, prêt pour acte',
                                'Contrôle passé, prêt pour création',
                                'Dossier approuvé, prêt pour acte'
                              ],
                              'Acte créé': [
                                'Acte généré avec succès',
                                'Acte créé et validé',
                                'Acte disponible pour retrait',
                                'Acte finalisé et prêt',
                                'Acte produit avec succès',
                                'Acte validé et disponible',
                                'Acte terminé et prêt',
                                'Acte complété avec succès'
                              ],
                              'Terminé': [
                                'Traitement terminé avec succès',
                                'Dossier clôturé',
                                'Processus complet',
                                'Mission accomplie',
                                'Dossier finalisé avec succès',
                                'Traitement achevé',
                                'Dossier complété',
                                'Mission terminée avec succès'
                              ]
                            };
                            
                            // Choisir aléatoirement une observation parmi les options disponibles
                            const options = autoObsOptions[newStatut] || [];
                            if (options.length > 0) {
                              const randomIndex = Math.floor(Math.random() * options.length);
                              autoObs = options[randomIndex];
                            }
                            
                            const updated = dossiers.map(d => d.id === dossier.id ? { 
                              ...d, 
                              statut: newStatut, 
                              observations: autoObs,
                              observationPersonnalisee: d.observationPersonnalisee || '' // Garder l'observation personnalisée
                            } : d);
                            setDossiers(updated);
                            localStorage.setItem('registreDossiers', JSON.stringify(updated));
                          }}
                        >
                          <option value="En cours">En cours</option>
                          <option value="En attente">En attente</option>
                          <option value="Prêt pour création d'acte">Prêt pour création d'acte</option>
                          <option value="Acte créé">Acte créé</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        <div className="space-y-1">
                          {dossier.observations && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openObservationsModal(dossier)}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200 cursor-pointer transition-colors"
                                title="Cliquer pour voir toutes les observations disponibles"
                              >
                                <span className="font-medium">Auto:</span> {dossier.observations}
                              </button>
                              <button
                                onClick={() => {
                                  // Régénérer une observation automatique
                                  const autoObsOptions = {
                                    'En cours': [
                                      'Dossier en cours de traitement',
                                      'En attente de documents complémentaires',
                                      'Vérification en cours',
                                      'Traitement administratif en cours',
                                      'Analyse des documents en cours',
                                      'Contrôle qualité en cours',
                                      'Validation des informations en cours',
                                      'Préparation du dossier en cours'
                                    ],
                                    'En attente': [
                                      'En attente de validation',
                                      'En attente de paiement',
                                      'En attente de documents',
                                      'En attente de confirmation',
                                      'En attente de signature',
                                      'En attente de vérification',
                                      'En attente de décision',
                                      'En attente de finalisation'
                                    ],
                                    'Prêt pour création d\'acte': [
                                      'Dossier complet, prêt pour création d\'acte',
                                      'Tous les documents validés, prêt pour acte',
                                      'Validation terminée, prêt pour génération',
                                      'Dossier validé, prêt pour création d\'acte',
                                      'Documents conformes, prêt pour acte',
                                      'Vérification terminée, prêt pour acte',
                                      'Contrôle passé, prêt pour création',
                                      'Dossier approuvé, prêt pour acte'
                                    ],
                                    'Acte créé': [
                                      'Acte généré avec succès',
                                      'Acte créé et validé',
                                      'Acte disponible pour retrait',
                                      'Acte finalisé et prêt',
                                      'Acte produit avec succès',
                                      'Acte validé et disponible',
                                      'Acte terminé et prêt',
                                      'Acte complété avec succès'
                                    ],
                                    'Terminé': [
                                      'Traitement terminé avec succès',
                                      'Dossier clôturé',
                                      'Processus complet',
                                      'Mission accomplie',
                                      'Dossier finalisé avec succès',
                                      'Traitement achevé',
                                      'Dossier complété',
                                      'Mission terminée avec succès'
                                    ]
                                  };
                                  
                                  const options = autoObsOptions[dossier.statut] || [];
                                  if (options.length > 0) {
                                    const randomIndex = Math.floor(Math.random() * options.length);
                                    const newObs = options[randomIndex];
                                    
                                    const updated = dossiers.map(d => d.id === dossier.id ? { 
                                      ...d, 
                                      observations: newObs
                                    } : d);
                                    setDossiers(updated);
                                    localStorage.setItem('registreDossiers', JSON.stringify(updated));
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                title="Régénérer l'observation automatique"
                              >
                                🔄
                              </button>
                    </div>
                          )}
                          {!dossier.observations && (
                            <span className="text-gray-400 text-xs">Aucune observation</span>
                          )}
                    </div>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="Observation personnalisée (optionnel)..."
                          className="border rounded px-2 py-1 text-sm w-full"
                          value={dossier.observationPersonnalisee || ''}
                          onChange={e => {
                            const updated = dossiers.map(d => d.id === dossier.id ? { 
                              ...d, 
                              observationPersonnalisee: e.target.value 
                            } : d);
                            setDossiers(updated);
                            localStorage.setItem('registreDossiers', JSON.stringify(updated));
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
                
            {/* Statistiques des statuts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries({
                'En cours': dossiers.filter(d => d.statut === 'En cours').length,
                'En attente': dossiers.filter(d => d.statut === 'En attente').length,
                'Prêt pour création d\'acte': dossiers.filter(d => d.statut === 'Prêt pour création d\'acte').length,
                'Acte créé': dossiers.filter(d => d.statut === 'Acte créé').length,
                'Terminé': dossiers.filter(d => d.statut === 'Terminé').length
              }).map(([statut, count]) => (
                <div key={statut} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{statut}</div>
                    </div>
              ))}
                    </div>
                  </div>
        )}

        {/* Section Agents */}
        {activeTab === 'agents' && (
          <div className="p-6">

            <GestionAgents
              agents={agents}
              setAgents={setAgents}
              dossiers={dossiers}
              onAssignDossier={() => {}}
            />
                </div>
        )}

        {/* Section Utilisateurs */}
        {activeTab === 'utilisateurs' && (
          <div className="p-6">

            <GestionUtilisateurs
              utilisateurs={utilisateurs}
              setUtilisateurs={setUtilisateurs}
              currentUser={currentUser}
            />
              </div>
        )}
        
        {/* Section Actes */}
        {activeTab === 'actes' && (
          <div className="p-6">

            <GestionActes dossiers={dossiers} onClose={() => setActiveTab('dossiers')} />
                            </div>
        )}

        {/* Section Dispatching */}
        {activeTab === 'dispatching' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> Dispatching des Dossiers
            </h2>
            
            {/* Statistiques de dispatching */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {dossiers.filter(d => !d.agentId).length}
                          </div>
                <div className="text-sm text-blue-700">Dossiers non assignés</div>
                        </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {agents.filter(a => a.actif).length}
                  </div>
                <div className="text-sm text-green-700">Agents actifs</div>
                </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">
                  {dossiers.filter(d => d.agentId).length}
                            </div>
                <div className="text-sm text-purple-700">Dossiers assignés</div>
                          </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">
                  {Math.round(dossiers.filter(d => d.agentId).length / Math.max(agents.filter(a => a.actif).length, 1))}
                        </div>
                <div className="text-sm text-orange-700">Moyenne par agent</div>
                  </div>
                </div>

            {/* Actions de dispatching */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={assignerDossiersAutomatiquement}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Assignation Automatique
              </button>
              <button
                onClick={() => setShowManualAssignModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Assignation Manuelle
              </button>
              </div>

            {/* Liste des agents avec leurs dossiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.filter(a => a.actif).map(agent => {
                const agentDossiers = dossiers.filter(d => d.agentId === agent.id);
                const enCours = agentDossiers.filter(d => d.statut === 'En cours').length;
                const enAttente = agentDossiers.filter(d => d.statut === 'En attente').length;
                const termines = agentDossiers.filter(d => d.statut === 'Terminé').length;
                
                return (
                  <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{agent.nom}</h3>
                        <p className="text-sm text-gray-600">{agent.matricule}</p>
                      </div>
                      <div className="flex items-center gap-2">
                <button
                          onClick={() => voirDossiersAgent(agent)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => assignerDossiersAgent(agent)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Assigner
                </button>
              </div>
            </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{enCours}</div>
                        <div className="text-gray-600">En cours</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">{enAttente}</div>
                        <div className="text-gray-600">En attente</div>
                    </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{termines}</div>
                        <div className="text-gray-600">Terminés</div>
                  </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

        {/* Section Gestion des Sauvegardes */}
        {activeTab === 'sauvegarde' && (
          <GestionSauvegarde />
        )}
        </div>
      )}

      {/* Modal de création/édition de dossier */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingDossier ? 'Modifier le Dossier' : 'Nouveau Dossier'}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations de l'usager */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informations de l'Usager</h4>
                  <div className="space-y-4">

                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Numéro du registre</label>
                      <input
                        type="text"
                        value={formData.numeroRegistre || ''}
                        onChange={(e) => setFormData({...formData, numeroRegistre: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: REG-2025-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={formData.nomUsager}
                        onChange={(e) => setFormData({...formData, nomUsager: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenomUsager}
                    onChange={(e) => setFormData({...formData, prenomUsager: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                      <input
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
              </div>

              <div>
                      <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                    <select
                        value={formData.lieuNaissance}
                        onChange={(e) => setFormData({...formData, lieuNaissance: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner un lieu de naissance</option>
                        {paysListe.map(pays => (
                          <option 
                            key={pays.code} 
                            value={pays.nom}
                            className={pays.code === 'CI' ? 'font-bold text-green-600' : ''}
                          >
                            {pays.nom}
                          </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Sexe</label>
                      <select
                        value={formData.sexe || ''}
                        onChange={(e) => setFormData({...formData, sexe: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner le sexe</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                      </select>
                    </div>
              </div>
              </div>

                {/* Informations du dossier */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Informations du Dossier</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de dépôt</label>
                  <input
                    type="date"
                        value={formData.dateDepot}
                        onChange={(e) => setFormData({...formData, dateDepot: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                      <label className="block text-sm font-medium text-gray-700">Date de retrait prévue</label>
                  <input
                        type="date"
                        value={formData.dateRetrait}
                        onChange={(e) => setFormData({...formData, dateRetrait: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
              </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700">Observations</label>
                      <textarea
                        value={formData.observations}
                        onChange={(e) => setFormData({...formData, observations: e.target.value})}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                  </div>
                </div>
              </div>

              {/* Section des demandes multiples */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Demandes et Prix</h4>
                  <button
                    type="button"
                    onClick={addDemande}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une demande
                  </button>
              </div>

                {/* Liste des demandes */}
                <div className="space-y-3">
                  {formData.demandes.map((demande, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Demande #{index + 1}</h5>
                        {formData.demandes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDemande(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type de dossier</label>
                  <select
                            value={demande.typeDossier}
                            onChange={(e) => updateDemande(index, 'typeDossier', e.target.value)}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {typesDossier.map(type => (
                              <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <input
                            type="number"
                            value={demande.cout}
                            onChange={(e) => updateDemande(index, 'cout', parseInt(e.target.value) || 0)}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Prix automatique"
                    />
                  </div>
                    </div>
                  </div>
                  ))}
                </div>

                {/* Total des prix */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total des prix :</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateCoutTotal(formData.demandes).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingDossier ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'acte */}
      {showCreationActe && selectedDossier && (
        <CreationActes
          dossier={selectedDossier}
          onClose={() => {
            setShowCreationActe(false);
            setSelectedDossier(null);
          }}
        />
      )}

      {/* Modal d'assignation manuelle */}
      {showManualAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Assignation Manuelle</h3>
              <button
                onClick={() => setShowManualAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertTriangle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dossiers non assignés */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Dossiers Non Assignés</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {dossiers.filter(d => !d.agentId && d.statut === 'En cours').map(dossier => (
                      <div key={dossier.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-sm">{dossier.numeroSuivi}</p>
                            <p className="text-sm text-gray-600">{dossier.nomUsager} {dossier.prenomUsager}</p>
                            <p className="text-xs text-gray-500">{dossier.demandes?.map(d => d.typeDossier).join(', ')}</p>
                        </div>
                        <button
                            onClick={() => assignerDossier(dossier.id)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                            Assigner
                        </button>
                        </div>
                      </div>
                    ))}
                    {dossiers.filter(d => !d.agentId && d.statut === 'En cours').length === 0 && (
                      <p className="text-gray-500 text-sm">Aucun dossier non assigné</p>
                    )}
                  </div>
                </div>
                
                {/* Agents disponibles */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Agents Disponibles</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {agents.filter(a => a.actif).map(agent => {
                      const agentDossiers = dossiers.filter(d => d.agentId === agent.id);
                      const enCours = agentDossiers.filter(d => d.statut === 'En cours').length;
                      
                      return (
                        <div key={agent.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-sm">{agent.nom}</p>
                              <p className="text-sm text-gray-600">{agent.matricule}</p>
                              <p className="text-xs text-gray-500">{enCours} dossiers en cours</p>
                </div>
                            <button
                              onClick={() => assignerDossiersAgent(agent)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Assigner Auto
                            </button>
              </div>
                        </div>
                      );
                    })}
                    {agents.filter(a => a.actif).length === 0 && (
                      <p className="text-gray-500 text-sm">Aucun agent actif</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowManualAssignModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de connexion agent */}
      {showLoginAgent && (
        <LoginAgent
          onLogin={handleAgentLogin}
          onClose={() => setShowLoginAgent(false)}
        />
      )}

      {/* Modal de gestion de compte agent */}
      {showCompteAgent && selectedAgent && (
        <CompteAgent
          agent={selectedAgent}
          onClose={() => {
            setShowCompteAgent(false);
            setSelectedAgent(null);
          }}
          onUpdate={handleUpdateAgent}
        />
      )}

      {/* Modal des observations */}
      {showObservationsModal && selectedDossierForObservations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
      <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Observations Disponibles - {selectedDossierForObservations.statut}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Dossier: {selectedDossierForObservations.numeroSuivi} - {selectedDossierForObservations.nomUsager} {selectedDossierForObservations.prenomUsager}
                </p>
              </div>
              <button
                onClick={() => setShowObservationsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
      </div>
      
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Observations Automatiques Disponibles
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {getAllObservationsForStatut(selectedDossierForObservations.statut).map((observation, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDossierForObservations.observations === observation
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        // Appliquer cette observation
                        const updated = dossiers.map(d => d.id === selectedDossierForObservations.id ? { 
                          ...d, 
                          observations: observation
                        } : d);
                        setDossiers(updated);
                        localStorage.setItem('registreDossiers', JSON.stringify(updated));
                        setShowObservationsModal(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{observation}</span>
                        {selectedDossierForObservations.observations === observation && (
                          <span className="text-green-600 text-xs font-medium">✓ Actuelle</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
      </div>
      
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-md font-medium text-blue-900 mb-2">Informations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Cliquez sur une observation pour l'appliquer</li>
                  <li>• L'observation actuelle est mise en évidence</li>
                  <li>• Vous pouvez aussi utiliser le bouton 🔄 pour une sélection aléatoire</li>
                  <li>• Les observations sont sauvegardées automatiquement</li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {getAllObservationsForStatut(selectedDossierForObservations.statut).length} observations disponibles
                </div>
        <button
                  onClick={() => setShowObservationsModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
        </button>
      </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegistreEtatCivil; 