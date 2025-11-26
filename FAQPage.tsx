import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FAQAccordion from '../components/FAQAccordion';

const FAQPage: React.FC = () => {
  const faqCategories = [
    {
      title: "Compte et Authentification",
      questions: [
        {
          question: "Comment créer un compte ?",
          answer: "Pour créer un compte, cliquez sur 'S'inscrire' et suivez les étapes. Vous pouvez vous inscrire avec votre email ou votre numéro de téléphone."
        },
        {
          question: "J'ai oublié mon mot de passe, que faire ?",
          answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Un lien de réinitialisation sera envoyé à votre email."
        },
        {
          question: "Comment vérifier mon compte ?",
          answer: "Vous recevrez un code de vérification par SMS ou email. Saisissez ce code pour valider votre compte."
        }
      ]
    },
    {
      title: "Recherche et Propriétés",
      questions: [
        {
          question: "Comment rechercher une propriété ?",
          answer: "Utilisez la barre de recherche sur la page d'accueil. Vous pouvez filtrer par ville, type de bien, prix et superficie."
        },
        {
          question: "Y a-t-il des frais pour rechercher ?",
          answer: "Non, la recherche est entièrement gratuite. Vous pouvez consulter toutes les propriétés disponibles sans frais."
        },
        {
          question: "Puis-je sauvegarder mes recherches ?",
          answer: "Oui, connectez-vous et cliquez sur l'étoile dans les résultats pour sauvegarder votre recherche favorite."
        }
      ]
    },
    {
      title: "Propriétaires",
      questions: [
        {
          question: "Comment ajouter une propriété ?",
          answer: "Connectez-vous et cliquez sur 'Je loue mon bien'. Suivez les étapes pour compléter votre annonce avec photos et détails."
        },
        {
          question: "Quels sont les frais ?",
          answer: "L'ajout de propriété est gratuit. Nous ne prenons aucune commission sur les transactions."
        },
        {
          question: "Mes annonces sont-elles validées ?",
          answer: "Toutes les annonces sont vérifiées par notre équipe pour garantir leur qualité et authenticité."
        }
      ]
    }
  ];

  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Aide', href: '/help' },
        { label: 'FAQ', href: '/faq' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Questions Fréquemment Posées</h1>
        
        {faqCategories.map((category, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <FAQAccordion questions={category.questions} />
          </section>
        ))}
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-gray-600 mb-4">Notre équipe est là pour vous aider.</p>
          <a href="/contact" className="btn-primary">Contactez-nous</a>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQPage;