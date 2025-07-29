import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";

const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

const ImageSlider: React.FC = () => {
  const categories = [
    {
      name: "Logo & Corporate Identity",
      images: [
        "/Home-Picture/Logo/logo-1.png",
        "/Home-Picture/Logo/logo-2.png",
        "/Home-Picture/Logo/logo-3.png",
      ],
      link: "/services/logo",
    },
    { name: "Advertisement", images: ["/Home-Picture/Advertisement/01.png"], link: "/services/advertisement" },
    { name: "Visual Graphics", images: ["/Home-Picture/Visual/01.png"], link: "/services/visual" },
    { name: "Products Retouch", images: ["/Home-Picture/Product/01.jpg"], link: "/services/product" },
    { name: "UX/UI & Development", images: ["/Home-Picture/UXUI/01.jpg"], link: "/services/website-develop" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const logoImages = categories[0].images;
  const totalSlides = logoImages.length;

  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    const allImages = [
      ...logoImages,
      ...logoImages.map((img) => img.replace(".png", "-mobile.png")),
      ...categories.slice(1).flatMap((c) => c.images),
    ];
    preloadImages(allImages);
  }, [logoImages, categories]);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      const nextImage = new Image();
      nextImage.src = logoImages[(currentSlide + 1) % totalSlides];
      nextImage.onload = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      };
    }, 4000);
    return () => clearInterval(interval);
  }, [isInView, currentSlide, logoImages, totalSlides]);

  const renderLogoSlide = (
    <Link to={categories[0].link} className="relative w-full h-full flex items-center">
      <div className="relative overflow-hidden w-full max-w-full min-h-[60vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[80vh] aspect-[4/3]">
        <AnimatePresence initial={false}>
          <picture>
            <source
              srcSet={`${logoImages[currentSlide].replace(".png", "-mobile.png")} 800w`}
              media="(max-width: 640px)"
            />
            <motion.img
              key={currentSlide}
              src={logoImages[currentSlide]}
              srcSet={`${logoImages[currentSlide]} 1920w`}
              sizes="(max-width: 640px) 800px, 1920px"
              alt={`Logo Design Image ${currentSlide + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute w-full h-full object-cover"
              style={{
                willChange: "opacity",
                backfaceVisibility: "hidden",
                WebkitTransform: "translateZ(0)",
              }}
              loading="eager"
              onError={(e) => {
                console.log(`Image failed to load: ${logoImages[currentSlide]}`);
                (e.target as HTMLImageElement).src = "https://placehold.co/800x600";
              }}
            />
          </picture>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-8 text-white text-[1.25rem] sm:text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] font-bold z-20">
          Logo & Corporate Identity
        </div>
      </div>
    </Link>
  );

  return (
    <section
      id="image-slider"
      className="min-h-[60vh] bg-white w-full flex flex-col items-stretch py-0 lg:flex-row lg:items-stretch lg:py-0"
    >
      <motion.div
        ref={ref as any}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full"
      >
        <div className="grid grid-cols-1 gap-0 w-full lg:grid-cols-2 h-full">
          {renderLogoSlide}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 lg:col-span-1 lg:grid-cols-2 lg:items-center lg:justify-center h-full">
            {categories.slice(1).map((category) => (
              <Link key={category.name} to={category.link}>
                <div className="relative overflow-hidden w-full max-w-full min-h-[30vh] sm:min-h-[25vh] md:min-h-[30vh] lg:min-h-[40vh] aspect-[4/3]">
                  <img
                    src={category.images[0]}
                    alt={`${category.name} Image 1`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.log(`Image failed to load: ${category.images[0]}`);
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-8 text-white text-[1.25rem] sm:text-[1.375rem] md:text-[1.5rem] lg:text-[1.625rem] font-semibold z-20">
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