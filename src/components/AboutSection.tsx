
import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 mb-2 text-sm font-medium bg-volt-red/10 text-volt-red rounded-full">
              About Us
            </span>
            
            <h2 className="heading-lg text-volt-dark">
              Connecting Academic Talent with Industry Leaders
            </h2>
            
            <p className="text-lg text-volt-text/80 leading-relaxed">
              As part of Eindhoven University of Technology, we connect top academic talent directly with industry leaders. Leveraging the university's exceptional resources and innovative expertise, we deliver creative, impactful, and technology-driven solutions across Eindhoven—the City of Light.
            </p>
            
            <div className="pt-4">
              <h3 className="heading-sm mb-4 text-volt-dark">Our Core Values</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Innovation & Creativity",
                    desc: "We embrace innovative thinking and creative problem-solving."
                  },
                  {
                    title: "Collaboration & Teamwork",
                    desc: "We believe diverse, interdisciplinary teams produce superior results."
                  },
                  {
                    title: "Excellence & Professionalism",
                    desc: "We maintain high standards in everything we do."
                  },
                  {
                    title: "Impact & Sustainability",
                    desc: "We deliver sustainable solutions with tangible impact."
                  }
                ].map((value, index) => (
                  <div key={index} className="p-4 rounded-lg border border-volt-gray bg-white shadow-sm card-hover">
                    <h4 className="font-semibold mb-2 text-volt-red">{value.title}</h4>
                    <p className="text-sm text-volt-text/80">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-square">
              <img 
                src="public/lovable-uploads/1aa43143-fd97-47f2-8821-8677a00b3a64.png" 
                alt="Red lightbulb with Volt logo"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-volt-red/30 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-8 right-8 p-6 bg-white rounded-xl shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src="/lovable-uploads/4062c0cb-8a1c-48cc-83e9-a22f371228fe.png" 
                  alt="Volt Logo" 
                  className="h-6"
                />
                <h3 className="text-xl font-semibold text-volt-dark">World's First</h3>
              </div>
              <p className="text-volt-text/80">
                Volt Consulting Group proudly stands as the first student-run tech consultancy firm in the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
