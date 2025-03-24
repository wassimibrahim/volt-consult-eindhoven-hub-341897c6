
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fade-in');
    }
    
    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.classList.add('animate-fade-in');
      }
    }, 300);
    
    setTimeout(() => {
      if (ctaRef.current) {
        ctaRef.current.classList.add('animate-fade-in');
      }
    }, 600);
  }, []);

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-white to-volt-lightRed relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')] bg-cover bg-center opacity-5"></div>
      
      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-volt-red/10 text-volt-red rounded-full">
            ⚡ Powered by Eindhoven University of Technology
          </span>
          
          <h1 
            ref={titleRef}
            className="heading-xl mb-6 opacity-0"
            style={{ animationDelay: '0ms' }}
          >
            <span className="text-volt-dark">Electrifying Consulting.</span>
            <br />
            <span className="text-volt-red">Strategic Impact.</span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-volt-text/80 mb-10 leading-relaxed opacity-0"
            style={{ animationDelay: '300ms' }}
          >
            The world's first student-run tech consultancy firm, dedicated exclusively to strategic and technological impact in the Brainport region and beyond.
          </p>
          
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0"
            style={{ animationDelay: '600ms' }}
          >
            <Link to="#services" className="button-primary w-full sm:w-auto flex items-center justify-center gap-2">
              Our Services <ArrowRight size={16} />
            </Link>
            <Link to="#for-students" className="button-secondary w-full sm:w-auto">
              For Students
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
