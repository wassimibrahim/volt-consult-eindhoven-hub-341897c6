
import React from 'react';
import Navbar from '../components/Navbar';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const PartnersPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <div className="container-custom pt-8 pb-4">
          <h1 className="heading-lg text-center text-volt-dark">
            <span className="text-[#ff0000] font-bold">For Partners</span>
          </h1>
        </div>
        <PartnersSection />
      </div>
      <Footer />
    </div>
  );
};

export default PartnersPage;
