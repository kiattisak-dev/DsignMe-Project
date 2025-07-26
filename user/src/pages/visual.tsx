import React, { useState, useEffect, useRef } from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import { visualPageData } from "../types/data";
import { PortfolioItem, Service } from "../types/types";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const VisualPage: React.FC = () => {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch portfolio images for 'visual' category
        const projectsResponse = await fetch(
          `${API_BASE_URL}/projects/visual`,
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

        // Map projects to portfolioImages with available media fields
        const mappedPortfolioImages: PortfolioItem[] = projects.map(
          (project: any, index: number) => {
            const id = project._id || project.id || `fallback-${index}`; // Fallback to index if id is missing
            return {
              id,
              url: project.imageUrl || "",
              videoUrl: project.videoUrl || "",
              videoLink: "", // ถ้า backend ไม่มี videoLink, ตั้งเป็น empty
              title: project.title || "Visual Project",
              category: project.category || "visual",
              description: project.description || "",
              mediaType: project.mediaType || undefined, // ใช้ mediaType จาก backend
            };
          }
        );

        // Test media accessibility only for non-YouTube URLs
        for (const item of mappedPortfolioImages) {
          const mediaUrl = item.videoUrl || item.url || "";
          if (
            mediaUrl &&
            !(mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be"))
          ) {
            try {
              const response = await fetch(mediaUrl, { method: "HEAD" });
              if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${mediaUrl}`);
              }
            } catch (imgErr: any) {
              console.warn(
                `Media not accessible: ${mediaUrl}, Error: ${imgErr.message}`
              );
              // Clear invalid media URLs
              item.url = "";
              item.videoUrl = "";
              item.mediaType = undefined;
            }
          }
        }
        setPortfolioImages(mappedPortfolioImages);

        // Fetch service steps for 'visual' category
        const servicesResponse = await fetch(
          `${API_BASE_URL}/servicesteps/visual/service-steps`,
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
          title: step.title,
          description: "",
          subtitles: step.subtitles
            ? step.subtitles.map((sub: any) => sub.text || "")
            : [],
          features: step.subtitles.flatMap((sub: any) => sub.headings || []),
        }));
        setServices(mappedServices);

        setLoading(false);
      } catch (err: any) {
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
          <p className="text-gray-500">กรุณาลองใหม่ในภายหลัง</p>
        </div>
      </div>
    );
  }
  const scrollToServices = () => {
    if (servicesSectionRef.current) {
      servicesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div>
      <HeroSection
        title={visualPageData.title}
        description={visualPageData.description}
        contactInfo={visualPageData.contactInfo}
        onServicesClick={scrollToServices}
      />
      <PortfolioSection portfolioImages={portfolioImages} />
      <div ref={servicesSectionRef}> {/* Wrap ServicesSection with ref */}
        <ServicesSection services={services} />
      </div>
      <ProcessSection process={visualPageData.process} />
    </div>
  );
};

export default VisualPage;
