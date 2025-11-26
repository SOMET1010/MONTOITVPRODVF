import React from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import ContactForm from '../components/ContactForm';
import FeatureCard from '../../../shared/components/FeatureCard';

const ContactPage: React.FC = () => {
  return (
    <PageLayout>
      <Breadcrumb items={[
        { label: 'Accueil', href: '/' },
        { label: 'Contact', href: '/contact' }
      ]} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contactez-nous</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <ContactForm />
          
          <div className="space-y-6">
            <FeatureCard 
              title="Email"
              description="contact@montoit.ci"
              icon="mail"
            />
            <FeatureCard 
              title="Téléphone"
              description="+225 XX XX XX XX"
              icon="phone"
            />
            <FeatureCard 
              title="Adresse"
              description="Abidjan, Côte d'Ivoire"
              icon="map-pin"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;