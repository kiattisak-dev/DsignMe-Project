import React, { useState } from 'react';
import { ExternalLink, Eye } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const portfolioItems = [
    {
      id: 1,
      title: 'The Startup Co.',
      category: 'logo',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Modern tech startup logo design with clean typography',
      tags: ['Logo Design', 'Tech']
    },
    {
      id: 2,
      title: 'Vesture Fashion',
      category: 'branding',
      image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Complete brand identity for luxury fashion brand',
      tags: ['Brand Identity', 'Fashion']
    },
    {
      id: 3,
      title: 'JORAN Real Estate',
      category: 'corporate',
      image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Professional corporate identity for real estate company',
      tags: ['Corporate', 'Real Estate']
    },
    {
      id: 4,
      title: 'Ocean Resort',
      category: 'branding',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Tropical resort brand with vibrant color palette',
      tags: ['Brand Identity', 'Hospitality']
    },
    {
      id: 5,
      title: 'TechFlow Solutions',
      category: 'logo',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Dynamic logo for software development company',
      tags: ['Logo Design', 'Technology']
    },
    {
      id: 6,
      title: 'Green Earth Initiative',
      category: 'corporate',
      image: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Environmental organization brand identity',
      tags: ['Corporate', 'Environment']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'logo', name: 'Logo Design' },
    { id: 'branding', name: 'Brand Identity' },
    { id: 'corporate', name: 'Corporate' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Portfolio</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Explore our recent work and see how we've helped brands create powerful visual identities.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-gray-800/50 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-primary-500/50"
            >
              <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-4">
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <Eye className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;