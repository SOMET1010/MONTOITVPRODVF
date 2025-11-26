import { supabaseService } from '../../../shared/services/supabaseService';
import { ContactFormData } from '../hooks/useContact';

// Client Supabase avec vérification de disponibilité
const getSupabaseClient = () => {
  if (!supabaseService.isReady()) {
    throw new Error('Service Supabase non initialisé');
  }
  return supabaseService.getClient();
};

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at?: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  ip_address?: string;
  user_agent?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

export class ContactService {
  /**
   * Soumet un message de contact via Supabase
   */
  static async submitContact(formData: ContactFormData): Promise<ContactResponse> {
    try {
      // Validation des données
      const submission: ContactSubmission = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject,
        message: formData.message.trim(),
        submitted_at: new Date().toISOString(),
        status: 'new',
        ip_address: this.getClientIP(),
        user_agent: navigator.userAgent
      };

      // Insertion dans la base de données
      const { data, error } = await getSupabaseClient().from('contact_submissions')
        .insert([submission])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        
        // Gestion spécifique des erreurs
        if (error.code === '23505') {
          return {
            success: false,
            message: 'Un message avec cette adresse email a déjà été envoyé récemment. Veuillez attendre avant de renvoyer un message.'
          };
        }
        
        if (error.code === '23514') {
          return {
            success: false,
            message: 'Les données soumises ne sont pas valides. Veuillez vérifier vos informations.'
          };
        }

        return {
          success: false,
          message: 'Erreur lors de l\'enregistrement de votre message. Veuillez réessayer.'
        };
      }

      if (data) {
        // Optionnel : Envoyer une notification par email
        await this.sendNotificationEmail(data);
        
        // Optionnel : Ajouter à un log ou analytics
        await this.logContactSubmission(data);

        return {
          success: true,
          message: 'Votre message a été envoyé avec succès !',
          id: data.id
        };
      }

      return {
        success: false,
        message: 'Aucune réponse reçue du serveur. Veuillez réessayer.'
      };

    } catch (error) {
      console.error('Erreur inattendue:', error);
      
      return {
        success: false,
        message: 'Une erreur technique s\'est produite. Veuillez réessayer plus tard ou nous contacter directement.'
      };
    }
  }

  /**
   * Récupère les soumissions de contact (pour l'admin)
   */
  static async getContactSubmissions(status?: 'new' | 'read' | 'replied' | 'archived') {
    try {
      let query = getSupabaseClient().from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Met à jour le statut d'une soumission
   */
  static async updateSubmissionStatus(id: string, status: 'new' | 'read' | 'replied' | 'archived') {
    try {
      const { error } = await getSupabaseClient().from('contact_submissions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Statut mis à jour avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du statut'
      };
    }
  }

  /**
   * Obtient l'adresse IP du client (fallback si pas d'API disponible)
   */
  private static getClientIP(): string {
    // En production, vous pourriez utiliser un service comme ipify.org
    // ou récupérer l'IP depuis les headers de la requête
    return 'client-ip-not-available';
  }

  /**
   * Envoie une notification par email (optionnel)
   */
  private static async sendNotificationEmail(submission: ContactSubmission) {
    try {
      // Implémentation optionnelle avec un service d'email
      // comme SendGrid, Resend, ou Supabase Edge Functions
      
      console.log('Notification email à envoyer:', {
        to: 'contact@montoit.ci',
        subject: `Nouveau message de contact: ${submission.subject}`,
        data: submission
      });
      
    } catch (error) {
      console.warn('Impossible d\'envoyer la notification email:', error);
      // Ne pas faire échouer la soumission pour autant
    }
  }

  /**
   * Log de la soumission pour analytics
   */
  private static async logContactSubmission(submission: ContactSubmission) {
    try {
      // Optionnel : Enregistrer dans une table de logs ou analytics
      
      console.log('Contact submission logged:', {
        timestamp: new Date().toISOString(),
        submissionId: submission.id,
        subject: submission.subject,
        hasEmail: !!submission.email
      });
      
    } catch (error) {
      console.warn('Impossible d\'enregistrer le log:', error);
      // Ne pas faire échouer la soumission pour autant
    }
  }
}

export const contactService = ContactService;
export default contactService;