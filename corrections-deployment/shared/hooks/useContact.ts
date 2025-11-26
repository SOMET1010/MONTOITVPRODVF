import { useState } from 'react';
import { contactService } from '../services/contactService';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

export const useContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContact = async (formData: ContactFormData): Promise<ContactResponse> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation côté client
      if (!formData.name.trim()) {
        throw new Error('Le nom est requis');
      }
      
      if (!formData.email.trim()) {
        throw new Error('L\'email est requis');
      }
      
      if (!formData.subject) {
        throw new Error('Le sujet est requis');
      }
      
      if (!formData.message.trim()) {
        throw new Error('Le message est requis');
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez saisir une adresse email valide');
      }

      // Validation longueur message
      if (formData.message.trim().length < 10) {
        throw new Error('Le message doit contenir au moins 10 caractères');
      }

      // Soumission via le service
      const response = await contactService.submitContact(formData);
      
      if (response.success) {
        setSuccess(true);
        return {
          success: true,
          message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
          id: response.id
        };
      } else {
        throw new Error(response.message || 'Erreur lors de l\'envoi du message');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetStates = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    submitContact,
    isLoading,
    error,
    success,
    resetStates
  };
};

export default useContact;