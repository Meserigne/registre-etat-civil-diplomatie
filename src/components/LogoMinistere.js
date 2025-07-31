import React from 'react';

const LogoMinistere = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Blason officiel de la Côte d'Ivoire - Image exacte */}
        <img 
          src={process.env.PUBLIC_URL + "/blason-officiel.jpg"} 
          alt="Blason officiel de la Côte d'Ivoire"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback si l'image n'est pas trouvée
            console.log('Erreur de chargement du logo:', e.target.src);
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback si l'image n'est pas disponible */}
        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center hidden">
          <div className="text-xs text-gray-600 font-medium text-center">
            🏛️<br/>
            Blason<br/>
            Officiel
          </div>
        </div>
      </div>
    </div>
  );
};

// Logo avec texte officiel
const LogoMinistereComplet = ({ size = 'md', showText = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMinistere size={size} />
      {showText && (
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-green-800 leading-tight">
            RÉPUBLIQUE DE CÔTE D'IVOIRE
          </h1>
          <h2 className="text-xs font-semibold text-green-700 leading-tight">
            MINISTÈRE DES AFFAIRES ÉTRANGÈRES
          </h2>
        </div>
      )}
    </div>
  );
};

// Logo pour l'en-tête de l'application
const LogoHeader = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <LogoMinistere size="md" />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-green-800 leading-tight">
          RÉPUBLIQUE DE CÔTE D'IVOIRE
        </h1>
        <h2 className="text-sm font-semibold text-green-700 leading-tight">
          MINISTÈRE DES AFFAIRES ÉTRANGÈRES
        </h2>
        <div className="flex gap-1 mt-1">
          <div className="w-3 h-0.5 bg-orange-500"></div>
          <div className="w-3 h-0.5 bg-green-600"></div>
        </div>
      </div>
    </div>
  );
};

// Logo pour le footer
const LogoFooter = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMinistere size="sm" />
      <div className="flex flex-col">
        <h3 className="text-xs font-bold text-green-800 leading-tight">
          CÔTE D'IVOIRE
        </h3>
        <p className="text-xs text-green-700 leading-tight">
          Ministère des Affaires Étrangères
        </p>
      </div>
    </div>
  );
};

export { LogoMinistere, LogoMinistereComplet, LogoHeader, LogoFooter };
export default LogoMinistere; 