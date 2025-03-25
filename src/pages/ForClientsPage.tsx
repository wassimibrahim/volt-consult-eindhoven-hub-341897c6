
import React from 'react';
import Navbar from '../components/Navbar';
import ServicesSection from '../components/ServicesSection';
import ClientsSection from '../components/ClientsSection';
import Footer from '../components/Footer';

const ForClientsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <ServicesSection />
        <ClientsSection />
      </div>
      <Footer />
    </div>
  );
};

export default ForClientsPage;
