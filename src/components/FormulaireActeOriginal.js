import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle, AlertTriangle, User, Calendar, MapPin, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FormulaireActeOriginal = ({ dossier, onClose }) => {
  const [acteData, setActeData] = useState({
    numeroActe: '',
    dateCreation: new Date().toISOString().split('T')[0],
    lieuCreation: 'ABIDJAN',
    officier: '',
    observations: '',
    typeActe: dossier?.demandes?.[0]?.typeDossier || 'Extrait acte Naissance',
    // Informations des parents
    nomPere: '',
    dateNaissancePere: '',
    lieuNaissancePere: '',
    professionPere: '',
    adressePere: '',
    nomMere: '',
    dateNaissanceMere: '',
    lieuNaissanceMere: '',
    professionMere: '',
    adresseMere: ''
  });

  const typesActes = [
    'Extrait acte Naissance',
    'Acte de Naissance',
    'Acte de Mariage',
    'Acte de Décès',
    'Certificat de Nationalité',
    'Certificat de Célibat'
  ];

  const generateNumeroActe = (type) => {
    const prefix = type.includes('Naissance') ? 'N' : 
                   type.includes('Mariage') ? 'M' : 
                   type.includes('Décès') ? 'D' : 'A';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${random}`;
  };

  const handleTypeChange = (type) => {
    setActeData({
      ...acteData,
      typeActe: type,
      numeroActe: generateNumeroActe(type)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!acteData.numeroActe || !acteData.lieuCreation || !acteData.officier) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const acteCree = {
      id: Date.now(),
      dossierId: dossier.id,
      ...acteData,
      dateCreationActe: new Date().toISOString(),
      statut: 'Créé',
      dossierInfo: dossier
    };

    // Sauvegarder l'acte
    const actesExistant = JSON.parse(localStorage.getItem('registreActes') || '[]');
    actesExistant.push(acteCree);
    localStorage.setItem('registreActes', JSON.stringify(actesExistant));

    // Mettre à jour le statut du dossier
    const dossiersExistant = JSON.parse(localStorage.getItem('registreDossiers') || '[]');
    const dossiersMisAJour = dossiersExistant.map(d => 
      d.id === dossier.id ? { ...d, statut: 'Acte créé' } : d
    );
    localStorage.setItem('registreDossiers', JSON.stringify(dossiersMisAJour));

    alert('Acte créé avec succès !');
    onClose();
  };

  // Fonction pour générer le PDF de l'acte original
  const generateOriginalActeHTML = () => {
    const formatDate = (dateString) => {
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

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Acte Original - ${dossier.prenomUsager} ${dossier.nomUsager}</title>
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
              }
              
              .document-container {
                  background: white;
                  padding: 1.5cm;
                  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  border: 1px solid #e0e0e0;
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
              
              .parents-section {
                  margin: 1cm 0;
                  padding: 0.5cm;
                  border: 1px solid #e2e8f0;
                  border-radius: 4px;
                  background-color: #f7fafc;
              }
              
              .parent-info {
                  margin: 0.3cm 0;
                  line-height: 1.6;
                  font-size: 11pt;
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
              
              .official-seal {
                  position: absolute;
                  top: 2cm;
                  right: 2cm;
                  width: 3cm;
                  height: 3cm;
                  border: 2px solid #1a365d;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8pt;
                  font-weight: bold;
                  color: #1a365d;
                  text-align: center;
                  line-height: 1.2;
              }
          </style>
      </head>
      <body>
          <div class="document-container">
              <div class="watermark">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
              <div class="official-seal">RÉPUBLIQUE<br>DE CÔTE<br>D'IVOIRE</div>
              
              <div class="header">
                  <div class="header-title">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
                  <div class="header-subtitle">MINISTÈRE DE L'INTÉRIEUR ET DE LA SÉCURITÉ</div>
                  <div class="header-subtitle">DIRECTION GÉNÉRALE DE L'ÉTAT CIVIL</div>
                  <div class="header-address">Mairie d'Abidjan</div>
              </div>
              
              <div class="document-number">
                  N° ${acteData.numeroActe} du ${formatDate(acteData.dateCreation)}
              </div>
              
              <div class="main-title">
                  ${acteData.typeActe.toUpperCase()}
              </div>
              
              <div class="person-name">
                  ${dossier.prenomUsager} ${dossier.nomUsager}
              </div>
              
              <div class="content-section">
                  <div class="content-line">
                      Le <span class="highlight">${formatDate(dossier.dateNaissance)}</span> à <span class="fill-space">${acteData.heureNaissance || '14h30'}</span>
                  </div>
                  
                  <div class="content-line">
                      Est né(e) à <span class="highlight">${dossier.lieuNaissance || 'Abidjan'}</span>
                  </div>
                  
                  <div class="content-line">
                      L'enfant <span class="highlight">${dossier.prenomUsager} ${dossier.nomUsager}</span>
                  </div>
                  
                  <div class="content-line">
                      De sexe <span class="fill-space">${dossier.sexe || 'féminin'}</span>
                  </div>
                  
                  <div class="content-line">
                      Domicilié(e) à <span class="fill-space">${dossier.adresse || 'Abidjan'}</span>
                  </div>
              </div>
              
              <div class="parents-section">
                  <div class="parent-info">
                      <strong>Père :</strong> ${acteData.nomPere || 'Non renseigné'}, 
                      né le ${formatDate(acteData.dateNaissancePere) || 'Non renseigné'}, 
                      à ${acteData.lieuNaissancePere || 'Non renseigné'}, 
                      ${acteData.professionPere || 'Non renseigné'}, 
                      domicilié à ${acteData.adressePere || 'Non renseigné'}
                  </div>
                  
                  <div class="parent-info">
                      <strong>Mère :</strong> ${acteData.nomMere || 'Non renseigné'}, 
                      née le ${formatDate(acteData.dateNaissanceMere) || 'Non renseigné'}, 
                      à ${acteData.lieuNaissanceMere || 'Non renseigné'}, 
                      ${acteData.professionMere || 'Non renseigné'}, 
                      domiciliée à ${acteData.adresseMere || 'Non renseigné'}
                  </div>
              </div>
              
              <div class="certification-section">
                  <div class="certification-text">
                      Certifie le présent acte conforme aux indications<br>
                      contenues dans le registre de l'état civil.
                  </div>
                  
                  <div class="certification-location">
                      Délivré à <span class="highlight">${acteData.lieuCreation}</span>, le <span class="highlight">${formatDate(acteData.dateCreation)}</span>
                  </div>
              </div>
              
              <div class="signature-section">
                  <div class="signature-line">L'Officier de l'État Civil</div>
                  <div class="signature-line">Mairie d'Abidjan</div>
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

  const generatePDF = async () => {
    const htmlContent = generateOriginalActeHTML();
    
    // Créer un élément temporaire pour le rendu
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${acteData.typeActe}_${dossier.nomUsager}_${dossier.prenomUsager}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Création d'Acte Original - {dossier.nomUsager} {dossier.prenomUsager}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de l'acte */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Informations de l'Acte</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'Acte *
                  </label>
                  <select
                    value={acteData.typeActe}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {typesActes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro d'Acte *
                  </label>
                  <input
                    type="text"
                    value={acteData.numeroActe}
                    onChange={(e) => setActeData({...acteData, numeroActe: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: N-2024-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de Création *
                  </label>
                  <input
                    type="date"
                    value={acteData.dateCreation}
                    onChange={(e) => setActeData({...acteData, dateCreation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lieu de Création *
                  </label>
                  <input
                    type="text"
                    value={acteData.lieuCreation}
                    onChange={(e) => setActeData({...acteData, lieuCreation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: ABIDJAN"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officier de l'État Civil *
                  </label>
                  <input
                    type="text"
                    value={acteData.officier}
                    onChange={(e) => setActeData({...acteData, officier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'officier"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informations des parents */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Informations des Parents</h4>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-medium text-gray-800 mb-3">Père</h5>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={acteData.nomPere}
                      onChange={(e) => setActeData({...acteData, nomPere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du père"
                    />
                    <input
                      type="date"
                      value={acteData.dateNaissancePere}
                      onChange={(e) => setActeData({...acteData, dateNaissancePere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={acteData.lieuNaissancePere}
                      onChange={(e) => setActeData({...acteData, lieuNaissancePere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lieu de naissance"
                    />
                    <input
                      type="text"
                      value={acteData.professionPere}
                      onChange={(e) => setActeData({...acteData, professionPere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Profession"
                    />
                    <input
                      type="text"
                      value={acteData.adressePere}
                      onChange={(e) => setActeData({...acteData, adressePere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adresse"
                    />
                  </div>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <h5 className="font-medium text-gray-800 mb-3">Mère</h5>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={acteData.nomMere}
                      onChange={(e) => setActeData({...acteData, nomMere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom de la mère"
                    />
                    <input
                      type="date"
                      value={acteData.dateNaissanceMere}
                      onChange={(e) => setActeData({...acteData, dateNaissanceMere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={acteData.lieuNaissanceMere}
                      onChange={(e) => setActeData({...acteData, lieuNaissanceMere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lieu de naissance"
                    />
                    <input
                      type="text"
                      value={acteData.professionMere}
                      onChange={(e) => setActeData({...acteData, professionMere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Profession"
                    />
                    <input
                      type="text"
                      value={acteData.adresseMere}
                      onChange={(e) => setActeData({...acteData, adresseMere: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adresse"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations
            </label>
            <textarea
              value={acteData.observations}
              onChange={(e) => setActeData({...acteData, observations: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Observations particulières..."
            />
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={generatePDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Générer PDF
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Créer l'Acte
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulaireActeOriginal;
