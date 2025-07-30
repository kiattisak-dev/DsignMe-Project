"use client";

import React, { useState, useEffect, useRef } from "react";
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

interface ServiceStep {
  title?: string;
  subtitles?: string[];
  headings?: string[];
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
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(4); // เริ่มจาก 4 เพราะโหลด 4 รายการแรกแล้ว
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchProjects = async (limit: number = 4, offset: number = 0) => {
    try {
      const projectsResponse = await fetch(
        `${API_BASE_URL}/projects/logo?limit=${limit}&offset=${offset}`,
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

      const projectsData: { data: ProjectResponse[] } =
        await projectsResponse.json();
      const projects = projectsData.data || [];

      const mappedPortfolioImages: PortfolioItem[] = projects
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
            console.warn(
              `Skipping project with invalid ID: ${JSON.stringify(item)}`
            );
            return false;
          }
          return true;
        });

      return mappedPortfolioImages;
    } catch (err) {
      throw err;
    }
  };

  const fetchMoreProjects = async () => {
    setIsFetchingMore(true);
    try {
      const moreProjects = await fetchProjects(8, offset); // โหลด 8 รายการต่อครั้ง
      if (moreProjects.length < 8) {
        setHasMore(false); // ถ้าได้น้อยกว่า 8 รายการ แปลว่าไม่มีข้อมูลเพิ่มแล้ว
      }
      setPortfolioImages((prev) => [...prev, ...moreProjects]);
      setOffset((prev) => prev + 8);
      setIsFetchingMore(false);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Fetch more error: ${err.message}`);
        setError(err.message || "เกิดข้อผิดพลาดขณะดึงข้อมูลเพิ่มเติม");
      } else {
        setError("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
      }
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // โหลด projects และ servicesteps พร้อมกัน
        const [initialProjects, servicesResponse] = await Promise.all([
          fetchProjects(4),
          fetch(`${API_BASE_URL}/servicesteps/logo/service-steps`, {
            headers: {
              Accept: "application/json",
            },
          }),
        ]);

        setPortfolioImages(initialProjects);

        if (!servicesResponse.ok) {
          throw new Error(
            `Failed to fetch service steps: ${servicesResponse.statusText}`
          );
        }

        const servicesData: { data: ServiceStep[] } =
          await servicesResponse.json();
        const serviceSteps = servicesData.data || [];

        const mappedServices: Service[] = serviceSteps.map((step) => ({
          title: step.title || "Service",
          description: step.subtitles ? step.subtitles.join(" ") : "",
          features: step.headings || [],
          timeline: step.subtitles?.includes("ระยะเวลา")
            ? step.subtitles.find((s) => s.includes("ระยะเวลา")) || ""
            : "",
          revisions: step.subtitles?.includes("แก้ไข")
            ? step.subtitles.find((s) => s.includes("แก้ไข")) || ""
            : "",
        }));

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
      const navbarHeight = 100;
      const elementPosition =
        servicesSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset;
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
      <PortfolioSection
        portfolioImages={portfolioImages}
        isFetchingMore={isFetchingMore}
        onFetchMore={fetchMoreProjects}
        hasMore={hasMore}
      />
      <div ref={servicesSectionRef}>
        <ServicesSection services={services} />
      </div>
      <ProcessSection process={logoPageData.process} />
    </div>
  );
};

export default LogoPage;