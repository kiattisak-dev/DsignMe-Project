import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

// Preload images to prevent lag
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
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track image loading
  const logoImages = categories[0].images;
  const totalSlides = logoImages.length;

  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Preload images and track loading status
  useEffect(() => {
    const allImages = [
      ...logoImages,
      ...categories.slice(1).flatMap((c) => c.images),
    ];
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === allImages.length) {
        setImagesLoaded(true);
      }
    };

    allImages.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = handleImageLoad;
      img.onerror = () => {
        console.log(`Image failed to load: ${url}`);
        handleImageLoad(); // Proceed even if an image fails
      };
    });
  }, [logoImages, categories]);

  // Slideshow interval
  useEffect(() => {
    if (!isInView || !imagesLoaded) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [isInView, imagesLoaded, totalSlides]);

  const renderLogoSlide = (
    <Link to={categories[0].link} className="relative w-full h-full flex items-center">
      <div className="relative overflow-hidden w-full max-w-full h-[100vw] sm:h-[50vh] md:h-[60vh] lg:h-screen !aspect-square sm:aspect-auto lg:aspect-auto">
        <div className="absolute w-full h-full">
          {logoImages.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt={`Logo Design Image ${index + 1}`}
              initial={{ opacity: 0, visibility: "hidden" }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                visibility: index === currentSlide ? "visible" : "hidden",
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }} // Adjusted transition
              className="absolute w-full h-full object-cover"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: "translateZ(0)", // Simplified transform
              }}
              loading={index === currentSlide ? "eager" : "lazy"}
              onError={(e) => {
                console.log(`Image failed to load: ${img}`);
                (e.target as HTMLImageElement).src = "https://placehold.co/800x600";
              }}
            />
          ))}
        </div>
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
      className="min-h-screen bg-white w-full flex flex-col items-stretch py-0 lg:flex-row lg:items-stretch lg:py-0"
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
                <div className="relative overflow-hidden w-full max-w-full h-[100vw] sm:h-[25vh] md:h-[30vh] lg:h-[calc(50vh)] !aspect-square sm:aspect-square lg:aspect-square cursor-pointer">
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