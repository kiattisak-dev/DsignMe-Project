import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  // Determine if we're on the homepage
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Only add scroll listener if on homepage
    if (isHomePage) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Ensure header is opaque on other pages
      setIsScrolled(true);
    }
  }, [isHomePage]);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
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
    { name: 'Visual Design', path: '/services/visual' },
    { name: 'UX/UI & Develop', path: '/services/website-develop' },
  ];

  // Animation variants for header
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isHomePage && !isScrolled ? 'bg-black/30' : 'bg-white/80 shadow-md'
      }`}
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.img
              src={isHomePage && !isScrolled ? '/Logo-White.svg' : '/Logo-Black.svg'}
              alt="DsignMe Logo"
              className="w-15 h-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isHomePage && !isScrolled ? 'text-white' : 'text-black'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
            >
              หน้าหลัก
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-black'
                } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
              >
                <span>บริการ</span>
                <motion.span
                  animate={{ rotate: isServicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg border border-gray-200/30 py-2 ${
                      isHomePage && !isScrolled ? 'bg-white/90' : 'bg-white/90'
                    }`}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {serviceLinks.map((service, index) => (
                      <Link
                        key={index}
                        to={service.path}
                        className="block px-4 py-2 text-black hover:text-gray-500 hover:bg-gray-100/80 transition-colors duration-200 drop-shadow-sm"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollToSection('portfolio')}
              className={`${
                isHomePage && !isScrolled ? 'text-white' : 'text-black'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
            >
              เกี่ยวกับเรา
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`${
                isHomePage && !isScrolled ? 'text-white' : 'text-black'
              } hover:text-gray-500 transition-colors duration-200 drop-shadow-sm`}
            >
              ขั้นตอน & การให้บริการ
            </button>
            <Link
              to="/contact"
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-200 shadow-sm"
            >
              ติดต่อเรา
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${isHomePage && !isScrolled ? 'text-white' : 'text-black'} drop-shadow-sm`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`md:hidden absolute top-full left-0 w-full border-t border-gray-200/30 ${
                isHomePage && !isScrolled ? 'bg-white/90' : 'bg-white/90'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <nav className="flex flex-col space-y-4 p-4">
                <Link
                  to="/"
                  className="text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  หน้าหลัก
                </Link>

                {/* Mobile Services Menu */}
                <div>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="flex items-center justify-between w-full text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                  >
                    <span>บริการ</span>
                    <motion.span
                      animate={{ rotate: isServicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  {isServicesOpen && (
                    <motion.div
                      className="mt-2 ml-4 space-y-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
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
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                >
                  เกี่ยวกับเรา
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-left text-black hover:text-gray-500 transition-colors duration-200 drop-shadow-sm"
                >
                  ขั้นตอน & การให้บริการ
                </button>
                <Link
                  to="/contact"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-200 w-fit shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ติดต่อเรา
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;