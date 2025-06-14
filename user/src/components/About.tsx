import React from 'react';
import { Users, Award, Clock, Heart } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, number: '500+', label: 'Happy Clients' },
    { icon: Award, number: '15+', label: 'Awards Won' },
    { icon: Clock, number: '8+', label: 'Years Experience' },
    { icon: Heart, number: '1000+', label: 'Projects Completed' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Creating Brands That 
              <span className="text-primary-500"> Inspire & Connect</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              At UpMig, we believe that great design is more than just aesthetics—it's about creating 
              meaningful connections between brands and their audiences. Our team of passionate designers 
              combines creativity with strategic thinking to deliver exceptional results.
            </p>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              From startups to established enterprises, we've helped hundreds of businesses build 
              strong visual identities that drive growth and success. Our collaborative approach 
              ensures that every project reflects the unique personality and values of our clients.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300">
                Start Your Project
              </button>
              <button className="text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold border border-gray-700 hover:border-gray-600 transition-all duration-300">
                Our Process
              </button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Meet Our Team</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our diverse team of creative professionals brings together years of experience 
              in design, strategy, and brand development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Creative Director', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Mike Chen', role: 'Brand Strategist', image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Emma Davis', role: 'Senior Designer', image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;