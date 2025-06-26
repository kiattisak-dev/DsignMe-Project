import React, { useState, useEffect } from "react";
import { Palette, Megaphone, Eye, Package, Globe } from "lucide-react";

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
        "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
    {
      icon: Megaphone,
      title: "AD Content",
      description: "ออกแบบเนื้อหาสื่อโฆษณา",
      link: "/services/advertisement",
      images: [
        "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
    {
      icon: Eye,
      title: "Visual & Motion Graphic",
      description: "ออกแบบภาพและกราฟิกเคลื่อนไหว",
      link: "/services/visual",
      images: [
        "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
    {
      icon: Package,
      title: "Product Design",
      description: "ออกแบบผลิตภัณฑ์และบรรจุภัณฑ์",
      link: "/services/product",
      images: [
        "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
    {
      icon: Globe,
      title: "Web Design",
      description: "ออกแบบเว็บไซต์ที่ทันสมัยและใช้งานง่าย",
      link: "/services/web",
      images: [
        "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800",
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState<{ [key: number]: number }>({});
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
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-100 via-white to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* First four cards in 2x2 grid */}
          {services.slice(0, 4).map((service, index) => (
            <div key={index} className="mb-6 sm:mb-8 lg:mb-0">
              <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-900/80 backdrop-blur-md border border-gray-300/50">
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
                      className="w-full h-full object-cover"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="p-2">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-gray-800/30 text-gray-200 text-xs rounded-full border border-gray-500/50">
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
                          ? "bg-white scale-110"
                          : "bg-gray-500 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-700/50">
                  <div
                    className="h-full bg-gray-300 transition-all duration-300 ease-linear"
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
            </div>
          ))}
        </div>
        {/* Fifth card in full-width row */}
        <div className="mt-6 sm:mt-8 lg:mt-12">
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-900/80 backdrop-blur-md border border-gray-300/50">
            {services[4].images.map((img, imgIndex) => (
              <div
                key={imgIndex}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  (currentSlide[4] || 0) === imgIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              >
                <img
                  src={img}
                  alt={`${services[4].title} ${imgIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.log(
                      `Image failed to load for ${services[4].title} ${
                        imgIndex + 1
                      }`
                    );
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x300";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="p-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-gray-800/30 text-gray-200 text-xs rounded-full border border-gray-500/50">
                        {services[4].title}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {services[4].title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {services[4].description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              {services[4].images.map((_, imgIndex) => (
                <button
                  key={imgIndex}
                  onClick={() => {
                    setIsPaused(true);
                    setCurrentSlide((prev) => ({
                      ...prev,
                      4: imgIndex,
                    }));
                    setTimeout(() => setIsPaused(false), 5000);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    (currentSlide[4] || 0) === imgIndex
                      ? "bg-white scale-110"
                      : "bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700/50">
              <div
                className="h-full bg-gray-300 transition-all duration-300 ease-linear"
                style={{
                  width: `${
                    (((currentSlide[4] || 0) + 1) / services[4].images.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;