"use client";

import React, { useState, useEffect, useRef } from "react";
import HeroSection from "../components/ui/HeroSection";
import PortfolioSection from "../components/ui/PortfolioSection";
import ServicesSection from "../components/ui/ServicesSection";
import ProcessSection from "../components/ui/ProcessSection";
import { advertisementPageData } from "../types/data";
import { PortfolioItem, Service } from "../types/types";
import { motion } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;

type ValidMediaType = "video" | "image" | "youtube" | undefined;

interface ProjectAPI {
  _id?: string;
  ID?: string;
  imageUrl?: string;
  ImageUrl?: string;
  ImageURL?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  VideoUrl?: string;
  VideoURL?: string;
  videoLink?: string;
  VideoLink?: string;
  mediaType?: string;
}

interface ServiceStep {
  title?: string;
  subtitles?: string[];
  headings?: string[];
}

function parseMediaType(value?: string): ValidMediaType {
  if (value === "video" || value === "image" || value === "youtube") {
    return value;
  }
  return undefined;
}

const AdvertisementPage: React.FC = () => {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(4);
  const servicesSectionRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async (limit: number = 4, offset: number = 0) => {
    try {
      const projectsResponse = await fetch(
        `${apiUrl}/projects/advertisement?limit=${limit}&offset=${offset}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!projectsResponse.ok) {
        throw new Error(`Failed to fetch projects: ${projectsResponse.statusText}`);
      }

      const projectsData: { data: ProjectAPI[] } = await projectsResponse.json();
      const projects = projectsData.data || [];

      const mappedPortfolioImages: PortfolioItem[] = projects
        .map((project, index) => {
          const id = project._id || project.ID || `fallback-${index}`;
          const imageUrl = project.imageUrl || project.ImageUrl || project.ImageURL || "";
          return {
            id,
            url: imageUrl,
            videoUrl: project.videoUrl || project.VideoUrl || project.VideoURL || "",
            videoLink: project.videoLink || project.VideoLink || "",
            title: project.title || "Advertisement Project",
            category: "advertisement",
            description: project.description || "",
            mediaType: parseMediaType(project.mediaType),
          };
        })
        .filter((item) => {
          if (!item.id || item.id === "") {
            console.warn(`Skipping project with invalid ID: ${JSON.stringify(item)}`);
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
      const moreProjects = await fetchProjects(8, offset);
      if (moreProjects.length < 8) {
        setHasMore(false);
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
        const [initialProjects, servicesResponse] = await Promise.all([
          fetchProjects(4),
          fetch(`${apiUrl}/servicesteps/advertisement/service-steps`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        setPortfolioImages(initialProjects);

        if (!servicesResponse.ok) {
          throw new Error(`Failed to fetch service steps: ${servicesResponse.statusText}`);
        }

        const servicesData: { data: ServiceStep[] } = await servicesResponse.json();
        const serviceSteps = servicesData.data || [];

        const mappedServices: Service[] = serviceSteps.map((step) => ({
          title: step.title || "Service",
          description: step.subtitles || [],
          features: step.headings || [],
          timeline: step.subtitles?.find((s) => s.includes("ระยะเวลา")) || "",
          revisions: step.subtitles?.find((s) => s.includes("แก้ไข")) || "",
        }));

        setServices(mappedServices);
        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Fetch error: ${message}`);
        setError(message || "เกิดข้อผิดพลาดขณะดึงข้อมูล");
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
        title={advertisementPageData.title}
        description={advertisementPageData.description}
        contactInfo={advertisementPageData.contactInfo}
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
      <ProcessSection process={advertisementPageData.process} />
    </div>
  );
};

export default AdvertisementPage;