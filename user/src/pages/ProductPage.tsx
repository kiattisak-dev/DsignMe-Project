import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Box, Camera, Palette, ArrowRight, ArrowLeft, CheckCircle, ShoppingBag, Layers, BookOpen } from 'lucide-react';

const ProductPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      icon: Box,
      title: 'Product Packaging',
      description: 'Attractive packaging design that protects your product and attracts customers at point of sale.',
      features: ['Custom Package Design', 'Label & Sticker Design', 'Material Consultation', 'Production-Ready Files'],
      price: 'Starting from $399',
      timeline: '5-7 business days',
      revisions: '3 rounds included'
    },
    {
      icon: Camera,
      title: 'Product Visualization',
      description: '3D product renders and visualizations for marketing, e-commerce, and presentation purposes.',
      features: ['3D Product Modeling', 'Photorealistic Renders', 'Lifestyle Photography', 'Multiple Angle Views'],
      price: 'Starting from $299',
      timeline: '7-10 business days',
      revisions: '3 rounds included'
    },
    {
      icon: BookOpen,
      title: 'Product Catalog',
      description: 'Professional product catalogs and brochures for sales, marketing, and customer education.',
      features: ['Catalog Layout Design', 'Product Photography', 'Print & Digital Formats', 'Interactive Elements'],
      price: 'Starting from $499',
      timeline: '10-14 business days',
      revisions: '4 rounds included'
    },
    {
      icon: Palette,
      title: 'Product Branding',
      description: 'Complete product branding including naming, identity, positioning, and market strategy.',
      features: ['Product Naming', 'Brand Identity Design', 'Market Positioning', 'Launch Strategy'],
      price: 'Starting from $799',
      timeline: '14-21 business days',
      revisions: '5 rounds included'
    }
  ];

  const portfolioImages = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Premium Product Packaging',
      category: 'Packaging Design',
      description: 'Luxury packaging design for high-end consumer products'
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Product Catalog Design',
      category: 'Catalog Design',
      description: 'Comprehensive product catalog for retail and wholesale'
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Product Brand Identity',
      category: 'Brand Design',
      description: 'Complete branding solution for new product launch'
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Product Visualization',
      category: '3D Rendering',
      description: '3D product renders for e-commerce and marketing'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Product Analysis',
      description: 'We study your product, target market, and competitive landscape to understand design requirements.'
    },
    {
      step: '02',
      title: 'Concept Development',
      description: 'Our team creates initial design concepts that align with your product goals and brand identity.'
    },
    {
      step: '03',
      title: 'Design Refinement',
      description: 'We refine the chosen concept, incorporating feedback and ensuring optimal functionality and appeal.'
    },
    {
      step: '04',
      title: 'Production Support',
      description: 'We provide production-ready files and ongoing support for manufacturing and launch.'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % portfolioImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [portfolioImages.length]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Link 
                to="/"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                <Package className="w-8 h-8 text-primary-500" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Product Design
              <br />
              <span className="text-primary-500">Services</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Design beautiful and functional products that users love and businesses succeed with. 
              From packaging to visualization, we create products that stand out in the market.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Slider */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Product Design Portfolio</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our product design work and see how we've helped brands create successful products.
            </p>
          </div>

          <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-8">
            {portfolioImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full border border-primary-500/30">
                        {image.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{image.title}</h3>
                    <p className="text-gray-300 text-sm">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              {portfolioImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary-500 scale-110' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800/50">
              <div 
                className="h-full bg-primary-500 transition-all duration-300 ease-linear"
                style={{ width: `${((currentSlide + 1) / portfolioImages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Product Design Packages</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the perfect product design solution that fits your business needs and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105 border border-gray-700/50 hover:border-primary-500/50"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-primary-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-500 flex items-center">
                      <CheckCircle className="w-3 h-3 text-primary-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Timeline:</span>
                    <span className="text-xs text-gray-400">{service.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Revisions:</span>
                    <span className="text-xs text-gray-400">{service.revisions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-400 font-semibold">{service.price}</span>
                    <button className="group/btn flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200">
                      <span className="text-sm">Order Now</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Design Process</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We follow a comprehensive process to ensure your product design meets market needs and business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto border border-primary-500/30">
                    <span className="text-primary-500 font-bold text-lg">{step.step}</span>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-700/50"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl p-8 border border-primary-500/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Design Your Product?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's create a product design that stands out in the market and drives business success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 flex items-center space-x-2">
                <span>Start Your Product Design</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link 
                to="/#contact"
                className="text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                Get Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;