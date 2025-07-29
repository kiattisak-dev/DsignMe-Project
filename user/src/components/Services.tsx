import React, { useState, useEffect } from "react";
import { Palette, Megaphone, Eye, Package, Globe } from "lucide-react";
import { Link } from "react-router-dom";

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
        "Home-Picture/Logo/LOGO1.jpg",
        "Home-Picture/Logo/LOGO2.jpg",
        "Home-Picture/Logo/LOGO3.jpg",
        "Home-Picture/Logo/LOGO4.jpg",
      ],
    },
    {
      icon: Megaphone,
      title: "Advertisement",
      description: "ออกแบบเนื้อหาสื่อโฆษณา",
      link: "/services/advertisement",
      images: [
        "Home-Picture/Advertisement/ADS1.jpg",
        "Home-Picture/Advertisement/ADS2.jpg",
        "Home-Picture/Advertisement/ADS3.jpg",
        "Home-Picture/Advertisement/ADS4.jpg",
      ],
    },
    {
      icon: Eye,
      title: "Visual & Motion Graphic",
      description: "ออกแบบภาพและกราฟิกเคลื่อนไหว",
      link: "/services/visual",
      images: [
        "Home-Picture/Visual/VISUAL1.jpg",
        "Home-Picture/Visual/VISUAL2.jpg",
        "Home-Picture/Visual/VISUAL3.jpg",
        "Home-Picture/Visual/VISUAL4.jpg",
      ],
    },
    {
      icon: Package,
      title: "Product Retouch",
      description: "ออกแบบผลิตภัณฑ์และบรรจุภัณฑ์",
      link: "/services/product",
      images: [
        "Home-Picture/Product/Product1.jpg",
        "Home-Picture/Product/Product2.jpg",
        "Home-Picture/Product/Product3.jpg",
        "Home-Picture/Product/Product4.jpg",
      ],
    },
    {
      icon: Globe,
      title: "UX/UI & Development",
      description: "ออกแบบเว็บไซต์ที่ทันสมัยและใช้งานง่าย",
      link: "/services/web",
      images: [
        "Home-Picture/UXUI/UXUI1.jpg",
        "Home-Picture/UXUI/UXUI2.jpg",
        "Home-Picture/UXUI/UXUI3.jpg",
        "Home-Picture/UXUI/UXUI4.jpg",
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
            const nextSlide = (current + 1) % 4; // Cycle through 0, 1, 2
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
      className="py-10 sm:py-14 lg:py-15 bg-gradient-to-br from-gray-100 via-white to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0 sm:gap-0 lg:grid-cols-2 lg:gap-6">
          {/* First four cards in 2x2 grid */}
          {services.slice(0, 4).map((service, index) => (
            <Link to={service.link} key={index} className={`mb-6 sm:mb-8 lg:mb-0 ${
                index > 0 ? "border-t-2 border-gray-400" : ""
              }`}>
              <div
                className="relative w-full h-[100vw] sm:h-[50vw] md:h-[50vw] lg:h-96 !aspect-square sm:!aspect-square md:!aspect-square lg:aspect-auto overflow-hidden bg-gray-900/80 backdrop-blur-md border-2 border-gray-400"
              >
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
                  </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-4  ml-2 left-8 flex space-x-2">
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

                {/* Fixed Text Content with Vertical Line */}
                <div className="absolute bottom-8 left-6 right-6 z-10">
                  <div className="relative p-2">
                    <div className="absolute left-0 top-4 h-[calc(100%-1px)] w-0.5 bg-white z-20" />
                    <p className="text-gray-300 text-sm ml-2 mb-2">
                      {service.description}
                    </p>
                    <h3 className="text-xl font-semibold ml-2 text-white">
                      {service.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Fifth card in full-width row */}
        <div className="mt-6 sm:mt-8 lg:mt-12 lg:mx-auto lg:max-w-[50%]">
          <Link to={services[4].link}>
            <div className="relative w-full h-[100vw] sm:h-[50vw] md:h-[50vw] lg:h-96 !aspect-square sm:!aspect-square md:!aspect-square lg:aspect-auto overflow-hidden bg-gray-900/80 backdrop-blur-md border-2 border-gray-400">
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
                </div>
              ))}

              {/* Slide Indicators */}
              <div className="absolute bottom-4 ml-2 left-8 flex space-x-2">
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

              {/* Fixed Text Content with Vertical Line */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="relative p-2">
                  <div className="absolute left-0 top-4 h-[calc(100%-8px)] w-0.5 bg-white z-20" />
                  <p className="text-gray-300 text-sm ml-2 mb-2">
                    {services[4].description}
                  </p>
                  <h3 className="text-xl font-semibold ml-2 mb-2 text-white">
                    {services[4].title}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;