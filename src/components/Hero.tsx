
import React from 'react';
import { ArrowRight, Zap, Globe, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-32 bg-gradient-to-br from-white to-volt-lightRed relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')] bg-cover bg-center opacity-5"></div>
      
      <div className="container-custom relative">
        {/* Logo and Company Name */}
        <div className="flex items-center justify-center mb-12">
          <img 
            src="/lovable-uploads/ac5e381f-7d1e-48d9-9a1a-17b134af0c5c.png" 
            alt="Volt Consulting Group Logo" 
            className="h-32 md:h-40"
          />
          <div className="ml-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-[#ff0000] font-bold">VOLT</span> <span className="text-volt-dark">CONSULTING GROUP</span>
            </h2>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="heading-xl mb-6 animate-fade-in">
            <span className="text-volt-dark">Electrifying Consulting.</span>
            <br />
            <span className="text-[#ff0000]">Strategic Impact.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-volt-text/80 mb-10 leading-relaxed animate-fade-in">
            The world's first student-run tech consultancy firm, dedicated exclusively to strategic and technological impact in the Brainport region and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/for-clients" className="button-primary w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff0000]">
              Our Services <ArrowRight size={16} />
            </Link>
            <Link to="/for-students" className="button-secondary w-full sm:w-auto border-[#ff0000] text-[#ff0000]">
              For Students
            </Link>
          </div>
        </div>

        {/* Three equal banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Banner 1 */}
          <div className="bg-white/90 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-[#ff0000]">
            <div className="mb-3 text-[#ff0000]">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-volt-dark">Powered by Eindhoven University of Technology</h3>
            <p className="text-volt-text">
              As part of Eindhoven University of Technology, we connect top academic talent directly with industry leaders. Leveraging the university's exceptional resources and innovative expertise, we deliver creative, impactful, and technology-driven solutions across Eindhoven—the City of Light.
            </p>
          </div>

          {/* Banner 2 */}
          <div className="bg-white/90 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-[#ff0000]">
            <div className="mb-3 text-[#ff0000]">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-volt-dark">World's First Student-Run Tech Consultancy Firm</h3>
            <p className="text-volt-text">
              Volt Consulting Group proudly stands as the first student-run tech consultancy firm in the world, dedicated exclusively to strategic and technological impact. With bold ambitions to expand our presence to every major technical university globally, our mission is clear: to create lasting value, abundant growth, and enhanced resilience for organizations across the Brainport region and beyond.
            </p>
          </div>

          {/* Banner 3 */}
          <div className="bg-white/90 p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-[#ff0000]">
            <div className="mb-3 text-[#ff0000]">
              <MapPin size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-volt-dark">At the Heart of the Brainport Region</h3>
            <p className="text-volt-text">
              Situated at the epicenter of technological innovation, Volt Consulting Group drives impact through technology and strategic insight. Our proximity to over 5,000 tech and IT firms and the High Tech Campus empowers us to build meaningful partnerships, foster innovation, and generate measurable social impact in one of Europe's most vibrant tech ecosystems.
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
