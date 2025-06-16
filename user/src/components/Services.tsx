import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Megaphone, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Palette,
      title: 'Logo & Corporate Identity',
      description: 'ออกแบบโลโก้และอัตลักษณ์องค์กร',
      link: '/services/logo',
      images: [
        'https://via.placeholder.com/400x300?text=Logo+Design+1',
        'https://via.placeholder.com/400x300?text=Corporate+Identity+1',
        'https://via.placeholder.com/400x300?text=Corporate+Identity+2'
      ]
    },
    {
      icon: Megaphone,
      title: 'AD Content',
      description: 'ออกแบบเนื้อหาสื่อโฆษณา',
      link: '/services/advertisement',
      images: [
        'https://via.placeholder.com/400x300?text=AD+Content+1',
        'https://via.placeholder.com/400x300?text=AD+Content+2',
        'https://via.placeholder.com/400x300?text=AD+Content+3'
      ]
    },
    {
      icon: Eye,
      title: 'Visual & Motion Graphic',
      description: 'ออกแบบภาพและกราฟิกเคลื่อนไหว',
      link: '/services/visual',
      images: [
        'https://via.placeholder.com/400x300?text=Motion+Graphic+1',
        'https://via.placeholder.com/400x300?text=Visual+Design+1',
        'https://via.placeholder.com/400x300?text=Motion+Graphic+2'
      ]
    },
    {
      icon: Package,
      title: 'Product Design',
      description: 'ออกแบบผลิตภัณฑ์และบรรจุภัณฑ์',
      link: '/services/product',
      images: [
        'https://via.placeholder.com/400x300?text=Product+Design+1',
        'https://via.placeholder.com/400x300?text=Product+Packaging+1',
        'https://via.placeholder.com/400x300?text=Product+Design+2'
      ]
    }
  ];

  const [slideOffset, setSlideOffset] = useState<{ [key: number]: number }>({});

  const handleSlideLeft = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideOffset((prev) => ({
      ...prev,
      [index]: Math.min((prev[index] || 0) + 100, 0),
    }));
  };

  const handleSlideRight = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideOffset((prev) => ({
      ...prev,
      [index]: Math.max((prev[index] || 0) - 100, -200), // Adjusted for 3 images
    }));
  };

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-white bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {services.map((service, index) => (
          <div key={index} className="mb-6 sm:mb-8 lg:mb-12 last:mb-0">
            <Link to={service.link}>
              <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-full">
                  <div
                    className="flex w-[300%] h-full transition-transform duration-300"
                    style={{ transform: `translateX(${slideOffset[index] || 0}%)` }}
                  >
                    {service.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="w-full h-full relative">
                        <img
                          src={img}
                          alt={`${service.title} ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                        <div className="absolute inset-0 flex items-end p-4 sm:p-6 text-gray-900">
                          <div className="w-full">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{service.title}</h3>
                            <p className="text-xs sm:text-sm">{service.description}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 sm:w-10 h-8 sm:h-10 sm:w-12 sm:h-12 bg-amber-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <service.icon className="w-4 sm:w-5 h-4 sm:h-5 sm:w-6 sm:h-6 text-amber-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => handleSlideLeft(index, e)}
                  className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-amber-100/70 text-amber-800 p-1 sm:p-2 rounded-full hover:bg-amber-200/70"
                  disabled={slideOffset[index] === 0}
                >
                  <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
                <button
                  onClick={(e) => handleSlideRight(index, e)}
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-amber-100/70 text-amber-800 p-1 sm:p-2 rounded-full hover:bg-amber-200/70"
                  disabled={slideOffset[index] === -200}
                >
                  <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;