
import React from 'react';
import { Rocket, LightbulbIcon, Building } from 'lucide-react';

const serviceCategories = [
  {
    icon: <Rocket size={36} />,
    title: "Tech Startups",
    description: "We partner with emerging tech startups, helping them accelerate their innovations into market-ready solutions. Our team provides strategic guidance, product optimization, and technical expertise, fueling growth from ideation to impactful launch."
  },
  {
    icon: <LightbulbIcon size={36} />,
    title: "SMEs in the Tech Sector",
    description: "We support Small and Medium-sized Enterprises (SMEs) in enhancing their technology, streamlining operations, and scaling their impact. Leveraging Eindhoven's technological ecosystem, we deliver customized strategies to optimize business performance, innovation, and competitiveness."
  },
  {
    icon: <Building size={36} />,
    title: "Innovation Leaders in Big Tech",
    description: "Collaborating with large tech corporations, we focus on innovation-driven research projects, pushing the boundaries of technology and strategy. Our student-driven teams bring fresh perspectives to R&D initiatives, helping industry leaders stay at the cutting edge of innovation."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-volt-gray">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-2 text-sm font-medium bg-[#ff0000]/10 text-[#ff0000] rounded-full">
            Our Services
          </span>
          
          <h2 className="heading-lg text-volt-dark mb-6">
            Electrifying Consulting. Strategic Impact.
          </h2>
          
          <p className="text-lg text-volt-text/80 leading-relaxed">
            Powering Innovation, Energizing the City of Light—One Strategy at a Time.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {serviceCategories.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-[#ff0000] mb-5">{service.icon}</div>
              <h3 className="heading-sm mb-4 text-volt-dark">{service.title}</h3>
              <p className="text-volt-text/80">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-[#ff0000] rounded-xl text-white p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="heading-md mb-4">Our Core Consulting Areas</h3>
              <p className="text-white/80 mb-6">
                We specialize in providing comprehensive consulting services, leveraging strategic thinking and technological innovation to deliver impactful solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                "Strategy & Business Development",
                "Market Research & Analytics",
                "Technology & Innovation",
                "Operations & Process Optimization",
                "Financial Planning & Sustainability",
                "Impact Measurement"
              ].map((area, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                  <p className="text-white font-medium">{area}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
