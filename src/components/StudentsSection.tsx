
import React from 'react';
import { ArrowRight, Microscope, Lightbulb, Building, GraduationCap, Network, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: <Microscope size={24} />,
    title: "Micro-Internships in Your Field",
    description: "Engage in targeted micro-internships aligned with your chosen career path in engineering, technology, or STEM fields."
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Hands-On Innovation",
    description: "Get practical, hands-on experience that propels technological innovations forward."
  },
  {
    icon: <Building size={24} />,
    title: "Real Consulting Experience",
    description: "Gain intensive, real-world consulting and research experience with industry leaders."
  },
  {
    icon: <GraduationCap size={24} />,
    title: "Professional Training & Workshops",
    description: "Benefit from comprehensive professional coaching and training sessions conducted by industry experts."
  },
  {
    icon: <Network size={24} />,
    title: "Network and Mentorship",
    description: "Connect and collaborate with ambitious peers and established professionals from the technology sector."
  },
  {
    icon: <Globe size={24} />,
    title: "Social Impact Through Technology",
    description: "Make a meaningful difference by contributing innovative and sustainable technological solutions."
  },
  {
    icon: <Users size={24} />,
    title: "Inspiring Community",
    description: "Join a vibrant, diverse community of highly motivated students who share your passion for technology."
  }
];

const StudentsSection = () => {
  return (
    <section id="for-students" className="section-padding bg-volt-blue text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-2 text-sm font-medium bg-white/20 text-white rounded-full">
            For Students
          </span>
          
          <h2 className="heading-lg mb-6">
            Launch Your Career with Real-World Experience
          </h2>
          
          <p className="text-xl text-white/80 leading-relaxed">
            Join Volt Consulting Group to gain valuable consulting experience, develop professional skills, and make a real impact while still at university.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-white/80">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-8 md:p-12 text-volt-dark">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="heading-md mb-6">Recruitment & Application Process</h3>
              <p className="text-volt-text/80 mb-6">
                At Volt Consulting Group, we seek talented individuals with diverse backgrounds who share a passion for technology, innovation, and creating real-world impact.
              </p>
              
              <div className="space-y-4">
                {[
                  "Online Application",
                  "First Interview (Case Study & Personal Fit)",
                  "Second Interview (if applicable)",
                  "Feedback & Results",
                  "Kick-Off & Onboarding"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-volt-blue flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="font-medium">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/apply" className="button-primary inline-flex items-center gap-2">
                  Apply Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            
            <div>
              <div className="bg-volt-gray rounded-xl p-6">
                <h4 className="heading-sm mb-4">What We Look For</h4>
                <ul className="space-y-3">
                  {[
                    "Curious & Creative Innovators",
                    "Analytical Problem-Solvers",
                    "Collaborative Team Players",
                    "Dedicated & Ambitious"
                  ].map((trait, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-volt-blue flex items-center justify-center">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <span className="font-medium">{trait}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-volt-gray/50">
                  <h4 className="font-semibold text-lg mb-3">Open for All</h4>
                  <p className="text-volt-text/80">
                    We warmly welcome students from all years and levels—Bachelor, Master, Doctorate, and PhD. Our projects leverage diverse expertise across every degree program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentsSection;
