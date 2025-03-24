
import React from 'react';
import { ArrowRight, Clock, Flag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientsSection = () => {
  return (
    <section id="for-clients" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-2 text-sm font-medium bg-volt-blue/10 text-volt-blue rounded-full">
            For Clients
          </span>
          
          <h2 className="heading-lg text-volt-dark mb-6">
            Harness Student Innovation for Business Growth
          </h2>
          
          <p className="text-lg text-volt-text/80 leading-relaxed">
            Partner with motivated student consultants to bring fresh perspectives, innovative solutions, and academic excellence to your organization's challenges.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h3 className="heading-md mb-6 text-volt-dark">Project Cycle</h3>
            
            <div className="space-y-6">
              {[
                {
                  icon: <Flag className="text-volt-blue" size={24} />,
                  title: "Initial Consultation & Project Definition",
                  desc: "We discuss your organization's challenges, goals, and strategic objectives."
                },
                {
                  icon: <Clock className="text-volt-blue" size={24} />,
                  title: "Team Formation & Kick-Off",
                  desc: "We assemble an interdisciplinary team of motivated student consultants matched to your project's requirements."
                },
                {
                  icon: <Check className="text-volt-blue" size={24} />,
                  title: "Final Recommendations & Presentation",
                  desc: "We deliver comprehensive, actionable insights and recommendations via a structured final presentation."
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-volt-blue/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                    <p className="text-volt-text/80">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link to="/contact" className="button-primary inline-flex items-center gap-2">
                Discuss Your Project <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="bg-volt-gray rounded-2xl p-8">
              <h3 className="heading-sm mb-6 text-volt-dark">Specialized Technology Areas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Robotics & Autonomous Systems",
                  "Medical Devices & Equipment",
                  "Consumer Electronics & Wearables",
                  "Renewable Energy & CleanTech",
                  "Aerospace & Automotive",
                  "Industrial Machinery",
                  "Agricultural Technology",
                  "Software & Application Development"
                ].map((tech, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="font-medium text-volt-text">{tech}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-volt-blue rounded-xl text-white">
                <h4 className="font-semibold text-xl mb-3">Interested in Partnering?</h4>
                <p className="text-white/80 mb-4">
                  Reach out to us to discuss how Volt Consulting Group can enhance your organization's success and impact through strategic partnerships.
                </p>
                <Link to="/contact" className="text-white flex items-center gap-1 font-medium hover:gap-2 transition-all">
                  Contact Us Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
