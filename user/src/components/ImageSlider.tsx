import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageSlider: React.FC = () => {
  const categories = [
    {
      name: 'Logo Design',
      images: [
        'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      name: 'Advertisement',
      images: [
        'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      name: 'Visual Graphics',
      images: [
        'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      name: 'Product Design',
      images: [
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      name: 'UX/UI & Develop',
      images: [
        'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const logoImages = categories[0].images;
  const totalSlides = logoImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section
      id="image-slider"
      className="h-screen bg-gradient-to-br from-gray-200 via-white to-gray-300 w-full flex items-center"
    >
      <div className="max-w-full mx-auto px-4 w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 w-full h-full relative">
          <AnimatePresence mode="wait">
            {/* Sliding left large image (Logo Design only) */}
            <div className="col-span-4 row-span-full relative flex items-center">
              <div className="relative overflow-hidden w-full h-[calc(100%-2rem)] flex flex-1">
                <motion.div
                  key={`large-${currentSlide}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <img
                    src={logoImages[currentSlide]}
                    alt={`Logo Design Image ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.log(`Image failed to load: ${logoImages[currentSlide]}`);
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400';
                    }}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-900/30 hover:bg-gray-900/50 transition-all duration-300"></div>
                <div className="absolute inset-0 shadow-lg hover:shadow-xl transition-shadow duration-300"></div>
              </div>
              {/* Text box for large image */}
              <motion.div
                key={`text-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md text-xl font-bold z-20"
              >
                Logo Design
              </motion.div>
            </div>
          </AnimatePresence>
          {/* Static right side with smaller images for each category */}
          <div className="col-span-2 row-span-full grid grid-cols-1 grid-rows-2 gap-4 sm:grid-cols-2 sm:grid-rows-2">
            {/* Small image 1: Advertisement */}
            <div className="relative overflow-hidden w-full h-full flex">
              <img
                src={categories[1].images[0]}
                alt="Advertisement Image 1"
                className="w-full h-full object-cover flex-1"
                loading="lazy"
                onError={(e) => {
                  console.log(`Image failed to load: ${categories[1].images[0]}`);
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-900/30 hover:bg-gray-900/50 transition-all duration-300"></div>
              <div className="absolute inset-0 shadow-lg hover:shadow-xl transition-shadow duration-300"></div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-md text-base font-semibold z-20">
                Advertisement
              </div>
            </div>
            {/* Small image 2: Visual Graphics */}
            <div className="relative overflow-hidden w-full h-full flex">
              <img
                src={categories[2].images[0]}
                alt="Visual Graphics Image 1"
                className="w-full h-full object-cover flex-1"
                loading="lazy"
                onError={(e) => {
                  console.log(`Image failed to load: ${categories[2].images[0]}`);
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-900/30 hover:bg-gray-900/50 transition-all duration-300"></div>
              <div className="absolute inset-0 shadow-lg hover:shadow-xl transition-shadow duration-300"></div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-md text-base font-semibold z-20">
                Visual Graphics
              </div>
            </div>
            {/* Small image 3: Product Design */}
            <div className="relative overflow-hidden w-full h-full flex">
              <img
                src={categories[3].images[0]}
                alt="Product Design Image 1"
                className="w-full h-full object-cover flex-1"
                loading="lazy"
                onError={(e) => {
                  console.log(`Image failed to load: ${categories[3].images[0]}`);
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-900/30 hover:bg-gray-900/50 transition-all duration-300"></div>
              <div className="absolute inset-0 shadow-lg hover:shadow-xl transition-shadow duration-300"></div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-md text-base font-semibold z-20">
                Product Design
              </div>
            </div>
            {/* Small image 4: UX/UI & Develop */}
            <div className="relative overflow-hidden w-full h-full flex">
              <img
                src={categories[4].images[0]}
                alt="UX/UI & Develop Image 1"
                className="w-full h-full object-cover flex-1"
                loading="lazy"
                onError={(e) => {
                  console.log(`Image failed to load: ${categories[4].images[0]}`);
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-900/30 hover:bg-gray-900/50 transition-all duration-300"></div>
              <div className="absolute inset-0 shadow-lg hover:shadow-xl transition-shadow duration-300"></div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-md text-base font-semibold z-20">
                UX/UI & Develop
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;