
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-volt-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/ac5e381f-7d1e-48d9-9a1a-17b134af0c5c.png" 
                alt="Volt Consulting Group Logo" 
                className="h-16 invert"
              />
            </Link>
            
            <p className="text-white/70 mb-6">
              The world's first student-run tech consultancy firm, dedicated exclusively to strategic and technological impact.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com/company/volt-consulting-group-nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F00000] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://www.instagram.com/voltconsultinggroup/profilecard/?igsh=cDB2d2c3amFsYWhm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F00000] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { text: "Home", url: "/" },
                { text: "About Us", url: "/about" },
                { text: "Services", url: "/for-clients" },
                { text: "For Clients", url: "/for-clients" },
                { text: "For Students", url: "/for-students" },
                { text: "For Partners", url: "/for-partners" },
                { text: "Contact", url: "/contact" },
                { text: "Admin", url: "/admin" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.url}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Dates</h3>
            <ul className="space-y-4">
              <li className="border-b border-white/10 pb-2">
                <p className="font-medium">Recruitment Cycle Opens</p>
                <p className="text-white/70 text-sm">June 01, 2025</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <strong className="text-white">Email:</strong>{" "}
                <a href="mailto:eindhoven@voltconsultingroup.com" className="hover:text-white transition-colors">
                  eindhoven@voltconsultingroup.com
                </a>
              </li>
              <li>
                <strong className="text-white">Address:</strong>{" "}
                <span>Eindhoven University of Technology, Eindhoven, Netherlands</span>
              </li>
              <li>
                <strong className="text-white">Phone:</strong>{" "}
                <a href="tel:+31613838880" className="hover:text-white transition-colors">
                  +31613838880
                </a>
              </li>
            </ul>
            <Link to="/contact" className="inline-block mt-4 text-[#F00000] hover:underline">
              Contact Form →
            </Link>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-white/70">
          <p>© {new Date().getFullYear()} Volt Consulting Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
