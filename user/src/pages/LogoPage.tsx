import React, { useState, useEffect } from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import { logoPageData } from "../types/data";
import { PortfolioItem, Service } from "../types/types";
import { motion } from "framer-motion";

const LogoPage: React.FC = () => {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch portfolio images for 'logo' category
        const projectsResponse = await fetch(
          "http://localhost:8081/projects/logo",
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
            const id = project._id || `fallback-${index}`; // Fallback if _id is missing
            const imageUrl = project.imageUrl || "";
            const title = project.title || "Logo Project";
            return {
              id,
              url: imageUrl,
              videoUrl: project.videoUrl || "",
              videoLink: project.videoLink || "",
              title,
              category: "logo",
              description: project.description || "",
              mediaType: project.mediaType || undefined,
            };
          })
          .filter((item: PortfolioItem) => {
            // Filter out invalid projects
            if (!item.id || item.id === "") {
              console.warn(`Skipping project with invalid ID: ${JSON.stringify(item)}`);
              return false;
            }
            return true;
          });

        // Test image accessibility for each image
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
              item.url = ""; // Clear invalid URL
            }
          }
          if (item.videoUrl) {
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
              item.videoUrl = ""; // Clear invalid URL
            }
          }
        }

        setPortfolioImages(mappedPortfolioImages);

        // Fetch service steps for 'logo' category
        const servicesResponse = await fetch(
          "http://localhost:8081/servicesteps/logo/service-steps",
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
            ? step.subtitles.map((sub: any) => sub.text || "").join(" ")
            : "",
          features: step.subtitles ? step.subtitles.flatMap((sub: any) => sub.headings || []) : [],
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

  return (
    <div>
      <HeroSection
        title={logoPageData.title}
        description={logoPageData.description}
        contactInfo={logoPageData.contactInfo}
      />
      <PortfolioSection portfolioImages={portfolioImages} />
      <ServicesSection services={services} />
      <ProcessSection process={logoPageData.process} />
    </div>
  );
};

export default LogoPage;