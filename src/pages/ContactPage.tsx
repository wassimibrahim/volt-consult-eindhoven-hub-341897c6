
import React from 'react';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <div className="container-custom pt-8 pb-4">
          <h1 className="heading-lg text-center text-volt-dark">
            <span className="text-[#ff0000] font-bold">Contact</span> <span>Us</span>
          </h1>
        </div>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
