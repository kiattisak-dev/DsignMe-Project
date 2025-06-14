import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Zap, Users, Award, ArrowRight, ArrowLeft, CheckCircle, Monitor, Printer, Video, Target } from 'lucide-react';

const AdvertisementPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      icon: Monitor,
      title: 'Digital Advertising',
      description: 'Eye-catching digital ads for social media, web, and mobile platforms that drive engagement.',
      features: ['Social Media Ad Design', 'Web Banner Creation', 'Mobile-Optimized Formats', 'A/B Testing Designs'],
      price: 'Starting from $199',
      timeline: '3-5 business days',
      revisions: '3 rounds included'
    },
    {
      icon: Printer,
      title: 'Print Advertising',
      description: 'Professional print advertisements for magazines, newspapers, and outdoor media campaigns.',
      features: ['Magazine Advertisement', 'Newspaper Ad Design', 'Billboard Design', 'Print-Ready Files'],
      price: 'Starting from $299',
      timeline: '5-7 business days',
      revisions: '3 rounds included'
    },
    {
      icon: Target,
      title: 'Campaign Design',
      description: 'Complete advertising campaign design with consistent visual identity across all touchpoints.',
      features: ['Campaign Strategy', 'Multi-Format Designs', 'Brand Consistency', 'Performance Analytics'],
      price: 'Starting from $599',
      timeline: '7-10 business days',
      revisions: '5 rounds included'
    },
    {
      icon: Video,
      title: 'Video Advertising',
      description: 'Motion graphics and video advertisements for digital platforms and social media.',
      features: ['Motion Graphics', 'Video Ad Creation', 'Animation Design', 'Multiple Video Formats'],
      price: 'Starting from $799',
      timeline: '10-14 business days',
      revisions: '4 rounds included'
    }
  ];

  const portfolioImages = [
    {
      id: 1,
      url: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Digital Marketing Campaign',
      category: 'Digital Marketing',
      description: 'Comprehensive digital advertising campaign for tech startup'
    },
    {
      id: 2,
      url: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Social Media Advertisement',
      category: 'Social Media',
      description: 'Engaging social media ads for fashion brand promotion'
    },
    {
      id: 3,
      url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Print Advertisement Design',
      category: 'Print Media',
      description: 'Professional magazine advertisement for luxury products'
    },
    {
      id: 4,
      url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Outdoor Advertising Campaign',
      category: 'Outdoor Media',
      description: 'Large-scale billboard design for brand awareness campaign'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Strategy & Planning',
      description: 'We analyze your target audience, competitors, and campaign objectives to develop an effective advertising strategy.'
    },
    {
      step: '02',
      title: 'Creative Concept',
      description: 'Our team develops compelling creative concepts that align with your brand message and campaign goals.'
    },
    {
      step: '03',
      title: 'Design & Production',
      description: 'We create high-quality advertisements optimized for your chosen platforms and media channels.'
    },
    {
      step: '04',
      title: 'Launch & Optimize',
      description: 'We deliver final assets and provide guidance for campaign launch and performance optimization.'
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
                <Megaphone className="w-8 h-8 text-primary-500" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Advertisement
              <br />
              <span className="text-primary-500">Design Services</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create compelling advertising materials that drive engagement and conversions. 
              From digital campaigns to print media, we design advertisements that get results.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Slider */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advertisement Portfolio</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our successful advertising campaigns and see how we've helped brands reach their audience.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advertisement Packages</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the perfect advertising solution that fits your campaign needs and budget.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Advertising Process</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We follow a strategic approach to create advertisements that deliver measurable results.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Campaign?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's create compelling advertisements that drive engagement and deliver results for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 flex items-center space-x-2">
                <span>Start Your Campaign</span>
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

export default AdvertisementPage;