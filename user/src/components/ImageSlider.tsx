import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

// ✅ preload เฉพาะ logo slide เท่านั้น
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
    { name: "UX/UI & Development", images: ["/Home-Picture/UXUI/01.png"], link: "/services/website-develop" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const logoImages = categories[0].images;
  const totalSlides = logoImages.length;

  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // ✅ preload แค่ logoImages
  useEffect(() => {
    preloadImages(logoImages);
  }, [logoImages]);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [isInView, totalSlides]);

  // ✅ component ย่อยให้แต่ละรูปมี skeleton
  const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div className={`relative w-full h-full ${!loaded ? "bg-gray-200 animate-pulse" : ""}`}>
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            console.warn(`Image failed: ${src}`);
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400";
          }}
        />
      </div>
    );
  };

  const renderLogoSlide = (
    <Link to={categories[0].link} className="relative w-full h-full flex items-center">
      <div className="relative overflow-hidden w-full max-w-full h-[100vw] sm:h-[50vh] md:h-[60vh] lg:h-screen">
        <div className="absolute w-full h-full">
          {logoImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute w-full h-full ${index === currentSlide ? "z-10" : "z-0 pointer-events-none"}`}
            >
              <LazyImage src={img} alt={`Logo Design ${index + 1}`} />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-8 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold z-20">
          Logo & Corporate Identity
        </div>
      </div>
    </Link>
  );

  return (
    <section
      id="image-slider"
      className="min-h-screen bg-white w-full flex flex-col items-stretch lg:flex-row lg:items-stretch"
    >
      <motion.div
        ref={ref as any}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {renderLogoSlide}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 h-full">
            {categories.slice(1).map((category) => (
              <Link key={category.name} to={category.link}>
                <div className="relative overflow-hidden w-full h-[100vw] sm:h-[25vh] md:h-[30vh] lg:h-[50vh] cursor-pointer">
                  <LazyImage src={category.images[0]} alt={`${category.name} Image`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-8 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold z-20">
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
