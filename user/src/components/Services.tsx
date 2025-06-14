import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Megaphone, Package, Eye, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Palette,
      title: 'Logo Design',
      description: 'Custom logo designs that capture your brand essence and make a lasting impression.',
      features: ['Brand Research', 'Multiple Concepts', 'Vector Files', 'Brand Guidelines'],
      link: '/services/logo',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Megaphone,
      title: 'Advertisement',
      description: 'Eye-catching advertising materials that drive engagement and conversions.',
      features: ['Digital Ads', 'Print Ads', 'Campaign Design', 'Video Ads'],
      link: '/services/advertisement',
      image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Package,
      title: 'Product Design',
      description: 'Beautiful and functional product designs that users love and businesses succeed with.',
      features: ['Product Packaging', 'Product Visualization', 'Product Catalog', 'Product Branding'],
      link: '/services/product',
      image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Eye,
      title: 'Visual Design',
      description: 'Stunning visual experiences that communicate your message effectively.',
      features: ['Visual Identity', 'Infographic Design', 'Presentation Design', 'Visual Storytelling'],
      link: '/services/visual',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We offer comprehensive design services to build strong, memorable brands that drive business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105 border border-gray-700/50 hover:border-primary-500/50"
            >
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                
                {/* Icon Overlay */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-primary-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary-500/30">
                  <service.icon className="w-6 h-6 text-primary-500" />
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <span className="text-primary-400 font-semibold text-sm">Learn More</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;