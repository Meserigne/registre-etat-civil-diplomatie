import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const FormValidation = () => {
  const [validations, setValidations] = useState({});

  // Règles de validation
  const validationRules = {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Format d\'email invalide'
    },
    phone: {
      pattern: /^[\+]?[0-9\s\-\(\)]{8,}$/,
      message: 'Numéro de téléphone invalide'
    },
    required: {
      test: (value) => value && value.trim().length > 0,
      message: 'Ce champ est obligatoire'
    },
    minLength: (min) => ({
      test: (value) => value && value.length >= min,
      message: `Minimum ${min} caractères`
    }),
    maxLength: (max) => ({
      test: (value) => value && value.length <= max,
      message: `Maximum ${max} caractères`
    }),
    date: {
      test: (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      message: 'Date invalide'
    },
    futureDate: {
      test: (value) => {
        if (!value) return true;
        const date = new Date(value);
        return date > new Date();
      },
      message: 'La date doit être dans le futur'
    },
    pastDate: {
      test: (value) => {
        if (!value) return true;
        const date = new Date(value);
        return date <= new Date();
      },
      message: 'La date doit être dans le passé'
    },
    numeric: {
      pattern: /^\d+$/,
      message: 'Valeur numérique requise'
    },
    alphanumeric: {
      pattern: /^[a-zA-Z0-9\s]+$/,
      message: 'Caractères alphanumériques uniquement'
    }
  };

  // Valider un champ
  const validateField = (fieldName, value, rules = []) => {
    const errors = [];

    rules.forEach(rule => {
      let validationRule;
      
      if (typeof rule === 'string') {
        validationRule = validationRules[rule];
      } else if (typeof rule === 'function') {
        validationRule = rule;
      } else {
        validationRule = rule;
      }

      if (validationRule) {
        let isValid = true;
        
        if (validationRule.pattern) {
          isValid = validationRule.pattern.test(value);
        } else if (validationRule.test) {
          isValid = validationRule.test(value);
        }

        if (!isValid) {
          errors.push(validationRule.message);
        }
      }
    });

    setValidations(prev => ({
      ...prev,
      [fieldName]: {
        isValid: errors.length === 0,
        errors
      }
    }));

    return errors.length === 0;
  };

  // Valider un formulaire complet
  const validateForm = (formData, validationSchema) => {
    const errors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(field => {
      const value = formData[field];
      const rules = validationSchema[field];
      
      const fieldErrors = [];
      rules.forEach(rule => {
        let validationRule;
        
        if (typeof rule === 'string') {
          validationRule = validationRules[rule];
        } else if (typeof rule === 'function') {
          validationRule = rule;
        } else {
          validationRule = rule;
        }

        if (validationRule) {
          let fieldValid = true;
          
          if (validationRule.pattern) {
            fieldValid = validationRule.pattern.test(value);
          } else if (validationRule.test) {
            fieldValid = validationRule.test(value);
          }

          if (!fieldValid) {
            fieldErrors.push(validationRule.message);
          }
        }
      });

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  };

  // Composant de champ avec validation
  const ValidatedField = ({ 
    name, 
    value, 
    onChange, 
    rules = [], 
    label, 
    type = 'text', 
    placeholder,
    className = '',
    ...props 
  }) => {
    const [isTouched, setIsTouched] = useState(false);
    const fieldValidation = validations[name];

    useEffect(() => {
      if (isTouched) {
        validateField(name, value, rules);
      }
    }, [value, isTouched, name, rules]);

    const handleBlur = () => {
      setIsTouched(true);
      validateField(name, value, rules);
    };

    const handleChange = (e) => {
      onChange(e);
      if (isTouched) {
        validateField(name, e.target.value, rules);
      }
    };

    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${fieldValidation && isTouched ? 
                (fieldValidation.isValid ? 
                  'border-green-300 focus:ring-green-500' : 
                  'border-red-300 focus:ring-red-500'
                ) : 
                'border-gray-300'
              }
            `}
            {...props}
          />
          {fieldValidation && isTouched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {fieldValidation.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {fieldValidation && isTouched && !fieldValidation.isValid && (
          <div className="mt-1">
            {fieldValidation.errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Hook personnalisé pour la validation
  const useFormValidation = (initialData = {}, validationSchema = {}) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const updateField = (field, value) => {
      const newData = { ...formData, [field]: value };
      setFormData(newData);
      
      // Valider le champ
      if (validationSchema[field]) {
        const fieldErrors = [];
        validationSchema[field].forEach(rule => {
          let validationRule;
          
          if (typeof rule === 'string') {
            validationRule = validationRules[rule];
          } else if (typeof rule === 'function') {
            validationRule = rule;
          } else {
            validationRule = rule;
          }

          if (validationRule) {
            let fieldValid = true;
            
            if (validationRule.pattern) {
              fieldValid = validationRule.pattern.test(value);
            } else if (validationRule.test) {
              fieldValid = validationRule.test(value);
            }

            if (!fieldValid) {
              fieldErrors.push(validationRule.message);
            }
          }
        });

        setErrors(prev => ({
          ...prev,
          [field]: fieldErrors
        }));
      }

      // Valider le formulaire complet
      const validation = validateForm(newData, validationSchema);
      setIsValid(validation.isValid);
    };

    const validateForm = () => {
      const validation = validateForm(formData, validationSchema);
      setErrors(validation.errors);
      setIsValid(validation.isValid);
      return validation.isValid;
    };

    const resetForm = () => {
      setFormData(initialData);
      setErrors({});
      setIsValid(false);
    };

    return {
      formData,
      errors,
      isValid,
      updateField,
      validateForm,
      resetForm
    };
  };

  return {
    validateField,
    validateForm,
    ValidatedField,
    useFormValidation,
    validationRules
  };
};

export default FormValidation; 