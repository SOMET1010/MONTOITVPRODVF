// CORRECTIONS POUR src/features/auth/pages/AuthPage.tsx
// ===================================================================

// 1. CORRECTION: Fonction de validation d'email avec messages en français
// Remplacer la fonction validateEmail existante (ligne ~55) :

const validateEmailWithMessages = (email: string) => {
  if (!email) {
    return { valid: false, message: 'L\'adresse email est obligatoire' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      valid: false, 
      message: 'L\'adresse email doit contenir un symbole @ et un domaine valide (ex: nom@domaine.com)' 
    };
  }
  
  return { valid: true, message: '' };
};

// 2. CORRECTION: Validation mot de passe cohérente
// Remplacer la fonction validatePassword existante (ligne ~40) :

const validatePassword = (pwd: string) => {
  const hasMinLength = pwd.length >= 8;
  const hasUpperCase = /[A-Z]/.test(pwd);
  const hasLowerCase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;

  // CORRECTION CRITIQUE: Tous les critères doivent être validés pour le statut 'valid'
  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

  if (score <= 2) {
    return { score, message: 'Mot de passe faible', color: 'text-red-600', valid: isValid };
  } else if (score === 3 || score === 4) {
    return { score, message: 'Mot de passe moyen', color: 'text-amber-600', valid: isValid };
  } else {
    return { score, message: 'Mot de passe fort', color: 'text-green-600', valid: isValid };
  }
};

// 3. CORRECTION: Fonction helper pour envoi OTP robuste
// Ajouter cette nouvelle fonction après validatePhone (ligne ~65) :

const sendVerificationCode = async (params: {
  email?: string;
  phone?: string;
  type: 'email' | 'sms' | 'whatsapp';
  name: string;
}) => {
  try {
    console.log('Sending verification code with params:', params);
    
    const { data, error } = await supabase.functions.invoke('send-verification-code', {
      body: {
        ...params,
        timestamp: new Date().toISOString(),
        retry_count: 0
      }
    });

    if (error) {
      console.error('OTP Function Error:', error);
      throw new Error(`Erreur service OTP: ${error.message || 'Service indisponible'}`);
    }

    if (!data) {
      throw new Error('Aucune réponse du service OTP');
    }

    if (data.success !== true) {
      console.error('OTP Response not successful:', data);
      throw new Error(data.error || 'Échec de l\'envoi du code OTP');
    }

    console.log('OTP sent successfully:', data);
    return { success: true, data };
  } catch (err: any) {
    console.error('Complete OTP flow error:', err);
    throw err;
  }
};

// 4. CORRECTION: Utilisation de la nouvelle validation email
// Dans handleSubmit, ligne ~140, remplacer :

        // Validation email uniquement si inscription par email
        if (verificationType === 'email') {
          const emailValidation = validateEmailWithMessages(email);
          if (!emailValidation.valid) {
            setError(emailValidation.message);
            setLoading(false);
            return;
          }
        }

// Au lieu de :
        // Validation email uniquement si inscription par email
        if (verificationType === 'email') {
          if (!email || !validateEmail(email)) {
            setError('Adresse email invalide. Veuillez entrer une adresse email valide.');
            return;
          }
        }

// 5. CORRECTION: Amélioration de la validation mot de passe
// Dans handleSubmit, ligne ~180, remplacer :

          const pwdValidation = validatePassword(password);
          if (!pwdValidation.valid) {
            const errorMessages = [];
            if (password.length < 8) errorMessages.push('au moins 8 caractères');
            if (!/[A-Z]/.test(password)) errorMessages.push('une majuscule');
            if (!/[a-z]/.test(password)) errorMessages.push('une minuscule');
            if (!/[0-9]/.test(password)) errorMessages.push('un chiffre');
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errorMessages.push('un caractère spécial');
            
            setError(`Le mot de passe doit contenir ${errorMessages.join(', ')}.`);
            return;
          }

// 6. CORRECTION: Redirection robuste après inscription
// Dans handleSubmit, ligne ~290, remplacer le bloc try-catch OTP par :

        // Envoyer le code OTP avec la nouvelle fonction
        const finalVerificationType = verificationType;
        const finalEmail = verificationType === 'email' ? email : undefined;
        const finalPhone = (verificationType === 'sms' || verificationType === 'whatsapp') ? phone : undefined;
        
        try {
          const otpResult = await sendVerificationCode({
            email: finalEmail,
            phone: finalPhone,
            type: finalVerificationType,
            name: fullName
          });

          if (!otpResult.success) {
            throw new Error('Échec de l\'envoi du code OTP');
          }

          const methodName = finalVerificationType === 'email' ? 'email' : 
                            finalVerificationType === 'whatsapp' ? 'WhatsApp' : 'SMS';
          setSuccess(`Inscription réussie ! Code de vérification envoyé par ${methodName}`);
          
          // CORRECTION: Redirection robuste avec gestion d'erreur
          setTimeout(() => {
            try {
              console.log('Navigating to verification page...');
              navigate('/verification-otp', {
                state: {
                  email: finalEmail,
                  phone: finalPhone,
                  type: finalVerificationType,
                  name: fullName,
                  timestamp: new Date().toISOString()
                },
                replace: true
              });
            } catch (navError) {
              console.error('Navigation error, using fallback:', navError);
              // Fallback: redirection forcée
              window.location.href = '/verification-otp';
            }
          }, 1500);
          
        } catch (otpErr: any) {
          console.error('OTP error in final block:', otpErr);
          setError(`Inscription réussie mais ${otpErr.message}. Vérifiez vos informations et réessayez ou contactez le support.`);
          setLoading(false);
          return;
        }

// 7. CORRECTION AMÉLIORÉE: Persistance des données pour la vérification
// Ajouter après la ligne de setSuccess dans le bloc OTP :

          // CORRECTION: Sauvegarder les données pour la page de vérification
          sessionStorage.setItem('pending_verification', JSON.stringify({
            email: finalEmail,
            phone: finalPhone,
            type: finalVerificationType,
            name: fullName,
            created_at: new Date().toISOString()
          }));

// 8. CORRECTION: Validation du numéro de téléphone cohérente
// Dans validatePhone, ligne ~60, s'assurer que la regex correspond au format attendu :

const validatePhone = (phone: string) => {
  // CORRECTION: Acceptation du format +225 XX XX XX XX XX et XX XX XX XX XX
  const phoneRegex = /^(\+225\s?)?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
  return phoneRegex.test(phone);
};

// 9. NETTOYAGE: Supprimer les imports non utilisés
// S'assurer que ces imports sont présents :
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { supabase } from '@/services/supabase/client';
// ... autres imports ...

// 10. AMÉLIORATION UX: Feedback de chargement pendant l'envoi OTP
// Dans le bouton submit, s'assurer que le texte indique clairement l'étape :
{
  loading ? (
    <span className="flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
      <span>
        {isLogin ? 'Connexion...' : 
         isForgotPassword ? 'Envoi...' : 
         'Inscription et envoi du code...'}
      </span>
    </span>
  ) : /* ... reste du bouton ... */
}

// ===================================================================
// NOTES DE DÉPLOIEMENT:
// 1. Tester chaque correction individuellement
// 2. Vérifier la cohérence des messages d'erreur
// 3. Tester le flux complet d'inscription avec chaque méthode
// 4. Vérifier les logs console pour debugging
// ===================================================================
