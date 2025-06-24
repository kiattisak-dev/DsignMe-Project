import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const serviceLinks = [
    { name: 'Logo Design', path: '/services/logo' },
    { name: 'Advertisement', path: '/services/advertisement' },
    { name: 'Product Design', path: '/services/product' },
    { name: 'Visual Design', path: '/services/visual' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    } `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={isScrolled ? '/Logo-Black.svg' : '/Logo-White.svg'}
              alt="DsignMe Logo"
              className="w-15 h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`${
                isScrolled ? 'text-black' : 'text-white'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
            >
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className={`flex items-center space-x-1 ${
                isScrolled ? 'text-black' : 'text-white'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}>
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isServicesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg border border-gray-200/30 py-2 ${
                  isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white/90'
                }`}>
                  {serviceLinks.map((service, index) => (
                    <Link
                      key={index}
                      to={service.path}
                      className="block px-4 py-2 text-black hover:text-gray-500 hover:bg-gray-100/80 transition-colors duration-200 drop-shadow-sm"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => scrollToSection('portfolio')}
              className={`${
                isScrolled ? 'text-black' : 'text-white'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className={`${
                isScrolled ? 'text-black' : 'text-white'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-200 shadow-sm"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-black' : 'text-white'} drop-shadow-sm`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full border-t border-gray-200/30 ${
            isScrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white/90'
          }`}>
            <nav className="flex flex-col space-y-4 p-4">
              <Link 
                to="/"
                className="text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Services Menu */}
              <div>
                <button 
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center justify-between w-full text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                >
                  <span>Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {isServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {serviceLinks.map((service, index) => (
                      <Link
                        key={index}
                        to={service.path}
                        className="block text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => scrollToSection('portfolio')}
                className="text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-200 w-fit shadow-sm"
              >
                Contact
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;