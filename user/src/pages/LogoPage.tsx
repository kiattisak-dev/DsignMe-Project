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
        const mappedPortfolioImages: PortfolioItem[] = projects.map(
          (project: any) => ({
            id: project.ID,
            url: project.ImageUrl || "",
            title: project.title || "Logo Project",
            category: "logo",
          })
        );
        setPortfolioImages(mappedPortfolioImages);

        // Test image accessibility for each image
        for (const item of mappedPortfolioImages) {
          if (item.url) {
            try {
              await fetch(item.url, { method: "HEAD" });
            } catch (imgErr) {
              // Silently handle image accessibility errors
            }
          }
        }

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
          title: step.title,
          description: step.subtitles.map((sub: any) => sub.text).join(" "),
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
