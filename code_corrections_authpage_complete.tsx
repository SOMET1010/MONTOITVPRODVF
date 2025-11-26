// ========================================
// CORRECTIONS FRONTEND - AUTHENTIFICATION MONTOIT
// Fichier: src/features/auth/pages/AuthPage.tsx (corrigé)
// Date: 26 novembre 2025
// Problème: HTTP 500 "Database error saving new user"
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/client';

// ✅ CORRECTION 1: Messages d'erreur en français
const FRENCH_MESSAGES = {
  validation: {
    email: {
      required: 'L\'adresse email est obligatoire',
      invalid: 'L\'adresse email doit être valide (ex: utilisateur@domaine.com)',
      format: 'L\'adresse email doit contenir @ et un domaine valide'
    },
    phone: {
      required: 'Le numéro de téléphone est obligatoire',
      invalid: 'Numéro invalide. Format: +225 XX XX XX XX XX',
      length: 'Le numéro doit contenir 10 chiffres'
    },
    password: {
      required: 'Le mot de passe est obligatoire',
      weak: 'Mot de passe faible. Utilisez au moins 8 caractères avec majuscules, minuscules, chiffres et symboles',
      mismatch: 'Les mots de passe ne correspondent pas'
    },
    name: {
      required: 'Le nom est obligatoire',
      minLength: 'Le nom doit contenir au moins 2 caractères'
    },
    general: {
      networkError: 'Erreur de connexion. Vérifiez votre connexion internet.',
      serverError: 'Erreur du serveur. Veuillez réessayer plus tard.',
      unexpectedError: 'Une erreur inattendue s\'est produite.'
    }
  },
  success: {
    inscription: 'Inscription réussie ! Vérifiez vos emails ou messages pour confirmer votre compte.',
    otpSent: 'Code de vérification envoyé avec succès !'
  }
};

// ✅ CORRECTION 2: Fonctions de validation améliorées
const validateEmail = (email: string) => {
  if (!email) return { valid: false, message: FRENCH_MESSAGES.validation.email.required };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: FRENCH_MESSAGES.validation.email.invalid };
  }
  
  return { valid: true, message: '' };
};

const validatePhone = (phone: string) => {
  if (!phone) return { valid: false, message: FRENCH_MESSAGES.validation.phone.required };
  
  // Format ivoirien +225 XX XX XX XX XX
  const phoneRegex = /^(\+225|0)?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, message: FRENCH_MESSAGES.validation.phone.invalid };
  }
  
  return { valid: true, message: '' };
};

// ✅ CORRECTION 3: Fonction validatePassword corrigée
const validatePassword = (pwd: string) => {
  const hasMinLength = pwd.length >= 8;
  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasLowerCase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;

  // ✅ CORRECTION CRITIQUE: Vérifier TOUS les critères pour le statut 'valid'
  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

  let message = '';
  let color = 'text-red-600';

  if (score <= 2) {
    message = 'Mot de passe faible';
    color = 'text-red-600';
  } else if (score === 3 || score === 4) {
    message = 'Mot de passe moyen';
    color = 'text-amber-600';
  } else {
    message = 'Mot de passe fort';
    color = 'text-green-600';
  }

  return { score, message, color, valid: isValid };
};

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  // États du formulaire
  const [isSignUp, setIsSignUp] = useState(true);
  const [verificationType, setVerificationType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+225 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // États de validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState<any>({ score: 0, message: '', color: '', valid: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ CORRECTION 4: Validation en temps réel avec messages français
  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
      
      // Vérifier la cohérence avec confirmPassword
      if (confirmPassword && password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: FRENCH_MESSAGES.validation.password.mismatch }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  }, [password, confirmPassword]);

  const handleInputChange = (field: string, value: string) => {
    // Validation immédiate avec messages français
    let fieldError = '';
    
    switch (field) {
      case 'email':
        if (value) {
          const emailValidation = validateEmail(value);
          fieldError = emailValidation.valid ? '' : emailValidation.message;
        }
        break;
        
      case 'phone':
        if (value) {
          const phoneValidation = validatePhone(value);
          fieldError = phoneValidation.valid ? '' : phoneValidation.message;
        }
        break;
        
      case 'fullName':
        if (value && value.length < 2) {
          fieldError = FRENCH_MESSAGES.validation.name.minLength;
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: fieldError }));
    
    // Mettre à jour l'état du champ
    switch (field) {
      case 'fullName': setFullName(value); break;
      case 'phone': setPhone(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
    }
  };

  // ✅ CORRECTION 5: Fonction d'envoi OTP améliorée
  const sendVerificationCode = async (params: {
    email?: string;
    phone?: string;
    type: 'email' | 'sms' | 'whatsapp';
    name: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: {
          ...params,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('OTP Function Error:', error);
        throw new Error(`Erreur OTP: ${error.message}`);
      }

      if (!data || data.success !== true) {
        console.error('OTP Response:', data);
        throw new Error('Réponse invalide du service OTP');
      }

      return { success: true, data };
    } catch (err: any) {
      console.error('OTP Send Failed:', err);
      throw err;
    }
  };

  // ✅ CORRECTION 6: Fonction de navigation OTP robuste
  const navigateToOTP = (userData: any) => {
    try {
      const methodName = verificationType === 'email' ? 'email' : 
                        verificationType === 'whatsapp' ? 'WhatsApp' : 'SMS';
      
      setSuccess(`Inscription réussie ! Code de vérification envoyé par ${methodName}`);
      
      // ✅ CORRECTION: Redirection robuste avec gestion d'erreur
      setTimeout(() => {
        try {
          navigate('/verification-otp', {
            state: {
              email: verificationType === 'email' ? email : undefined,
              phone: (verificationType === 'sms' || verificationType === 'whatsapp') ? phone : undefined,
              type: verificationType,
              name: fullName,
              userId: userData.user?.id
            },
            replace: true
          });
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback: forcer la redirection
          window.location.href = '/verification-otp';
        }
      }, 2000);
    } catch (error) {
      console.error('Erreur navigation OTP:', error);
      setError('Inscription réussie mais erreur de redirection. Veuillez actualiser la page.');
    }
  };

  // ✅ CORRECTION 7: Fonction handleSubmit robuste avec gestion d'erreur complète
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validation complète
      const newErrors: Record<string, string> = {};

      if (!fullName.trim()) newErrors.fullName = FRENCH_MESSAGES.validation.name.required;
      if (!email.trim() && verificationType === 'email') {
        newErrors.email = FRENCH_MESSAGES.validation.email.required;
      }
      if (!phone.trim() && (verificationType === 'sms' || verificationType === 'whatsapp')) {
        newErrors.phone = FRENCH_MESSAGES.validation.phone.required;
      }
      
      // Validation email si méthode email
      if (verificationType === 'email' && email) {
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) newErrors.email = emailValidation.message;
      }
      
      // Validation téléphone si méthode SMS/WhatsApp
      if ((verificationType === 'sms' || verificationType === 'whatsapp') && phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) newErrors.phone = phoneValidation.message;
      }

      // Validation mot de passe seulement pour l'inscription email
      if (verificationType === 'email') {
        if (!password) {
          newErrors.password = FRENCH_MESSAGES.validation.password.required;
        } else if (!passwordValidation.valid) {
          newErrors.password = FRENCH_MESSAGES.validation.password.weak;
        }
        if (password !== confirmPassword) {
          newErrors.confirmPassword = FRENCH_MESSAGES.validation.password.mismatch;
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Préparer les données d'inscription
      const signUpData: any = {
        data: {
          full_name: fullName.trim(),
          verification_type: verificationType
        }
      };

      let authResult;

      if (verificationType === 'email') {
        signUpData.email = email.trim();
        signUpData.password = password;
        
        const { data, error } = await supabase.auth.signUp(signUpData);
        if (error) throw error;
        authResult = { data, error: null };
      } else {
        // Pour SMS et WhatsApp, utiliser l'inscription par téléphone
        signUpData.phone = phone.trim();
        
        const { data, error } = await supabase.auth.signUp({
          phone: phone.trim(),
          options: {
            data: {
              full_name: fullName.trim(),
              verification_type: verificationType
            }
          }
        });
        if (error) throw error;
        authResult = { data, error: null };
      }

      // ✅ CORRECTION 8: Envoi du code OTP après inscription réussie
      if (authResult.data?.user) {
        try {
          const otpResult = await sendVerificationCode({
            email: verificationType === 'email' ? email.trim() : undefined,
            phone: (verificationType === 'sms' || verificationType === 'whatsapp') ? phone.trim() : undefined,
            type: verificationType,
            name: fullName.trim()
          });

          // Vérifier explicitement le succès
          if (!otpResult.success) {
            throw new Error('Échec de l\'envoi du code OTP');
          }

          // Navigation vers la page OTP
          navigateToOTP(authResult.data);

        } catch (otpErr: any) {
          console.error('Complete OTP flow error:', otpErr);
          setError(`Inscription réussie mais ${otpErr.message}. Vérifiez vos informations et réessayez.`);
          setIsLoading(false);
          return;
        }
      }

    } catch (err: any) {
      console.error('Erreur inscription:', err);
      
      // ✅ CORRECTION 9: Gestion d'erreur améliorée avec messages français
      let errorMessage = FRENCH_MESSAGES.validation.general.unexpectedError;
      
      if (err.message?.includes('Database error saving new user')) {
        errorMessage = 'Erreur de configuration du serveur. Les équipes techniques sont prévenues.';
      } else if (err.message?.includes('User already registered')) {
        errorMessage = 'Un compte existe déjà avec ces informations. Utilisez la connexion.';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = FRENCH_MESSAGES.validation.email.invalid;
      } else if (err.message?.includes('Invalid phone number')) {
        errorMessage = FRENCH_MESSAGES.validation.phone.invalid;
      } else if (err.message?.includes('Password')) {
        errorMessage = FRENCH_MESSAGES.validation.password.weak;
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = FRENCH_MESSAGES.validation.general.networkError;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu du composant...
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🏠 MONTOIT</h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Créez votre compte' : 'Connectez-vous à votre compte'}
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Méthodes de vérification */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Méthode de vérification
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'email', label: 'Email', icon: '📧' },
                { value: 'sms', label: 'SMS', icon: '📱' },
                { value: 'whatsapp', label: 'WhatsApp', icon: '💬' }
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setVerificationType(method.value as any)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    verificationType === method.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg">{method.icon}</div>
                  <div className="text-xs font-medium">{method.label}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom complet */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Votre nom complet"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email (seulement si méthode email) */}
            {verificationType === 'email' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            )}

            {/* Téléphone (pour SMS et WhatsApp) */}
            {(verificationType === 'sms' || verificationType === 'whatsapp') && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+225 01 23 45 67 89"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Mot de passe (seulement pour email) */}
            {verificationType === 'email' && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  
                  {/* Indicateur de force du mot de passe */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordValidation.score <= 2 ? 'bg-red-500' :
                              passwordValidation.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${passwordValidation.color}`}>
                          {passwordValidation.message}
                        </span>
                      </div>
                      
                      <div className="mt-1 text-xs text-gray-500">
                        <p>Le mot de passe doit contenir :</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                            Au moins 8 caractères
                          </li>
                          <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                            Une majuscule
                          </li>
                          <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                            Une minuscule
                          </li>
                          <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                            Un chiffre
                          </li>
                          <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                            Un symbole
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </div>
              ) : (
                isSignUp ? 'Créer mon compte' : 'Se connecter'
              )}
            </button>
          </form>

          {/* Liens de navigation */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? 'Se connecter' : 'S\'inscrire'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
