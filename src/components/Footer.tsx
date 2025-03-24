
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-volt-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/aa6fe717-e75b-4bec-a88b-4b491bd55190.png" 
                alt="Volt Consulting Group Logo" 
                className="h-12"
              />
            </Link>
            
            <p className="text-white/70 mb-6">
              The world's first student-run tech consultancy firm, dedicated exclusively to strategic and technological impact.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-volt-red transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-volt-red transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-volt-red transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { text: "Home", url: "/" },
                { text: "About Us", url: "/#about" },
                { text: "Services", url: "/#services" },
                { text: "For Clients", url: "/#for-clients" },
                { text: "For Students", url: "/#for-students" },
                { text: "Partners", url: "/#partners" },
                { text: "Contact", url: "/contact" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.url} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Dates</h3>
            <ul className="space-y-4">
              {[
                { event: "Launch Event", date: "September 15, 2023" },
                { event: "Recruitment Cycle Opens", date: "October 1, 2023" },
                { event: "Workshop Series", date: "October 20, 2023" }
              ].map((item, idx) => (
                <li key={idx} className="border-b border-white/10 pb-2">
                  <p className="font-medium">{item.event}</p>
                  <p className="text-white/70 text-sm">{item.date}</p>
                </li>
              ))}
            </ul>
            <a href="/events" className="inline-block mt-4 text-volt-red hover:underline">
              View All Upcoming Dates →
            </a>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-white/70">
              <li>
                <strong className="text-white">Email:</strong>{" "}
                <a href="mailto:info@voltconsultinggroup.com" className="hover:text-white transition-colors">
                  info@voltconsultinggroup.com
                </a>
              </li>
              <li>
                <strong className="text-white">Address:</strong>{" "}
                <span>Eindhoven University of Technology, Eindhoven, Netherlands</span>
              </li>
              <li>
                <strong className="text-white">Phone:</strong>{" "}
                <a href="tel:+31XXXXXXXXXX" className="hover:text-white transition-colors">
                  +31 (0) XX XXX XXXX
                </a>
              </li>
            </ul>
            <Link to="/contact" className="inline-block mt-4 text-volt-red hover:underline">
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
