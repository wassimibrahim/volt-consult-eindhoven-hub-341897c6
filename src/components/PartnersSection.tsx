
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnersSection = () => {
  return (
    <section id="partners" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-2 text-sm font-medium bg-volt-blue/10 text-volt-blue rounded-full">
            For Partners
          </span>
          
          <h2 className="heading-lg text-volt-dark mb-6">
            Support the Next Generation of Tech Leaders
          </h2>
          
          <p className="text-lg text-volt-text/80 leading-relaxed">
            Partnering with Volt Consulting Group enables you to directly support the professional growth and impact of future tech and engineering leaders.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-volt-gray rounded-xl p-8 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-volt-dark">Workshops & Networking Events</h3>
            <p className="text-volt-text/80 mb-6">
              Collaborative events that connect industry leaders, alumni, and students to share knowledge, enhance skills, and build meaningful professional relationships.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
              alt="Workshops and networking" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <div className="bg-volt-gray rounded-xl p-8 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-volt-dark">Brand Promotion & Recruiting Support</h3>
            <p className="text-volt-text/80 mb-6">
              Targeted marketing and outreach initiatives that enhance your organization's visibility, reputation, and recruitment opportunities among top talent.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
              alt="Brand promotion and recruiting" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          
          <div className="bg-volt-gray rounded-xl p-8 hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-4 text-volt-dark">Consulting Project Collaboration</h3>
            <p className="text-volt-text/80 mb-6">
              Engage directly with talented student teams on consulting projects. Gain fresh perspectives, innovative solutions, and actionable insights.
            </p>
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
              alt="Consulting project collaboration" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
        
        <div className="bg-volt-blue rounded-xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="heading-md mb-6">Your Benefits</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Enhanced Brand Exposure",
                    desc: "Amplify your organization's visibility and attractiveness as an employer among a diverse student audience."
                  },
                  {
                    title: "Access to Exceptional Talent",
                    desc: "Connect with high-achieving, motivated students who possess exceptional analytical and technical skills."
                  },
                  {
                    title: "Positive Social Impact",
                    desc: "Showcase your commitment to social responsibility by supporting meaningful projects and sustainable initiatives."
                  }
                ].map((benefit, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg p-5 hover:bg-white/15 transition-colors">
                    <h4 className="font-semibold text-lg mb-2">{benefit.title}</h4>
                    <p className="text-white/80 text-sm">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 text-volt-dark">
              <h3 className="heading-sm mb-6">Become a Training Partner</h3>
              <p className="text-volt-text/80 mb-6">
                We collaborate closely with industry leaders who provide professional mentorship and training. Join our esteemed partner network to make a significant impact on the future of innovation and technology.
              </p>
              <Link to="/partners" className="button-primary inline-flex items-center gap-2">
                Become a Partner <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
