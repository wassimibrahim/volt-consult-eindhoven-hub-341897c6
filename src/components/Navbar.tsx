
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glassy py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-volt-blue text-3xl font-bold">⚡</span>
          <span className="text-xl font-bold text-volt-dark">
            Volt <span className="text-volt-blue">Consulting</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#for-clients">For Clients</NavLink>
          <NavLink href="#for-students">For Students</NavLink>
          <NavLink href="#partners">Partners</NavLink>
          <Link to="/contact" className="button-primary">
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-volt-dark p-2" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden animate-slide-in-top">
            <nav className="flex flex-col py-4">
              <MobileNavLink href="#about" onClick={toggleMenu}>About</MobileNavLink>
              <MobileNavLink href="#services" onClick={toggleMenu}>Services</MobileNavLink>
              <MobileNavLink href="#for-clients" onClick={toggleMenu}>For Clients</MobileNavLink>
              <MobileNavLink href="#for-students" onClick={toggleMenu}>For Students</MobileNavLink>
              <MobileNavLink href="#partners" onClick={toggleMenu}>Partners</MobileNavLink>
              <Link 
                to="/contact" 
                className="mx-4 mt-4 py-3 px-4 bg-volt-blue text-white text-center rounded-md"
                onClick={toggleMenu}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-volt-dark hover:text-volt-blue transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-volt-blue after:transition-all hover:after:w-full"
  >
    {children}
  </a>
);

const MobileNavLink = ({ 
  href, 
  children, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <a 
    href={href} 
    className="px-4 py-3 text-volt-dark hover:bg-volt-gray transition-colors"
    onClick={onClick}
  >
    {children}
  </a>
);

export default Navbar;
