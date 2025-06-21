import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Megaphone, Eye, Package } from "lucide-react";

// Define the interface for each service
interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  link: string;
  images: string[];
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      icon: Palette,
      title: "Logo & Corporate Identity",
      description: "ออกแบบโลโก้และอัตลักษณ์องค์กร",
      link: "/services/logo",
      images: [
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
      ],
    },
    {
      icon: Megaphone,
      title: "AD Content",
      description: "ออกแบบเนื้อหาสื่อโฆษณา",
      link: "/services/advertisement",
      images: [
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
      ],
    },
    {
      icon: Eye,
      title: "Visual & Motion Graphic",
      description: "ออกแบบภาพและกราฟิกเคลื่อนไหว",
      link: "/services/visual",
      images: [
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
      ],
    },
    {
      icon: Package,
      title: "Product Design",
      description: "ออกแบบผลิตภัณฑ์และบรรจุภัณฑ์",
      link: "/services/product",
      images: [
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
        "https://picsum.photos/400/300?grayscale",
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState<{ [key: number]: number }>(
    {}
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused) {
      interval = setInterval(() => {
        services.forEach((_, index) => {
          setCurrentSlide((prev) => {
            const current = prev[index] || 0;
            const nextSlide = (current + 1) % 3; // Cycle through 0, 1, 2
            return { ...prev, [index]: nextSlide };
          });
        });
      }, 3000); // Slide every 3 seconds
    }
    return () => clearInterval(interval); // Cleanup on unmount or pause
  }, [isPaused, services]);

  return (
    <section
      id="services"
      className="py-12 sm:py-16 lg:py-20 bg-white bg-gradient-to-br from-white via-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {services.map((service, index) => (
          <div key={index} className="mb-6 sm:mb-8 lg:mb-12 last:mb-0">
            <Link to={service.link}>
              <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                {service.images.map((img, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      (currentSlide[index] || 0) === imgIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${service.title} ${imgIndex + 1}`}
                      className="w-full h-full object-contain max-w-full max-h-full"
                      loading="lazy"
                      onError={(e) => {
                        console.log(
                          `Image failed to load for ${service.title} ${
                            imgIndex + 1
                          }`
                        );
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x300";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="p-2">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full border border-primary-500/30">
                            {service.title}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-6 right-6 flex space-x-2">
                  {service.images.map((_, imgIndex) => (
                    <button
                      key={imgIndex}
                      onClick={() => {
                        setIsPaused(true);
                        setCurrentSlide((prev) => ({
                          ...prev,
                          [index]: imgIndex,
                        }));
                        setTimeout(() => setIsPaused(false), 5000);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        (currentSlide[index] || 0) === imgIndex
                          ? "bg-primary-500 scale-110"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-800/50">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300 ease-linear"
                    style={{
                      width: `${
                        (((currentSlide[index] || 0) + 1) /
                          service.images.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;