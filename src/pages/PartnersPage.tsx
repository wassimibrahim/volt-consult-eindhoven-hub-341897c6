
import React from 'react';
import Navbar from '../components/Navbar';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <PartnersSection />
      </div>
      <Footer />
    </div>
  );
};

export default PartnersPage;
