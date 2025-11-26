// Pages
export { default as ContactPage } from './ContactPage';
export { default as HelpPage } from './HelpPage';
export { default as FAQPage } from './FAQPage';

// Export depuis le dossier components
export { default as ContactForm } from '../components/ContactForm';
export { default as FAQAccordion } from '../components/FAQAccordion';

// Export depuis le dossier hooks
export { default as useContact } from '../hooks/useContact';
export { default as useHelp } from '../hooks/useHelp';
export { default as useFAQ } from '../hooks/useFAQ';

// Export depuis le dossier services
export { default as contactService, ContactService } from '../services/contactService';
export { 
  helpService, 
  type HelpSection, 
  type TutorialItem, 
  type HelpArticle 
} from '../services/helpService';

// Types
export type {
  ContactFormData,
  ContactResponse
} from '../hooks/useContact';

export type {
  HelpSection,
  TutorialItem,
  HelpArticle
} from '../services/helpService';

export type {
  FAQItem,
  FAQCategory,
  FAQSearchResult,
  UseFAQReturn
} from '../hooks/useFAQ';

export type {
  ContactSubmission,
  ContactResponse as ContactServiceResponse
} from '../services/contactService';