import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = 'Chargement...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    white: 'text-white'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Composant de skeleton pour les listes
const SkeletonItem = ({ lines = 1, height = 'h-4' }) => (
  <div className="animate-pulse">
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`bg-gray-200 rounded ${height} mb-2 ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Composant de skeleton pour les tableaux
const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-10 rounded-t mb-2" />
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-2 mb-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className={`bg-gray-200 rounded h-4 flex-1 ${
              colIndex === columns - 1 ? 'w-1/4' : ''
            }`}
          />
        ))}
      </div>
    ))}
  </div>
);

// Composant de skeleton pour les cartes
const SkeletonCard = ({ title = true, content = true, actions = false }) => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    {title && (
      <div className="bg-gray-200 h-6 rounded w-3/4 mb-4" />
    )}
    {content && (
      <div className="space-y-3">
        <div className="bg-gray-200 h-4 rounded w-full" />
        <div className="bg-gray-200 h-4 rounded w-5/6" />
        <div className="bg-gray-200 h-4 rounded w-4/6" />
      </div>
    )}
    {actions && (
      <div className="flex space-x-2 mt-4">
        <div className="bg-gray-200 h-8 rounded w-20" />
        <div className="bg-gray-200 h-8 rounded w-20" />
      </div>
    )}
  </div>
);

// Composant de skeleton pour les formulaires
const SkeletonForm = ({ fields = 4 }) => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <div className="bg-gray-200 h-4 rounded w-1/4 mb-2" />
        <div className="bg-gray-200 h-10 rounded w-full" />
      </div>
    ))}
    <div className="flex space-x-2 pt-4">
      <div className="bg-gray-200 h-10 rounded w-24" />
      <div className="bg-gray-200 h-10 rounded w-24" />
    </div>
  </div>
);

// Composant de skeleton pour les graphiques
const SkeletonChart = ({ height = 'h-64' }) => (
  <div className={`bg-gray-200 rounded ${height} animate-pulse`}>
    <div className="flex items-end justify-center h-full p-4 space-x-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 rounded-t w-8"
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

// Composant de skeleton pour les modales
const SkeletonModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-pulse">
      <div className="bg-gray-200 h-6 rounded w-3/4 mb-4" />
      <div className="space-y-3 mb-6">
        <div className="bg-gray-200 h-4 rounded w-full" />
        <div className="bg-gray-200 h-4 rounded w-5/6" />
        <div className="bg-gray-200 h-4 rounded w-4/6" />
      </div>
      <div className="flex justify-end space-x-2">
        <div className="bg-gray-200 h-8 rounded w-20" />
        <div className="bg-gray-200 h-8 rounded w-20" />
      </div>
    </div>
  </div>
);

export {
  LoadingSpinner,
  SkeletonItem,
  SkeletonTable,
  SkeletonCard,
  SkeletonForm,
  SkeletonChart,
  SkeletonModal
}; 