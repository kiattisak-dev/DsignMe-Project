import React, { useState, useEffect, useRef } from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import { websiteDevelopPageData } from "../types/data";
import { PortfolioItem, Service } from "../types/types";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const WebsiteDevelopPage: React.FC = () => {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch portfolio images for 'website-develop' category
        const projectsResponse = await fetch(
          `${API_BASE_URL}/projects/website-develop`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (!projectsResponse.ok) {
          throw new Error(
            `Failed to fetch projects: ${projectsResponse.statusText}`
          );
        }
        const projectsData = await projectsResponse.json();
        const projects = projectsData.data || [];

        // Map projects to portfolioImages
        const mappedPortfolioImages: PortfolioItem[] = projects
          .map((project: any, index: number) => {
            const id = project._id || project.ID || `fallback-${index}`;
            const imageUrl =
              project.imageUrl || project.ImageUrl || project.ImageURL || "";
            const title = project.title || "Website Development Project";
            return {
              id,
              url: imageUrl,
              videoUrl:
                project.videoUrl || project.VideoUrl || project.VideoURL || "",
              videoLink: project.videoLink || project.VideoLink || "",
              title,
              category: "website-develop",
              description: project.description || "",
              mediaType: project.mediaType || undefined,
            };
          })
          .filter((item: PortfolioItem) => {
            if (!item.id || item.id === "") {
              console.warn(
                `Skipping project with invalid ID: ${JSON.stringify(item)}`
              );
              return false;
            }
            return true;
          });

        // Test media accessibility for each item
        for (const item of mappedPortfolioImages) {
          if (item.url) {
            try {
              const response = await fetch(item.url, { method: "HEAD" });
              if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${item.url}`);
              }
            } catch (imgErr: any) {
              console.warn(
                `Image not accessible: ${item.url}, ID: ${item.id}, Error: ${imgErr.message}`
              );
              item.url = "";
            }
          }
          if (
            item.videoUrl &&
            !(
              item.videoUrl.includes("youtube.com") ||
              item.videoUrl.includes("youtu.be")
            )
          ) {
            try {
              const response = await fetch(item.videoUrl, { method: "HEAD" });
              if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${item.videoUrl}`);
              }
              console.log(`Video accessible: ${item.videoUrl}`);
            } catch (videoErr: any) {
              console.warn(
                `Video not accessible: ${item.videoUrl}, ID: ${item.id}, Error: ${videoErr.message}`
              );
              item.videoUrl = "";
            }
          }
          if (
            item.videoLink &&
            !(
              item.videoLink.includes("youtube.com") ||
              item.videoLink.includes("youtu.be")
            )
          ) {
            try {
              const response = await fetch(item.videoLink, { method: "HEAD" });
              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status} for ${item.videoLink}`
                );
              }
              console.log(`Video link accessible: ${item.videoLink}`);
            } catch (linkErr: any) {
              console.warn(
                `Video link not accessible: ${item.videoLink}, ID: ${item.id}, Error: ${linkErr.message}`
              );
              item.videoLink = "";
            }
          }
        }
        setPortfolioImages(mappedPortfolioImages);

        // Fetch service steps for 'website-develop' category
        const servicesResponse = await fetch(
          `${API_BASE_URL}/servicesteps/website-develop/service-steps`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (!servicesResponse.ok) {
          throw new Error(
            `Failed to fetch service steps: ${servicesResponse.statusText}`
          );
        }
        const servicesData = await servicesResponse.json();
        const serviceSteps = servicesData.data || [];

        // Map service steps to services
        const mappedServices: Service[] = serviceSteps.map((step: any) => ({
          title: step.title || "Service",
          description: step.subtitles
            ? step.subtitles.map((sub: any) => sub.text || "").join("\n")
            : "",
          features: step.subtitles
            ? step.subtitles.flatMap((sub: any) => sub.headings || [])
            : [],
        }));
        setServices(mappedServices);

        setLoading(false);
      } catch (err: any) {
        console.error(`Fetch error: ${err.message}`);
        setError(err.message || "เกิดข้อผิดพลาดขณะดึงข้อมูล");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="text-center filter grayscale"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-black">กำลังโหลดข้อมูล...</p>
          <p className="text-gray-600 mt-2">กรุณารอสักครู่</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">
            ข้อผิดพลาด: {error}
          </p>
          <p className="text-gray-500 mt-2">กรุณาลองใหม่ในภายหลัง</p>
        </div>
      </div>
    );
  }

  const scrollToServices = () => {
    if (servicesSectionRef.current) {
      const navbarHeight = 100; // Adjust this value based on your navbar height
      const elementPosition = servicesSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <HeroSection
        title={websiteDevelopPageData.title}
        description={websiteDevelopPageData.description}
        contactInfo={websiteDevelopPageData.contactInfo}
         onServicesClick={scrollToServices}
      />
      <PortfolioSection portfolioImages={portfolioImages} />
     <div ref={servicesSectionRef}> {/* Wrap ServicesSection with ref */}
        <ServicesSection services={services} />
      </div>
      <ProcessSection process={websiteDevelopPageData.process} />
    </div>
  );
};

export default WebsiteDevelopPage;
