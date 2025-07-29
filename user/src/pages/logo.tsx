import React, { useState, useEffect, useRef, useMemo } from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import { logoPageData } from "../types/data";
import { PortfolioItem, Service } from "../types/types";
import { motion } from "framer-motion";

// กำหนด interface สำหรับ response ของ project และ service step
interface ProjectResponse {
  _id: string;
  imageUrl?: string;
  videoUrl?: string;
  videoLink?: string;
  title?: string;
  description?: string;
  mediaType?: string;
}

interface ServiceStepSubtitle {
  text?: string;
  headings?: string[];
}

interface ServiceStep {
  title?: string;
  subtitles?: ServiceStepSubtitle[];
}

// ฟังก์ชันแปลง mediaType string เป็น type union ที่ PortfolioItem ต้องการ
const mapMediaType = (
  input?: string
): "video" | "image" | "youtube" | undefined => {
  if (input === "video" || input === "image" || input === "youtube") {
    return input;
  }
  return undefined;
};

const LogoPage: React.FC = () => {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, servicesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/projects/logo`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/servicesteps/logo/service-steps`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!projectsResponse.ok) {
          throw new Error(`Failed to fetch projects: ${projectsResponse.statusText}`);
        }
        if (!servicesResponse.ok) {
          throw new Error(`Failed to fetch service steps: ${servicesResponse.statusText}`);
        }

        const projectsData: { data: ProjectResponse[] } = await projectsResponse.json();
        const servicesData: { data: ServiceStep[] } = await servicesResponse.json();

        const projects = projectsData.data || [];
        const serviceSteps = servicesData.data || [];

        const mappedPortfolioImages: PortfolioItem[] = useMemo(() => {
          return projects
            .map((project, index) => {
              const id = project._id || `fallback-${index}`;
              return {
                id,
                url: project.imageUrl || "",
                videoUrl: project.videoUrl || "",
                videoLink: project.videoLink || "",
                title: project.title || "Logo Project",
                category: "logo",
                description: project.description || "",
                mediaType: mapMediaType(project.mediaType),
              };
            })
            .filter((item) => {
              if (!item.id || item.id === "") {
                console.warn(`Skipping project with invalid ID: ${JSON.stringify(item)}`);
                return false;
              }
              return true;
            });
        }, [projects]);

        const mappedServices: Service[] = useMemo(() => {
          return serviceSteps.map((step) => ({
            title: step.title || "Service",
            description: step.subtitles
              ? step.subtitles.map((sub) => sub.text || "").join(" ")
              : "",
            features: step.subtitles
              ? step.subtitles.flatMap((sub) => sub.headings || [])
              : [],
          }));
        }, [serviceSteps]);

        setPortfolioImages(mappedPortfolioImages);
        setServices(mappedServices);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`Fetch error: ${err.message}`);
          setError(err.message || "เกิดข้อผิดพลาดขณะดึงข้อมูล");
        } else {
          setError("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSection
          title="Loading..."
          description="Loading..."
          contactInfo={[]}
        />
        <PortfolioSection portfolioImages={Array(6).fill({ id: "skeleton", url: "", title: "Loading..." })} />
        <ServicesSection services={Array(3).fill({ title: "Loading...", description: "", features: [] })} />
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
      const navbarHeight = 100; // ปรับตามความสูงของ navbar
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
        title={logoPageData.title}
        description={logoPageData.description}
        contactInfo={logoPageData.contactInfo}
        onServicesClick={scrollToServices}
      />
      <PortfolioSection portfolioImages={portfolioImages} />
      <div ref={servicesSectionRef}>
        <ServicesSection services={services} />
      </div>
      <ProcessSection process={logoPageData.process} />
    </div>
  );
};

export default React.memo(LogoPage);