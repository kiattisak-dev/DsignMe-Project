import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ImageSlider: React.FC = () => {
  const categories = [
    {
      name: "Logo Design",
      images: [
        "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      link: "/services/logo",
    },
    {
      name: "Advertisement",
      images: [
        "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      link: "/services/advertisement",
    },
    {
      name: "Visual Graphics",
      images: [
        "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      link: "/services/visual",
    },
    {
      name: "Product Design",
      images: [
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      link: "/services/product",
    },
    {
      name: "UX/UI & Develop",
      images: [
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
      link: "/services/website-develop",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const logoImages = categories[0].images;
  const totalSlides = logoImages.length;

  // Reference for the section to detect visibility
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Auto-slide for left side (Logo Design)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section
      id="image-slider"
      className="min-h-screen bg-white w-full flex flex-col items-stretch py-0 lg:flex-row lg:items-stretch lg:py-0"
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full"
      >
        <div className="grid grid-cols-1 gap-0 w-full lg:grid-cols-2 h-full">
          <AnimatePresence mode="wait">
            {/* Large sliding image (Logo Design) */}
            <Link
              to={categories[0].link}
              className="relative lg:col-span-1 w-full h-full flex items-center"
            >
              <div className="relative overflow-hidden w-full max-w-full h-[100vw] sm:h-[50vh] md:h-[60vh] lg:h-screen !aspect-square sm:aspect-auto lg:aspect-auto">
                <motion.div
                  key={`large-${currentSlide}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <img
                    src={logoImages[currentSlide]}
                    alt={`Logo Design Image ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.log(
                        `Image failed to load: ${logoImages[currentSlide]}`
                      );
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/800x600";
                    }}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                {/* Static text */}
                <div className="absolute bottom-2 left-8 text-center text-white text-[1.25rem] sm:text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] font-bold z-20">
                  Logo Design
                </div>
              </div>
            </Link>
          </AnimatePresence>
          {/* Smaller static images in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 lg:col-span-1 lg:grid-cols-2 lg:items-center lg:justify-center h-full">
            {categories.slice(1).map((category, catIndex) => (
              <Link key={category.name} to={category.link}>
                <div className="relative overflow-hidden w-full max-w-full h-[100vw] sm:h-[25vh] md:h-[30vh] lg:h-[calc(50vh)] !aspect-square sm:aspect-square lg:aspect-square cursor-pointer">
                  <div className="w-full h-full">
                    <img
                      src={category.images[0]}
                      alt={`${category.name} Image 1`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.log(
                          `Image failed to load: ${category.images[0]}`
                        );
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x400";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-white text-[1.25rem] sm:text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] font-semibold z-20">
                    {category.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ImageSlider;