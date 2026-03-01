
import React from 'react';
import Navbar from '../components/Navbar';
import StudentsSection from '../components/StudentsSection';
import OrgHierarchyExplorer from '../components/OrgHierarchyExplorer';
import Footer from '../components/Footer';

const ForStudentsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <StudentsSection />
        <OrgHierarchyExplorer />
      </div>
      <Footer />
    </div>
  );
};

export default ForStudentsPage;
