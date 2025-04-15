
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-volt-dark text-white">
      <div className="container-custom">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/ac5e381f-7d1e-48d9-9a1a-17b134af0c5c.png" 
                alt="Volt Consulting Group" 
                className="h-10"
              />
            </Link>
            <p className="text-white/70 mb-4">
              Student-run technology consultancy at Eindhoven University of Technology.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://linkedin.com/company/volt-consulting-group-nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/voltconsultinggroup/profilecard/?igsh=cDB2d2c3amFsYWhm"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Pages</h3>
            <ul className="space-y-3 text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/for-students" className="hover:text-white transition-colors">For Students</Link></li>
              <li><Link to="/for-clients" className="hover:text-white transition-colors">For Clients</Link></li>
              <li><Link to="/partners" className="hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Resources</h3>
            <ul className="space-y-3 text-white/70">
              <li><Link to="/apply" className="hover:text-white transition-colors">Apply</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3 text-white/70">
              <li>Eindhoven University of Technology</li>
              <li>5612 AZ Eindhoven</li>
              <li>The Netherlands</li>
              <li className="pt-2"><a href="mailto:info@voltconsulting.nl" className="hover:text-white transition-colors">info@voltconsulting.nl</a></li>
            </ul>
          </div>
        </div>
        
        <div className="py-6 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Volt Consulting Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
